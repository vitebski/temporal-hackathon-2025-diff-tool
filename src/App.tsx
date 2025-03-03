// // App.tsx
// import React from 'react';
// import MermaidChart from './MermaidChart';

// const diagram1 = `
// flowchart TD
// AddToCart --> Checkout
// Checkout --> Ship

// style Checkout fill:#00C853
// `;

// const diagram2 = `
// flowchart TD
// AddToCart --> Checkout
// Checkout --> Ship

// style Checkout fill:#00C853
// `;

// const App: React.FC = () => {
//   return (
//     <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
//       <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
//         <h3 style={{ textAlign: 'center' }}>Workflow Diagram 1</h3>
//         <MermaidChart chart={diagram1} />
//       </div>
//       <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
//         <h3 style={{ textAlign: 'center' }}>Workflow Diagram 2</h3>
//         <MermaidChart chart={diagram2} />
//       </div>
//     </div>
//   );
// };

// export default App;

// App.tsx
import React from 'react';
import ComparedMermaidCharts from './ComparedMermaidCharts';

const App: React.FC = () => {
  return (
    <div>
      <ComparedMermaidCharts />
    </div>
  );
};

export default App;
