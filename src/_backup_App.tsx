import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';

export default function App() {
  // Include setNodes in the destructuring
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );


  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ padding: '10px' }}>
        <input
          type="file"
          accept=".json"
          onChange={(event) => {
            if (!event.target.files?.[0]) return;
            
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              try {
                const flowData = JSON.parse(e.target?.result as string);
                if (flowData.nodes && flowData.edges) {
                  // Update the flow with data from file
                  const [newNodes, newEdges] = [flowData.nodes, flowData.edges];
                  // We need to modify App.tsx to expose setNodes
                  setNodes(newNodes);  // Update nodes state
                  setEdges(newEdges);  // Update edges state
                  // setNodes(newNodes); // Uncomment after fixing the hook
                  console.log('Loaded flow:', flowData);
                }
              } catch (error) {
                console.error('Error parsing flow data:', error);
              }
            };
            fileReader.readAsText(event.target.files[0]);
          }}
        />
      </div>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
