import React, { createContext, useContext, useState, ReactNode } from 'react';

export enum ModalType {
  None = 'NONE',
  Type1 = 'TYPE1',
  Type2 = 'TYPE2',
  Type3 = 'TYPE3',
  Type4 = 'TYPE4',
  // Ajoutez d'autres types au besoin
}

interface ModalContextType {
  modalType: ModalType;
  modalProps: any; // Pour passer des données spécifiques à chaque modale
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

const defaultContext: ModalContextType = {
  modalType: ModalType.None,
  modalProps: {},
  openModal: () => {},
  closeModal: () => {},
};

const ModalContext = createContext<ModalContextType>(defaultContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  const [modalProps, setModalProps] = useState<any>({});

  const openModal = (type: ModalType, props = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(ModalType.None);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modalType, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
