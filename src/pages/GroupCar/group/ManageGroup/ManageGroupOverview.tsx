import React, {useEffect, useRef} from 'react';
import ManageGroupOverviewInfo from './ManageGroupGroupInfo';
import ManageGroupTabs from './ManageGroupTabs/ManageGroupTabs';
import {
  createStyles,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ManageGroupActions from './ManageGroupActions';

/**
 * Styles.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%',
      minHeight: '400px',
    },
    tabsDesktop: {
      height: '400px',
    },
    footer: {
      marginTop: theme.spacing(1),
    },
  }),
);

/**
 * Overview over the specified group.
 * @props Props
 */
export const ManageGroupOverview: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const smallerXs = useMediaQuery(theme.breakpoints.down('xs'));
  const containerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const animate = () => {
    return window.requestAnimationFrame(() => {
      const containerHeight = containerRef.current?.clientHeight || 400;
      const overviewHeight = overviewRef.current?.clientHeight || 0;
      const actionsHeight = actionsRef.current?.clientHeight || 0;

      if (tabsRef.current) {
        tabsRef.current.style.height = containerHeight -
            overviewHeight -
            actionsHeight -
            13 +
            'px';
      }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      animationFrameId.current = animate();
    };

    if (smallerXs) {
      handleResize();
      window.addEventListener('resize', handleResize);
    } else {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId.current);
      if (tabsRef.current) {
        tabsRef.current.style.height = '400px';
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId.current);
    };
  }, [smallerXs]);

  return (
    <div
      className={classes.container}
      ref={containerRef}
    >
      <div
        ref={overviewRef}
      >
        <ManageGroupOverviewInfo />
      </div>
      <div
        className={smallerXs ? undefined : classes.tabsDesktop}
        ref={tabsRef}
      >
        <ManageGroupTabs/>
      </div>
      <div
        ref={actionsRef}
        className={classes.footer}
      >
        <ManageGroupActions />
      </div>
    </div>
  );
};

export default ManageGroupOverview;
