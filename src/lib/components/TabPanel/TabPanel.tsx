import React, {PropsWithChildren} from 'react';

/**
 * Props for TabPanel
 */
export interface TabPanelProps {
  /**
   * Whether or not this panel is currently shown.
   */
  visible: boolean;
  id?: string;
  'aria-labelledby'?: string;
  className?: string;
}

/**
 * Tab panel for `Tabs`.
 * @param props Props
 */
export const TabPanel =
// eslint-disable-next-line react/display-name
React.forwardRef<
HTMLDivElement,
PropsWithChildren<TabPanelProps>
>((props, ref) => {
  return (
    <div
      className={props.className}
      role='tabpanel'
      hidden={!props.visible}
      id={props.id}
      aria-labelledby={props['aria-labelledby']}
      ref={ref}
    >
      {props.visible && props.children}
    </div>
  );
});

export default TabPanel;
