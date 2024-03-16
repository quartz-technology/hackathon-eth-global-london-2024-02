import React, { useState } from 'react';

// Edit Condition

const ModalType4 = ({ closeModal }: any) => {
  const [budget, setBudget] = useState('');
  const [allowanceDelay, setAllowanceDelay] = useState('');

  const allowanceDelaysOptions = [
    { label: '12h', value: '12h' },
    { label: '24h', value: '24h' },
    { label: '3d', value: '3d' },
    // Ajoutez d'autres options ici
  ];

  const handleSaveChanges = () => {
    // TODO: add logical
    closeModal();
  };

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8">
      <div className="mb-4 border-b pb-2">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700"> Withdraw limit (in USDC)</label>
          <input
            type="number"
            name="budget"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Amount"
          />
        </div>

        <div>
          <label htmlFor="delay" className="block text-sm font-medium text-gray-700">Allowance Delay</label>
          <select
            id="delay"
            name="delay"
            value={allowanceDelay}
            onChange={(e) => setAllowanceDelay(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {allowanceDelaysOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
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
          Edit
        </button>
      </div>
    </div>
  );
};

export default ModalType4;
