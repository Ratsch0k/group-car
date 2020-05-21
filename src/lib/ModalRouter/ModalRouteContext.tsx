import React from 'react';

export interface IModalContext {
  close(): void;
  goTo(route: string | null | undefined): void;
  route: string;
}

const ModalContext = React.createContext<IModalContext>({
  close: () => {},
  goTo: () => {},
  route: '/',
});

interface ModalProviderProps {
  close(): void;
  goTo(route: string | undefined | null): void;
  route: string;
}

/**
 * The component for providing the modal context to nested components
 * @param props Props of the component
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
