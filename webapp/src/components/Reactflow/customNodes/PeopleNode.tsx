import React, { useState, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface PeopleProps extends NodeProps {
  data: {
    photoUrl: string;
    name: string;
  };
}

const PeopleNode: React.FC<PeopleProps> = ({data}) => {

  return (
    <>
    <Handle
    type="target"
    position={Position.Top}
    style={{ background: '#555' }}
    isConnectable={true}
  />

<div className="flex w-full items-center justify-between space-x-6 p-6 border-2">
    <div className="flex items-center justify-center  flex-col">
        <img className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-300" src={data.photoUrl} alt="" />
        <div className="flex flex-col">
            <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700   ring-green-600/20">
                {"ROLE"}
            </span>
        </div>
    </div>
    <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">{data.name}</h3>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{"TITLE"}</p>
    </div>
</div>


    
  </>
  );
};

export default PeopleNode;
