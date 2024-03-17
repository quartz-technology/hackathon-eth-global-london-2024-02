'use client';

import React, { createContext, ReactNode, useContext as useReactContext } from 'react';
import { addEdge, Edge, Node, NodeChange, OnNodesChange, useEdgesState, useNodesState } from 'reactflow';

interface FlowStateContext {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  handleNodesChange: any;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: any;
  addDepartment: (label: string, allocatedBudget: number, index?: number, id?: string) => void;
  addPeopleNode: (departmentId: string, peopleData: { name: string; photoUrl: string }) => void;
}

const FlowContext = createContext<FlowStateContext | undefined>(undefined);

const departmentY = 300; 
const departmentXStart = 100;
const departmentXSpacing = 450; 

const peopleStartY = 450;
const peopleXSpacing = 220;
const peopleYSpacing = 140;

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addDepartment = (label: string, allocatedBudget: number, index?: number, id?: string) => {
    const newNodeId = `department-${id ?? Math.random().toString(36).substr(2, 9)}`;
    const departmentIndex = index ?? nodes.filter(node => node.type === "department").length;

    const newNode: Node = {
      id: newNodeId,
      type: "department",
      position: {
        x: departmentXStart + departmentIndex * departmentXSpacing,
        y: departmentY,
      },
      data: { label, allocatedBudget },
    };

    const newEdge: Edge = {
        id: `e${newNodeId}-to-master-node`,
        source: "master-node",
        target: newNodeId,
        type: 'default',
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setNodes((nds) => [...nds, newNode]);
  };

  const addPeopleNode = (departmentId: string, peopleData: { name: string; photoUrl: string }) => {
    const departmentNode = nodes.find(node => node.id === departmentId);
    if (!departmentNode) return;
  
    const peopleInDepartment = nodes.filter(node => node.data.departmentId === departmentId).length;
    const newRow = Math.floor(peopleInDepartment / 2); // 3 people par rangée pour cet exemple
    const newIndexInRow = peopleInDepartment % 2;
  
    const newPeopleNode: Node = {
      id: `people-${Math.random().toString(36).substr(2, 9)}`,
      type: "people",
      position: {
        x: (departmentNode.position.x - 20) + newIndexInRow * peopleXSpacing,
        y: peopleStartY + newRow * peopleYSpacing,
      },
      data: { ...peopleData, departmentId: departmentId }, // Ajoutez departmentId aux données
    };

    const newEdge: Edge = {
        id: `e${departmentId}-to-${newPeopleNode.id}`,
        source: departmentId,
        target: newPeopleNode.id,
        type: "straight",
      };

    setNodes((nds) => [...nds, newPeopleNode]);
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const handleNodesChange: OnNodesChange = (changes) => {
    changes.forEach((change) => {
      if (change.type === 'remove') {
        console.log(`Node supprimé : ${change.id}`);
      }
    });
  
    onNodesChange(changes);
  };

  return (
    <FlowContext.Provider
      value={{
        nodes,
        setNodes,
        handleNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        addDepartment,
        addPeopleNode,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = () => {
  const context = useReactContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlowContext must be used within a FlowProvider');
  }
  return context;
};
