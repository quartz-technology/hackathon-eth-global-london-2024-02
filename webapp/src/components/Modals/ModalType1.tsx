import React, {useEffect, useState} from 'react';
import { useFlowContext } from 'src/contexts/flowContext';
import {useCreateGroupMutation} from "../../services/request/group";
import {useUserContext} from "../../contexts/userContext";
import {useGetUserOrganisationQuery} from "../../services/request/user";

import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import {CreateGroupResponse} from "../../Types/group";

let sdk: W3SSdk

// Create Depart

const ModalType1 = ({ closeModal }: any) => {
  const {  addDepartment } = useFlowContext();

  const { userConnectResponse } = useUserContext();
  const {data: userOrganisation } = useGetUserOrganisationQuery(undefined, {skip: !userConnectResponse});
  const [triggerCreateGroup] = useCreateGroupMutation();

  const [budget, setBudget] = useState('');
  const [allowanceDelay, setAllowanceDelay] = useState('');
  const [name, setName] = useState('');

  const [waitingForChallenge, setWaitingForChallenge] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<string | undefined>(undefined);

  const allowanceDelaysOptions = [
    { label: 'None', value: 0 },
    { label: '24h', value: 1 },
    { label: '48h', value: 2 },
    // Ajoutez d'autres options ici
  ];

  useEffect(() => {
    sdk = new W3SSdk()
  }, [])

  const handleSaveChanges = async () => {
    // Ici, vous pouvez appeler une API ou effectuer d'autres actions avec les valeurs de l'état
    console.log('Saving changes with the following values:');
    console.log(`Budget: ${budget}, Allowance Delay: ${allowanceDelay}, Name: ${name}`);

    if (!userOrganisation) return;
    const fetchRes = await triggerCreateGroup({name: name, allocation: parseInt(budget), organisationID: userOrganisation.organisations[0].id});
    setChallenge((fetchRes as any).data.challengeID)

    setWaitingForChallenge(true);
  };

  const finalize = async () => {
    console.log(userConnectResponse)
    console.log(challenge)
    if (!userConnectResponse || !challenge) return

    sdk.setAppSettings({ appId: '1d98a445-1573-50f8-a929-29a3bcb2ee17' })
    sdk.setAuthentication({ userToken: userConnectResponse?.user.userToken, encryptionKey: userConnectResponse?.user.encryptionKey })

    sdk.execute(challenge, (error, result) => {
      if (error) {
        console.error(`Error: ${error?.message ?? 'Error!'}`)
        return
      }
      console.log(`Challenge: ${result?.type}, Status: ${result?.status}`)
      addDepartment(name, Number(budget));
      // Fermer la modale après la sauvegarde
      closeModal();
    })
  }

  return (
      <>
        {waitingForChallenge ? <>
          <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8">
            <div className="mb-4 border-b pb-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Validation</h3>
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
                  onClick={finalize}
              >
                Finalize
              </button>
            </div>
          </div>

        </> : <>
          <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8">
            <div className="mb-4 border-b pb-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Configuration</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Withdraw limit (in
                  USDC)</label>
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
                Save Changes
              </button>
            </div>
          </div>
        </>}
      </>
  );
};

export default ModalType1;
