import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect, Fragment } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { useFlowContext } from 'src/contexts/flowContext';
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

  const [budget, setBudget] = useState(data.budget || 0);

  useEffect(() => {
    // Supposons que data.remaining est calculé ailleurs et passé ici
    // Cet effet est juste pour refléter les changements dans le state local
    if (data.budget !== budget) {
      setBudget(data.budget || 0);
    }
  }, [data.budget, budget]);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseFloat(e.target.value);
   // setBudget(isNaN(newBudget) ? 0 : newBudget);
    // Ici, vous devez implémenter la logique pour mettre à jour le budget global dans l'état de l'application
    // Cela peut impliquer de soulever cet état et de fournir une fonction de mise à jour en tant que prop
  };


  const client = {
    
      id: 1,
      name: 'Tuple',
      imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
      lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
  }
  
  

  return (
    <>
    {/*  */}

    <div className="flex items-center  gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 border-2 rounded-t-lg">
            <img
              src={client.imageUrl}
              alt={client.name}
              className="h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm  text-centerfont-medium leading-6 text-gray-900">Master</div>
            <Menu as="div" className="relative ml-auto">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                  {/* TODO: add modal */}

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
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Create<span className="sr-only">, {client.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <dl className=" divide-y divide-gray-100 px-6 py-4 text-sm leading-6 rounded-b-lg border-b-2 border-x-2 ">
            <div className="flex justify-between ">
              <dt className="text-gray-500">Number Department</dt>
              <dd className="text-gray-700">
                <span>{nodes.filter(node => node.id.includes("department")).length}</span>
              </dd>
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
