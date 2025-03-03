// compareMermaid.ts

/**
 * Extract nodes from a Mermaid diagram definition.
 * If the diagram uses bracket notation (e.g., A[Label]), then we extract the identifier and label.
 * Otherwise, we assume nodes are defined by simple arrow syntax and use the bare identifier.
 */
export function extractNodes(mermaidText: string): Map<string, string> {
    const nodeMap = new Map<string, string>();
  
    // If the diagram uses brackets, use them.
    if (mermaidText.includes('[')) {
      // Matches lines like: A[Label] (optionally with spaces)
      const regex = /^(\w+)\s*\[([^\]]+)\]/gm;
      let match;
      while ((match = regex.exec(mermaidText)) !== null) {
        const id = match[1];
        const label = match[2].trim();
        nodeMap.set(id, label);
      }
    } else {
      // For diagrams without brackets, extract nodes from arrow definitions.
      // Match the left-hand side of arrows.
      const regexLeft = /(\w+)\s*-->/g;
      let match;
      while ((match = regexLeft.exec(mermaidText)) !== null) {
        nodeMap.set(match[1], match[1]);
      }
      // Match the right-hand side of arrows.
      const regexRight = /-->\s*(\w+)/g;
      while ((match = regexRight.exec(mermaidText)) !== null) {
        nodeMap.set(match[1], match[1]);
      }
    }
  
    console.log("Extracted nodes:", Array.from(nodeMap.entries()));
    return nodeMap;
  }
  
  /**
   * Compare two Mermaid diagrams and return a set of node IDs that differ.
   * A node is considered different if it exists in one diagram but not the other,
   * or if the associated label (when applicable) is different.
   */
  export function diffNodes(diagram1: string, diagram2: string): Set<string> {
    const nodes1 = extractNodes(diagram1);
    const nodes2 = extractNodes(diagram2);
    const diff = new Set<string>();
  
    // For nodes in diagram1
    nodes1.forEach((label, id) => {
      if (!nodes2.has(id)) {
        diff.add(id);
      } else if (nodes2.get(id) !== label) {
        diff.add(id);
      }
    });
  
    // For nodes in diagram2 that are missing from diagram1
    nodes2.forEach((label, id) => {
      if (!nodes1.has(id)) {
        diff.add(id);
      }
    });
  
    console.log("Diff nodes:", Array.from(diff.values()));
    return diff;
  }
  
  /**
   * Append Mermaid style statements to the diagram definition for each node in nodeIds.
   * This will add lines like: style <node> fill:<color>;
   */
  export function addStylesToMermaid(mermaidText: string, nodeIds: Set<string>, color: string): string {
    let styleStatements = "";
    nodeIds.forEach(id => {
      styleStatements += `\nstyle ${id} fill:${color};`;
    });
    const modifiedText = mermaidText + styleStatements;
    console.log("Modified Mermaid diagram:\n", modifiedText);
    return modifiedText;
  }
  