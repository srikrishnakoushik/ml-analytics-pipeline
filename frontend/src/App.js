import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background 
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import PipelineNode from './components/PipelineNode';
import './App.css';

// ✅ FIX: Define this OUTSIDE the component.
// This guarantees it never triggers a re-render warning.
const nodeTypes = {
  dataset: PipelineNode,
  preprocess: PipelineNode,
  split: PipelineNode,
  model: PipelineNode
};

const initialNodes = [
  { id: '1', type: 'dataset', data: { label: '📂 Dataset Upload' }, position: { x: 250, y: 5 } },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Global State
  const [pipelineState, setPipelineState] = useState({
    columns: [],
    targetCol: '',
    splitRatio: 0.8,
    preprocessing: 'StandardScaler',
    modelType: 'Logistic Regression'
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('label');

      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="app-layout">
      <ReactFlowProvider>
        <Sidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes} 
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
        <RightPanel 
          selectedNode={selectedNode} 
          pipelineState={pipelineState}
          setPipelineState={setPipelineState}
        />
      </ReactFlowProvider>
    </div>
  );
}