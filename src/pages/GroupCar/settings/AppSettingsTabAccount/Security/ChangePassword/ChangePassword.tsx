import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import ChangePasswordForm from './ChangePasswordForm';
import AttributeField from 'lib/components/AttributeField';
import {GroupCarTheme} from 'lib';

interface DefaultPasswordFieldProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
  },
  button: {
    flexGrow: 0,
    flexShrink: 0,
    margin: -theme.spacing(1),
  },
}));

const DefaultPasswordField = ({onClick}: DefaultPasswordFieldProps) => {
  const {t} = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.text}>
        ********
      </Typography>
      <Button
        onClick={onClick}
        color='primary'
        className={classes.button}
      >
        {t('misc.edit')}
      </Button>
    </div>
  );
};

export const ChangePassword = (): JSX.Element => {
  const {t} = useTranslation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (wrapperRef.current && contentRef.current) {
      wrapperRef.current.style.height = contentRef.current.clientHeight + 'px';
    }
  }, []);

  useEffect(() => {
    let observer: ResizeObserver;
    if (contentRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(contentRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <AttributeField
      label={t('misc.password')}
      style={{overflow: 'hidden'}}
    >
      <div
        ref={wrapperRef}
        style={{transition: 'height 250ms ease-in-out', width: '100%'}}
      >
        <div ref={contentRef}>
          {
            isEditing ?
              <ChangePasswordForm onClose={() => setIsEditing(false)} /> :
              <DefaultPasswordField onClick={() => setIsEditing(true)} />
          }
        </div>
      </div>
    </AttributeField>
  );
};

export default ChangePassword;
