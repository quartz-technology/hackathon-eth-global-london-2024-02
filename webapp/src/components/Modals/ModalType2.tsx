import React, {useEffect, useState} from 'react';
import { useFlowContext } from 'src/contexts/flowContext';
import {useUserContext} from "../../contexts/userContext";
import {useGetUserOrganisationQuery} from "../../services/request/user";
import {useAddUserToGroupMutation} from "../../services/request/group";

import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import {
    useAddUserToOrganisationMutation,
    useGetOrganisationByIdQuery,
    useLazyGetOrganisationByIdQuery
} from "../../services/request/organisation";

let sdk: W3SSdk

// Add People

const ModalType2 = ({ closeModal, someProp }: any) => {
    const { addPeopleNode } = useFlowContext();

    const [name, setName] = useState('');

    const { userConnectResponse } = useUserContext();
    const {data: userOrganisation } = useGetUserOrganisationQuery(undefined, {skip: !userConnectResponse});
    const [triggerAddGroup] = useAddUserToGroupMutation();

    const [triggerAddtoOrg, {isSuccess: orgaSuccess}] = useAddUserToOrganisationMutation();

    const [triggerGetOrgaDetails] = useLazyGetOrganisationByIdQuery();

    const [waitingForChallenge, setWaitingForChallenge] = useState<boolean>(false);
    const [challenge, setChallenge] = useState<string | undefined>(undefined);

    useEffect(() => {
        sdk = new W3SSdk()
    }, [])

    const addUserToOrga = async () => {
        if (!userOrganisation) return;


        // await triggerAddtoOrg({username: name, organisationID: userOrganisation.organisations[0].id});

        const res = await triggerGetOrgaDetails({organisationID: userOrganisation.organisations[0].id});
        const scaping = (res as any).data.organisation.users.find((n: any) => n.name === name);

        const fetchRes = await triggerAddGroup({groupID: someProp.id, groupAddress: '0x1e6754B227C6ae4B0ca61D82f79D60660737554a', targetID: scaping.id});
        setChallenge((fetchRes as any).data.challengeID)
    }

    const handleSaveChanges = async () => {
        // Ici, vous pouvez appeler une API ou effectuer d'autres actions avec les valeurs de l'état
          if (!userOrganisation) return;
          const fetchRes = await triggerAddGroup({groupID: someProp.id, groupAddress: '0x1e6754B227C6ae4B0ca61D82f79D60660737554a', targetID: name});
          setChallenge((fetchRes as any).data.challengeID)
        closeModal();
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

            const newPerson = {
                name: name, // Exemple statique, à rendre dynamique selon vos besoins
                photoUrl: "https://noun.pics/"+ Math.floor(Math.random() * 1044) + ".svg" // TODO: SDK
            };
            addPeopleNode(someProp.id, newPerson);

            closeModal();
        })
    }

  return (
      <>
          {!orgaSuccess && <>
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
                          onClick={addUserToOrga}
                      >
                          Add people
                      </button>
                  </div>
              </div>
          </>}

      </>
  );
};

export default ModalType2;
