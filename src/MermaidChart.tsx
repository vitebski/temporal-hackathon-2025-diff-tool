// MermaidChart.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export interface MermaidChartProps {
  chart: string;
  onNodeHover?: (nodeId: string | null, source: string) => void;
  highlightedNode?: string | null;
  source: string; // e.g., "diagram1" or "diagram2"
}

const MermaidChart: React.FC<MermaidChartProps> = ({
  chart,
  onNodeHover,
  highlightedNode,
  source,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const idRef = useRef('mermaid-' + Math.floor(Math.random() * 1000000));

  // Render the Mermaid diagram asynchronously.
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    if (chartRef.current) {
      (async () => {
        try {
          const renderResult = await mermaid.render(idRef.current, chart);
          chartRef.current!.innerHTML = renderResult.svg;
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
        }
      })();
    }
  }, [chart]);

  // Attach event listeners directly to node elements after a short delay.
  useEffect(() => {
    if (!onNodeHover) return;
    const timeout = setTimeout(() => {
      const svgElement = chartRef.current?.querySelector('svg');
      if (!svgElement) return;

      // Query for node elements (using a flexible selector)
      const nodeElements = svgElement.querySelectorAll('g.node, [class*="node"]');
      const handlers: { element: Element; mouseOver: EventListener; mouseOut: EventListener }[] = [];

      nodeElements.forEach((nodeEl) => {
        let nodeId = nodeEl.getAttribute('id');
        if (nodeId) {
          // Remove "flowchart-" prefix if present.
          if (nodeId.startsWith('flowchart-')) {
            nodeId = nodeId.slice('flowchart-'.length);
          }
          // Extract base ID (ignoring any numeric suffix after a dash).
          nodeId = nodeId.split('-')[0];
          const mouseOver = () => {
            console.log(`Mouse over node: ${nodeId} from ${source}`);
            onNodeHover(nodeId, source);
          };
          const mouseOut = () => {
            console.log(`Mouse out node: ${nodeId} from ${source}`);
            onNodeHover(null, source);
          };
          nodeEl.addEventListener('mouseover', mouseOver);
          nodeEl.addEventListener('mouseout', mouseOut);
          handlers.push({ element: nodeEl, mouseOver, mouseOut });
        }
      });

      // Cleanup function to remove listeners.
      return () => {
        handlers.forEach(({ element, mouseOver, mouseOut }) => {
          element.removeEventListener('mouseover', mouseOver);
          element.removeEventListener('mouseout', mouseOut);
        });
      };
    }, 300); // Adjust delay as needed.

    return () => clearTimeout(timeout);
  }, [chart, onNodeHover, source]);

  // Update highlighted node styling when highlightedNode changes.
  useEffect(() => {
    const svgElement = chartRef.current?.querySelector('svg');
    if (!svgElement) return;

    // Select node elements using a flexible selector.
    const nodeElements = svgElement.querySelectorAll('g.node, [class*="node"]');
    nodeElements.forEach((nodeEl) => {
      let nodeId = nodeEl.getAttribute('id');
      if (nodeId) {
        if (nodeId.startsWith('flowchart-')) {
          nodeId = nodeId.slice('flowchart-'.length);
        }
        nodeId = nodeId.split('-')[0];
      }
      if (nodeId === highlightedNode) {
        // Try to highlight a child shape element (if available).
        const shape = nodeEl.querySelector('rect, polygon, ellipse, path');
        if (shape) {
          (shape as SVGElement).setAttribute('stroke', 'red');
          (shape as SVGElement).setAttribute('stroke-width', '4');
          (shape as SVGElement).style.stroke = 'red';
          (shape as SVGElement).style.strokeWidth = '4px';
        } else {
          // Cast nodeEl to SVGElement to access style.
          (nodeEl as SVGElement).setAttribute('stroke', 'red');
          (nodeEl as SVGElement).setAttribute('stroke-width', '4');
          (nodeEl as SVGElement).style.stroke = 'red';
          (nodeEl as SVGElement).style.strokeWidth = '4px';
        }
      } else {
        // Remove highlighting.
        const shape = nodeEl.querySelector('rect, polygon, ellipse, path');
        if (shape) {
          (shape as SVGElement).removeAttribute('stroke');
          (shape as SVGElement).removeAttribute('stroke-width');
          (shape as SVGElement).style.stroke = '';
          (shape as SVGElement).style.strokeWidth = '';
        }
        (nodeEl as SVGElement).removeAttribute('stroke');
        (nodeEl as SVGElement).removeAttribute('stroke-width');
        (nodeEl as SVGElement).style.stroke = '';
        (nodeEl as SVGElement).style.strokeWidth = '';
      }
    });
  }, [highlightedNode, chart]);

  return <div ref={chartRef} />;
};

export default MermaidChart;
