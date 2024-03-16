"use client"
import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import MasterNode from './customNodes/MasterNode';
import DepartmentNode from './customNodes/DepartmentNode';
import PeopleNode from './customNodes/PeopleNode';
import { useFlowContext } from 'src/contexts/flowContext';

export default function Dashboard() {
  const { nodes, setNodes, handleNodesChange, edges, onEdgesChange, addDepartment } = useFlowContext();

  const nodeTypes = useMemo(() => ({
    master: MasterNode,
    department: DepartmentNode,
    people: PeopleNode,
  }), []);

  const edgeTypes = useMemo(() => ({}), []);

  useEffect(() => {
    setNodes([
      {
        id: 'master-node',
        type: 'master',
        position: { x: window.innerWidth / 2 - 50, y: 25 },
        data: { label: 'Master Node', remaining: "90" },
      },
    ]);
  }, []);

  return (
    <div className='w-[72vw] h-[100vh] relative'>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
      {/* <div className="flex flex-1 flex-row-reverse">
            <div onClick={() => {addDepartment(`Name`, 1000); }} className="cursor-pointer absolute  bottom-0 mr-2 mb-2 z-50 flex items-center justify-center bg-red-500 rounded-full h-20 w-20">
                +
            </div>
        </div> */}
    </div>
  );
}
