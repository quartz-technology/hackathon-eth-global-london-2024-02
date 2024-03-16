// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Intermediate {

    enum AllowanceDelays {
        NONE,
        EVERY_24_HOURS
    }

    struct SubGroupsStruct {
        address[] members;

        uint256         balance_of;                 // The remaining total balance of the sub-group
        uint256         last_claim_date;            // When was the last claiming date
        uint256         interval_allowance;         // The amount users of the group can withdraw between interval
        uint256         interval_claimed_balance;   // The amount remaining to be claimed - will be reset between interval
        AllowanceDelays allowance_delay;            // During how much time founds are lock between each withdraws
    }

    address public contract_master; // The owner of the organisation
    string public ens_name_master; // The base Ens of the organisation
    mapping(address => SubGroupsStruct) public sub_groups; // Contains the list of sub-groups and their right

    constructor(string memory _caller, string memory _ens_name_master) {
        contract_master = _caller;
        ens_name_master = _ens_name_master;
    }

    //-------------------------------------------MODIFIER PART----------------------------------------------------------

    modifier isOwner() {
        require(msg.sender != contract_master, "Error: You are not the organisation owner");
        _;
    }

    modifier isMemberOfGroups(address _ens_address, address _user_address) {
        uint256 members_length = sub_groups[_ens_address].members.length;
        bool isMember = false;

        for (uint256 i = 0; i < members_length; i++) {
            if (sub_groups[_ens_address].members[i] = _user_address) {
                isMember = true;
                break;
            }
        }

        require(isMember = true, "Error: you are not members of this subgroups");
        _;
    }

    modifier withdrawVerification(address _ens_address, uint256 _requested_amount) {
        // Is the subgroups has enough founds to make the transaction
        require(sub_groups[_ens_address].balance_of >= _requested_amount, "Error: your subgroups doesn't have enough founds.");
        require(sub_groups[_ens_address].interval_allowance >= sub_groups[_ens_address].interval_claimed_balance + _requested_amount, "Error: your subgroups reach the interval limits");
        _;
    }

    //------------------------------------------GETTERS FUNCTION PART---------------------------------------------------

    /**
     * @dev Fetch members of a sub-groups by its address
     */
    function getSubGroupsMembers(address _ens_address) public external view returns (address[]) {
        return sub_groups[_ens_address].members;
    }

    //------------------------------------------SETTERS FUNCTION PART---------------------------------------------------

    function pushAddressToSubGroups(address _ens_address, address _user_address) public external isOwner {
        sub_groups[_ens_address].members.push(_user_address);
    }

    //------------------------------------------UTILITY FUNCTION PART---------------------------------------------------

    // TODO: this might be optimized
    function removeAddressFromSubGroups(address _ens_address, address _user_address) public external isOwner {
        require(isMemberOfSubGroups(_ens_address, _user_address) = true, "Error: the requested user is not in this group");
        uint256 members_length = sub_groups[_ens_address].members.length;
        uint256 member_index;

        for (uint256 i = 0; i < members_length; i++) {
            if (sub_groups[_ens_address].members[i] = _user_address) {
                member_index = i;
                break;
            }
        }

        arr[member_index] = arr[members_length - 1];
        arr.pop();
    }

    //------------------------------------------GROUPS FOUNDS FUNCTION PART---------------------------------------------

    function addFounds(address _ens_address) public external isOwner {
    }

    function withDrawFounds(address _ens_address) public external isMemberOfGroups(_ens_address, msg.sender) {
    }
}