import React, { useState } from 'react';
import { useFlowContext } from 'src/contexts/flowContext';

// Add People

const ModalType2 = ({ closeModal, someProp }: any) => {
    const { addPeopleNode } = useFlowContext();

  const [name, setName] = useState('');

  const handleSaveChanges = () => {
    // Ici, vous pouvez appeler une API ou effectuer d'autres actions avec les valeurs de l'état
    const newPerson = {
        name: name, // Exemple statique, à rendre dynamique selon vos besoins
        photoUrl: "https://noun.pics/"+ Math.floor(Math.random() * 1044) + ".svg" // TODO: SDK
    };
    addPeopleNode(someProp.id, newPerson);

    closeModal();
  };

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8">
      <div className="mb-4 border-b pb-2">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Configuration</h3>
      </div>
      
      

      <div className="mt-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., mysubgroup.eth"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleSaveChanges}
        >
          Add people
        </button>
      </div>
    </div>
  );
};

export default ModalType2;
