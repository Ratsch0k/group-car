import React from 'react';
import ModalCheck from './ModalCheck';

/**
 * The modal router which handles routing for modals by using the parameter
 * `modal` of the url to determine the modal route.
 * @param props Props of the component. Only containing the children
 * @return Modal router
 */
const ModalRouter: React.FC = (props) => {
  return (
    <ModalCheck>
      {props.children}
    </ModalCheck>
  );
};

export default ModalRouter;
