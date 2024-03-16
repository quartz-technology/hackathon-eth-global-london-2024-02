// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Intermediate {

    enum AllowanceDelays {
        NONE,
        EVERY_24_HOURS
    }

    struct SubGroupsStruct {
        address[] members;

        uint256         balance_of;         // The remaining balance of the sub-group
        uint256         last_claim_date;    // When was the last claiming date
        uint256         interval_allowance; // The amount users of the group can withdraw
        AllowanceDelays allowance_delay;    // During how much time founds are lock between each withdraws
    }

    address public contract_master; // The owner of the organisation
    string public ens_name_master; // The base Ens of the organisation
    mapping(address => SubGroupsStruct) public SubGroupsStruct; // Contains the list of sub-groups and their right

    constructor(string memory _caller, string memory _ens_name_master) {
        contract_master = _caller;
        ens_name_master = _ens_name_master;
    }

    //------------------------------------------UTILITY FUNCTION PART---------------------------------------------------
}

// Ajouter des gens dans une liste lié à un ENS
//
