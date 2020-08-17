import React from 'react';
import history from 'history';

export interface IModalContext {
  close(): void;
  goTo(route: string | null | undefined): void;
  route: string;
  modalLocation: history.Location | undefined;
}

export const ModalContext = React.createContext<IModalContext>({
  close: () => undefined,
  goTo: () => undefined,
  route: '/',
  modalLocation: undefined,
});

interface ModalProviderProps {
  close(): void;
  goTo(route: string | undefined | null): void;
  route: string;
  modalLocation: history.Location;
}

/**
 * The component for providing the modal context to nested components
 * @param props Props of the component
 * @return The provider of the modal context
 */
export const ModalProvider: React.FC<ModalProviderProps> = (props) => {
  const {children, ...rest} = props;

  return (
    <ModalContext.Provider value={{
      ...rest,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
