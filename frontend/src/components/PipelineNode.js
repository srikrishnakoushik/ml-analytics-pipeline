import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, type }) => {
  // Define styles based on node type
  const getStyle = () => {
    switch (type) {
      case 'dataset': return { border: '2px solid #0041d0', background: '#eef3ff' };
      case 'model':   return { border: '2px solid #1a192b', background: '#f0f0f0' };
      default:        return { border: '2px solid #ff0072', background: '#fff0f6' };
    }
  };

  const style = {
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '12px',
    minWidth: '150px',
    textAlign: 'center',
    ...getStyle()
  };

  return (
    <div style={style}>
      {/* Input Handle (Target) - NOT for Dataset nodes */}
      {type !== 'dataset' && (
        <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      )}
      
      {/* The Label */}
      <div>{data.label}</div>

      {/* Output Handle (Source) - NOT for Model nodes (technically they are endpoints) */}
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
});