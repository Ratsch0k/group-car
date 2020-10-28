import React from 'react';

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
export const TabPanel: React.FC<TabPanelProps> = (props) => {
  return (
    <div
      className={props.className}
      role='tabpanel'
      hidden={!props.visible}
      id={props.id}
      aria-labelledby={props['aria-labelledby']}
    >
      {props.visible && props.children}
    </div>
  );
};

export default TabPanel;
