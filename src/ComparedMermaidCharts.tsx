// ComparedMermaidCharts.tsx
import React, { useState } from 'react';
import MermaidChart from './MermaidChart';
import { diffNodes, addStylesToMermaid } from './compareMermaid';

// Example Mermaid diagram definitions (bare identifiers)
const diagram1 = `
flowchart TD
  Start --> AddToCart
  AddToCart --> Checkout
  Checkout --> Ship
`;

const diagram2 = `
flowchart TD
  AddToCart --> Checkout
  Checkout --> Validate
  Validate --> Ship
  Ship --> Deliver
  Deliver --> Complete
`;

// Use diff functions if you want permanent diff highlighting (fill colors)
const differences = diffNodes(diagram1, diagram2);
const highlightColor = '#ffcccc';
const diagram1WithStyles = addStylesToMermaid(diagram1, differences, highlightColor);
const diagram2WithStyles = addStylesToMermaid(diagram2, differences, highlightColor);

const ComparedMermaidCharts: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Update state when a node is hovered in either diagram
  const handleNodeHover = (nodeId: string | null, source: string) => {
    setHoveredNode(nodeId);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Workflow Run#: 1</h3>
        <MermaidChart
          chart={diagram1WithStyles}
          onNodeHover={handleNodeHover}
          highlightedNode={hoveredNode}
          source="diagram1"
        />
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h3 style={{ textAlign: 'center' }}>Workflow Run#: 2</h3>
        <MermaidChart
          chart={diagram2WithStyles}
          onNodeHover={handleNodeHover}
          highlightedNode={hoveredNode}
          source="diagram2"
        />
      </div>
    </div>
  );
};

export default ComparedMermaidCharts;
