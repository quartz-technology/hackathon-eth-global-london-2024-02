import React from 'react';
import { ModalType, useModalContext } from 'src/contexts/modalContext';

export const DynamicModal = () => {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (modalType === ModalType.None) return null;

  return (
    <div className="modal-background">
      <div className="modal-content">
        {modalType === ModalType.Type1 && <div>Modal Type 1 Content</div>}
        {modalType === ModalType.Type2 && (
          <div>
            Modal Type 2 Content
            {/* Exemple d'utilisation des props */}
            <div>Prop passée : {modalProps.someProp}</div>
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};



