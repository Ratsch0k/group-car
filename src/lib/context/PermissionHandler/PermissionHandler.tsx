import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import EventEmitter from 'events';
import {Button, Dialog, ProgressButton} from 'lib/components';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import PermissionDenied from './PermissionDenied';
import PermissionDescription from './PermissionDescription';
import PermissionGranted from './PermissionGranted';
import {Permission, PermissionHandlerContext} from './PermissionHandlerContext';


interface PromptInfo {
  name: typeof Permission[number];
  promptUser: () => void;
  denied: boolean;
  granted: boolean;
}

const PERMISSION_GRANTED = 'permissionGranted';
const PERMISSION_DENIED = 'permissionDenied';
const PROMPT_CANCELED = 'promptCanceled';
const PROMPT_SUCCEEDED = 'promptSucceeded';

const promptEventEmitter = new EventEmitter();

/**
 * Permission handler for permissions that the user has to permit.
 *
 * This component provides functions to check and request permissions
 * for other components. To access these functions use the
 * {@link PermissionHandlerContext}.
 *
 * A permission is requested in a user friendly way. The user is
 * presented with a dialog explaining what permission is requested and
 * why and only opens the browser-specific permission prompt when the
 * user requests to open it. Granting or denying the permission
 * is presented to the user as well.
 *
 * Custom events are used to communicate the user's decision back to
 * the caller of the prompt function.
 *
 * @param props Children
 * @returns Component handling permissions
 */
export const PermissionHandler: FC = (props) => {
  const {children} = props;
  const {t} = useTranslation();
  /**
   * State of the permission that is currently requested.
   */
  const [permissionToPrompt, setPermissionToPrompt] =
  useState<PromptInfo | null>(null);
  const [promptQueue, setPromptQueue] = useState<PromptInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Prompt the geolocation permission by using
   * `navigator.geolocation.gerCurrentPosition`.
   *
   * Emits the events {@link PERMISSION_GRANTED} and {@link PERMISSION_DENIED}
   * depending on the users decision.
   */
  const promptGeolocation = useCallback(async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(() => {
      setLoading(false);
      promptEventEmitter.emit(PERMISSION_GRANTED, 'geolocation');
    }, (error) => {
      setLoading(false);
      if (error.code === error.PERMISSION_DENIED) {
        promptEventEmitter.emit(PERMISSION_DENIED, 'geolocation');
      } else {
        promptEventEmitter.emit(PERMISSION_GRANTED, 'geolocation');
      }
    });
  }, []);

  /**
   * Requests the permission given by name.
   *
   * Before prompting the user, it first checks if we already
   * have the permission and only prompts it if not.
   */
  const requestPermission =
  useCallback(async (name: typeof Permission[number]) => {
    const permissionState = await checkPermission(name);
    if (permissionState.state === 'granted') {
      return;
    }

    return promptPermission(name, permissionState.state === 'denied');
  }, []);

  /**
   * Get the permission status of the permission given by name.
   */
  const checkPermission = useCallback((name: typeof Permission[number]) => {
    return navigator.permissions.query({name});
  }, []);

  /**
   * Handles the next prompt from the queue.
   *
   * The next prompt is handled if no prompt is currently shown,
   * the queue is not empty and the prompt is currently not open.
   *
   * If those are true, it will take the first element from the
   * {@link promptQueue}. Next, it will set up the state such that
   * the user is prompted with a dialog for that permission.
   * Lastly, it will set up listeners to the custom events to
   * handle the user's action.
   */
  useEffect(() => {
    if (permissionToPrompt === null && promptQueue.length > 0 && !open) {
      // Take first element from queue
      const nextPrompt = promptQueue[0];
      setPromptQueue((prev) => prev.slice(1));

      // Set up state to show prompt
      setOpen(true);
      setPermissionToPrompt(nextPrompt);

      // Set up event handlers for custom events
      const grantedHandler = (name: string) => {
        if (name === nextPrompt.name) {
          setPermissionToPrompt((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              denied: false,
              granted: true,
            };
          });
        }
      };
      promptEventEmitter.once(PERMISSION_GRANTED, grantedHandler);

      const successHandler = (name: string) => {
        if (name === nextPrompt.name) {
          setOpen(false);
        }
      };
      promptEventEmitter.once(PROMPT_SUCCEEDED, successHandler);

      const deniedHandler = (name: string) => {
        if (name === nextPrompt.name) {
          setPermissionToPrompt((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              denied: true,
              granted: false,
            };
          });
        }
      };
      promptEventEmitter.once(PERMISSION_DENIED, deniedHandler);

      const cancelHandler = (name: string) => {
        if (name) {
          setOpen(false);
        }
      };
      promptEventEmitter.once(PROMPT_CANCELED, cancelHandler);
    }
  }, [promptQueue, permissionToPrompt, open]);

  /**
   * Prompts the permission given by name with the correct prompt
   * function.
   * @param name Name of the permission
   * @param denied Whether the user has previously denied the permission.
   */
  const promptPermission = useCallback((
    name: typeof Permission[number],
    denied: boolean,
  ) => {
    return new Promise<void>((resolve, reject) => {
      let promptUser: () => void;

      switch (name) {
        case 'geolocation': {
          promptUser = promptGeolocation;
          break;
        }
        default: {
          promptUser = () => new Error('Permission not supported');
        }
      }

      /*
       * Only append to the queue if no other prompt for the same
       * permission is already queued or prompted.
       */
      setPromptQueue((prev) => {
        if (
          prev.some((prompt) => prompt.name === name) ||
          permissionToPrompt?.name === name
        ) {
          return prev;
        }

        return [
          ...prev,
          {
            name,
            promptUser,
            denied,
            granted: false,
          },
        ];
      });

      const successHandler = (
        succeededName: string,
      ) => {
        if (succeededName === name) {
          resolve();
        }
      };
      promptEventEmitter.once(PROMPT_SUCCEEDED, successHandler);

      const cancelHandler = (
        canceledName: string,
      ) => {
        if (canceledName === name) {
          reject(new Error('User denied permission'));
        }
      };
      promptEventEmitter.on(PROMPT_CANCELED, cancelHandler);
    });
  }, []);

  /**
   * Handles canceling the prompt.
   */
  const handleCancel = useCallback(() => {
    if (permissionToPrompt) {
      promptEventEmitter.emit(PROMPT_CANCELED, permissionToPrompt.name);
    }
  }, [permissionToPrompt]);

  /**
   * Handles the closing the dialog after the user has granted
   * us the permission.
   */
  const handleClosePrompt = useCallback(() => {
    if (permissionToPrompt) {
      promptEventEmitter.emit(PROMPT_SUCCEEDED, permissionToPrompt.name);
    }
  }, [permissionToPrompt]);

  return (
    <PermissionHandlerContext.Provider
      value={{
        requestPermission,
        checkPermission,
      }}
    >
      {children}
      <Dialog
        open={open}
        maxWidth='xs'
        fullWidth
        TransitionProps={{
          onExited: () => setPermissionToPrompt(null),
        }}
      >
        <DialogTitle>
          {t('modals.permissionPrompt.' + permissionToPrompt?.name + '.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              permissionToPrompt?.granted ?
                <PermissionGranted /> :
                permissionToPrompt?.denied ?
                  <PermissionDenied /> :
                  permissionToPrompt ?
                    <PermissionDescription name={permissionToPrompt?.name} /> :
                    undefined
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            permissionToPrompt?.granted ?
              <Button
                onClick={handleClosePrompt}
                color='primary'
                variant='contained'
                disableCapitalization
              >
                {t('misc.close')}
              </Button>:
              <>
                <Button onClick={handleCancel} disableCapitalization>
                  {t('misc.cancel')}
                </Button>
                <ProgressButton
                  onClick={permissionToPrompt?.promptUser}
                  color='primary'
                  loading={loading}
                  variant='contained'
                  disableCapitalization
                >
                  {t('modals.permissionPrompt.promptMe')}
                </ProgressButton>
              </>
          }
        </DialogActions>
      </Dialog>
    </PermissionHandlerContext.Provider>
  );
};

export default PermissionHandler;
