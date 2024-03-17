// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract Intermediate {

    enum AllowanceDelays {
        NONE,
        EVERY_24_HOURS,
        EVERY_48_HOURS
    }

    struct SubGroupsStruct {
        address[] members;

        uint256         balance_of;                 // The remaining total balance of the sub-group
        uint256         last_claim_date;            // When was the last claiming date
        uint256         interval_allowance;         // The amount users of the group can withdraw between interval
        uint256         interval_remains_balance;   // The amount remaining to be claimed - will be reset between interval
        AllowanceDelays allowance_delay;            // During how much time founds are lock between each withdraws
    }

    IERC20 public usdc_erc_20 = IERC20(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238); // Sepolia USDC ERC20 address

    address public contract_master; // The owner of the organisation
    string public ens_name_master; // The base Ens of the organisation
    mapping(string => SubGroupsStruct) public sub_groups; // Contains the list of sub-groups and their right

    /**
    @dev used to claim a contract, this will normally be a constructor outside the demo context
    **/
    function claimContract(string memory _ens_name_master) external {
        contract_master = msg.sender;
        ens_name_master = _ens_name_master;
    }

    //-------------------------------------------MODIFIER PART----------------------------------------------------------

    modifier isOwner() {
        require(msg.sender == contract_master, "Error: You are not the organisation owner");
        _;
    }

    modifier isMemberOfGroups(string memory _ens_address, address _user_address) {
        uint256 members_length = sub_groups[_ens_address].members.length;
        bool isMember = false;

        for (uint256 i = 0; i < members_length; i++) {
            if (sub_groups[_ens_address].members[i] == _user_address) {
                isMember = true;
                break;
            }
        }

        require(isMember, "Error: you are not members of this subgroups");
        _;
    }

    /**
    @dev make sure that the sub-groups has enough funds to make a withdraw
    **/
    modifier withdrawVerification(string memory _ens_address, uint256 _requested_amount) {
        // First of all, reset the remains balance
        if (sub_groups[_ens_address].allowance_delay == AllowanceDelays.EVERY_24_HOURS
            && sub_groups[_ens_address].last_claim_date + 24 hours >= block.timestamp) {
            sub_groups[_ens_address].interval_remains_balance = sub_groups[_ens_address].interval_allowance;
            }
        if (sub_groups[_ens_address].allowance_delay == AllowanceDelays.EVERY_48_HOURS
            && sub_groups[_ens_address].last_claim_date + 48 hours >= block.timestamp) {
            sub_groups[_ens_address].interval_remains_balance = sub_groups[_ens_address].interval_allowance;
        }

        // Is the subgroups has enough founds to make the transaction
        require(sub_groups[_ens_address].balance_of >= _requested_amount, "Error: your subgroups doesn't have enough founds.");
        if (sub_groups[_ens_address].allowance_delay != AllowanceDelays.NONE) {
            require(sub_groups[_ens_address].interval_remains_balance - _requested_amount >= 0, "Error: your subgroups reach the interval limits");
        }
        _;
    }

    modifier checkAllowance(uint256 _amount) {
        require(usdc_erc_20.allowance(msg.sender, address(this)) >= _amount, "Error: The contract is not allowed to transfer this amount");
        _;
    }

    //------------------------------------------GETTERS FUNCTION PART---------------------------------------------------

    /**
     * @dev Fetch members of a sub-groups by its address
     */
    function getSubGroupsMembers(string memory _ens_address)
    external view returns (address[] memory) {
        return sub_groups[_ens_address].members;
    }

    //------------------------------------------SETTERS FUNCTION PART---------------------------------------------------

    /**
    @dev add a user to a subgroups
    **/
    function pushAddressToSubGroups(string memory _ens_address, address _user_address)
    external isOwner {
        uint256 members_length = sub_groups[_ens_address].members.length;
        bool isMember = false;

        for (uint256 i = 0; i < members_length; i++) {
            if (sub_groups[_ens_address].members[i] == _user_address) {
                isMember = true;
                break;
            }
        }

        require(!isMember, "Error: This member is already in the groups");
        sub_groups[_ens_address].members.push(_user_address);
    }

    //------------------------------------------UTILITY FUNCTION PART---------------------------------------------------

    /**
    @dev create a new subgroups with default values
    **/
    function createSubGroup(
        string memory _subgroup_ens_address,
        uint256 _interval_allowance,
        AllowanceDelays _allowance_delay
    ) external isOwner {
        address[] memory initial_members;

        sub_groups[_subgroup_ens_address] = SubGroupsStruct({
            members: initial_members,
            last_claim_date: block.timestamp,
            balance_of: 0,
            interval_allowance: _interval_allowance,
            interval_remains_balance: _interval_allowance,
            allowance_delay: _allowance_delay
        });
    }

    /**
    @dev manage a specific subgroups but updating some parameters
    **/
    function updateSubGroup(string memory _subgroup_address, uint256 _interval_allowance, AllowanceDelays _allowance_delay)
    external isOwner {
        require(sub_groups[_subgroup_address].last_claim_date != 0, "Error: The subgroup does not exist.");

        if (_interval_allowance != 0) {
            sub_groups[_subgroup_address].interval_allowance = _interval_allowance;
        }

        if (_allowance_delay != AllowanceDelays.NONE) {
            sub_groups[_subgroup_address].allowance_delay = _allowance_delay;
        }
    }

    /**
    @dev Remove a user from a subgroups
    **/
    function removeAddressFromSubGroups(string memory _ens_address, address _user_address)
    external isOwner isMemberOfGroups(_ens_address, _user_address) {
        uint256 members_length = sub_groups[_ens_address].members.length;
        uint256 member_index;

        for (uint256 i = 0; i < members_length; i++) {
            if (sub_groups[_ens_address].members[i] == _user_address) {
                member_index = i;
                break;
            }
        }

        sub_groups[_ens_address].members[member_index] = sub_groups[_ens_address].members[members_length - 1];
        sub_groups[_ens_address].members.pop();
    }

    //------------------------------------------GROUPS FUNCTION PART----------------------------------------------------

    /**
    @dev This function is used by the owner of the organisation to add some budget to a specific pole
    **/
    function addFounds(string memory _ens_address, uint256 _amount)
    external isOwner checkAllowance(_amount) {
        usdc_erc_20.transferFrom(msg.sender, address(this), _amount);

        sub_groups[_ens_address].balance_of += _amount;
    }

    /**
    @dev Members of a pole can use this to withdraw their allocated founds
    **/
    function withDrawFounds(string memory _ens_address, uint256 _amount)
    external isMemberOfGroups(_ens_address, msg.sender) withdrawVerification(_ens_address, _amount) {
        sub_groups[_ens_address].last_claim_date = block.timestamp;
        sub_groups[_ens_address].interval_remains_balance -= _amount;

        usdc_erc_20.transfer(msg.sender, _amount);
    }
}