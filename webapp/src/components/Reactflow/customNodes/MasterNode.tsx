import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect, Fragment } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { useFlowContext } from 'src/contexts/flowContext';
import { ModalType, useModalContext } from 'src/contexts/modalContext';
import { UseUserClient } from 'src/hooks/user/userClient';
import { useGetUserOrganisationQuery } from 'src/services/request/user';
import { classNames } from 'src/utils/classnameJoin';

interface MasterNodeProps extends NodeProps {
  data: {
    label: string;
    budget?: number;
    remaining?: number;
  };
}

const MasterNode: React.FC<MasterNodeProps> = ({data}) => {
  const { nodes, } = useFlowContext();
  const { openModal } = useModalContext();

  return (
    <>
    {/*  */}

    <div className="flex items-center  gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 border-2 rounded-t-lg">
            <img
              src="https://tailwindui.com/img/logos/48x48/tuple.svg"
              alt="Master-img"
              className="h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm  text-centerfont-medium leading-6 text-gray-900">Master</div>
            <Menu as="div" className="relative ml-auto">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />

              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  
                  <Menu.Item>
                    {({ active }) => (
                      <a
                      onClick={() => openModal(ModalType.Type1, { someProp: 'value' })}
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Create
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <dl className=" divide-y divide-gray-100 px-6 py-4 text-sm leading-6 rounded-b-lg border-b-2 border-x-2 ">
            <div className="flex-col justify-between ">
              <div className="flex justify-between">
                <dt className="text-gray-500">Number Department</dt>
                <dd className="text-gray-700">
                  <span>{nodes.filter(node => node.id.includes("department")).length}</span>
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-gray-500">Org ID</dt>
                <dd className="text-gray-700">
                  <span>{"ID"}</span>
                </dd>
              </div>
            </div>

          </dl>


    

    <Handle
    type="source"
    position={Position.Bottom}
    style={{ background: '#555' }}
    isConnectable={true}
  />

  </>
  );
};


export default MasterNode;
