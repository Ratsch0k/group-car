import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {createStyles, List, makeStyles} from '@material-ui/core';
import {GroupCarTheme} from 'lib/theme';
import LoadingSkeleton from '../LoadingSkeleton';

const useStyles = makeStyles((theme: GroupCarTheme) => createStyles({
  root: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    minWidth: 200,
  },
  wrapper: {
    transition: '250ms width',
  },
  list: {
    '&> *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export interface SettingsTabsProps {
  error?: boolean;
  loading?: boolean;
}


export const SettingsTabs: FC<SettingsTabsProps> = (props) => {
  const classes = useStyles();
  const {
    error,
    loading,
    children,
  } = props;
  const [ref, setRef] = useState<HTMLDivElement>();
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animateOnError();
  }, [error]);

  const animateOnError = useCallback(() => {
    if (ref && innerRef.current && originalWidth) {
      let oldWidth;
      let newWidth;

      if (error) {
        oldWidth = `${originalWidth}px`;
        newWidth = '0px';
      } else {
        oldWidth = '0px';
        newWidth = `${originalWidth}px`;
      }

      ref.style.width = newWidth;

      const animation = ref.animate(
        [
          {
            offset: 0,
            width: oldWidth,
          },
        ],
        {
          duration: 250,
          fill: 'both',
          easing: 'ease-out',
        },
      );

      animation.addEventListener('finish', () => {
        animation.cancel();
      });
      animation.play();
    }
  }, [ref, error, originalWidth]);

  const handleRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      setRef(node);
      setOriginalWidth((prev) => prev ? prev : node.scrollWidth);
      if (error) {
        animateOnError();
      }
    }
  }, [animateOnError]);

  return (
    <div className={classes.wrapper} ref={handleRef}>
      <div className={classes.root} ref={innerRef}>
        <List
          disablePadding
          className={classes.list}
        >
          {
            loading ?
              <LoadingTabs />:
              children
          }
        </List>
      </div>
    </div>
  );
};

const LoadingTab = () => <LoadingSkeleton height={48} variant='text' />;

const LoadingTabs = () => {
  return (
    <>
      <LoadingTab />
      <LoadingTab />
      <LoadingTab />
      <LoadingTab />
    </>
  );
};

export default SettingsTabs;
