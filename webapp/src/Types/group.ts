interface User {
    id: string;
    name: string;
    // Add more properties as needed
  }
  
interface Organisation {
    id: string;
    name: string;
    // Add more properties as needed
  }
  
interface Group {
    id: string;
    name: string;
    users: User[];
    organisation: Organisation;
    // Include additional properties relevant to a group here
  }
  
  export type CreateGroupResponse = {
    message: string;
    group: Group;
    challengeID: string;
  };
  
  export type JoinGroupResponse = {
    message: string;
    group: Group;
    challengeID: string;
  };
  
  export type GroupDetailsResponse = Group;
  
  // Request payloads
  export interface CreateGroupRequest {
    name: string;
    organisationID: number;
    allocation: number;
  }
  
  export interface AddUserToGroupRequest {
    targetID: string;
    groupAddress: string;
  }
  
  export interface GroupIDParam {
    groupID: number;
  }
  