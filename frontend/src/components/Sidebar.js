import React from 'react';

export default function Sidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3>Toolbox 📦</h3>
      <div className="description">Drag these to the canvas.</div>
      
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'dataset', 'Dataset Upload')} draggable>
        📂 Dataset Upload
      </div>
      
      <div className="dndnode processing" onDragStart={(event) => onDragStart(event, 'preprocess', 'Preprocessing')} draggable>
        ⚙️ Preprocessing
      </div>

      <div className="dndnode processing" onDragStart={(event) => onDragStart(event, 'split', 'Train-Test Split')} draggable>
        ✂️ Train-Test Split
      </div>
      
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'model', 'Model Training')} draggable>
        🤖 Model Training
      </div>
    </aside>
  );
}