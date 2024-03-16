import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ModalType, useModalContext } from 'src/contexts/modalContext';
import ModalType1 from './ModalType1';
import ModalType2 from './ModalType2';
import ModalType3 from './ModalType3';
import ModalType4 from './ModalType4';

const DynamicModal = () => {
  const { modalType, modalProps, closeModal } = useModalContext();
  const isOpen = modalType !== ModalType.None;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Dynamically render the modal content based on the modal type */}


                {modalType === ModalType.Type1 && (
                  <ModalType1 closeModal={closeModal} />
                )}


                {modalType === ModalType.Type2 && (
                  <ModalType2 closeModal={closeModal} someProp={modalProps}/>
                )}

                {modalType === ModalType.Type3 && (
                  <ModalType3 closeModal={closeModal} someProp={modalProps}/>
                )}

                {modalType === ModalType.Type4 && (
                  <ModalType4 closeModal={closeModal} someProp={modalProps}/>
                )}



                {/* Add more modal types as needed */}
                {/* <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                
                    
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                    onClick={() => {}}
                  >
                    Create
                  </button>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border  px-4 py-2 text-base font-medium  shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DynamicModal;
