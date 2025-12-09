import React, { useState } from 'react';
import { uploadFile, runPipeline } from '../api';

export default function RightPanel({ selectedNode, pipelineState, setPipelineState }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // Replaces alert

  // Helper to update global state
  const updateState = (key, value) => {
    setPipelineState(prev => ({ ...prev, [key]: value }));
  };

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setUploadStatus("Uploading...");
    
    try {
      const data = await uploadFile(file);
      console.log("Backend Response:", data); // Check your browser console for this!

      if (data.columns) {
        // 1. Save columns to global state
        updateState('columns', data.columns);
        
        // 2. FORCE set the target column to the last one immediately
        const defaultTarget = data.columns[data.columns.length - 1];
        updateState('targetCol', defaultTarget);
        
        setUploadStatus("✅ Success! File loaded.");
      } else {
        setUploadStatus("❌ Error: Backend returned no columns.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("❌ Upload Failed. Is backend running?");
    }
    setLoading(false);
  };

  // Handle Pipeline Run
  const handleRun = async () => {
    // validation
    if (!pipelineState.targetCol) {
      setUploadStatus("⚠️ Please go back to Dataset Node and upload file first.");
      return; 
    }
    
    setLoading(true);
    setResults(null); // Clear previous results

    try {
      const res = await runPipeline({
        target_column: pipelineState.targetCol,
        split_ratio: pipelineState.splitRatio,
        preprocessing: pipelineState.preprocessing,
        model_type: pipelineState.modelType
      });
      setResults(res);
    } catch (error) {
      console.error(error);
      alert("Pipeline Run Failed. Check Console.");
    }
    setLoading(false);
  };

  if (!selectedNode) {
    return (
      <aside className="right-panel">
        <h3>Properties ⚙️</h3>
        <p>Select a node to configure it.</p>
      </aside>
    );
  }

  return (
    <aside className="right-panel">
      <h3>Configure: {selectedNode.data.label}</h3>
      
      {/* Dataset Configuration */}
      {selectedNode.type === 'dataset' && (
        <div className="config-section">
          <label>Upload CSV/Excel:</label>
          <input type="file" onChange={handleFileUpload} />
          
          {/* Status Message Area */}
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: uploadStatus.includes('Success') ? 'green' : 'red' }}>
            {uploadStatus}
          </p>

          {pipelineState.columns.length > 0 && (
            <>
              <label>Select Target Column (Y):</label>
              <select 
                onChange={(e) => updateState('targetCol', e.target.value)} 
                value={pipelineState.targetCol}
              >
                {pipelineState.columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </>
          )}
        </div>
      )}

      {/* Split Configuration */}
      {selectedNode.type === 'split' && (
        <div className="config-section">
          <label>Train Ratio: {pipelineState.splitRatio}</label>
          <input 
            type="range" min="0.1" max="0.9" step="0.1" 
            value={pipelineState.splitRatio} 
            onChange={(e) => updateState('splitRatio', e.target.value)} 
          />
        </div>
      )}

      {/* Preprocessing Configuration */}
      {selectedNode.type === 'preprocess' && (
        <div className="config-section">
          <label>Method:</label>
          <select 
            onChange={(e) => updateState('preprocessing', e.target.value)} 
            value={pipelineState.preprocessing}
          >
            <option value="StandardScaler">StandardScaler</option>
            <option value="MinMaxScaler">MinMaxScaler</option>
          </select>
        </div>
      )}

      {/* Model Configuration */}
      {selectedNode.type === 'model' && (
        <div className="config-section">
          <label>Algorithm:</label>
          <select 
            onChange={(e) => updateState('modelType', e.target.value)} 
            value={pipelineState.modelType}
          >
            <option value="Logistic Regression">Logistic Regression</option>
            <option value="Decision Tree">Decision Tree</option>
          </select>
          
          <div style={{marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px'}}>
             {/* Visual Check for Target Column */}
             <p style={{fontSize: '0.8rem', color: pipelineState.targetCol ? 'black' : 'red'}}>
                Target: <strong>{pipelineState.targetCol || "⚠️ No Target Selected"}</strong>
             </p>
             
             <button className="run-btn" onClick={handleRun} disabled={loading}>
                {loading ? "Running..." : "▶ Run Pipeline"}
             </button>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="results-box">
          <h4>Results 🏆</h4>
          <p><strong>Status:</strong> {results.status}</p>
          <p><strong>Accuracy:</strong> {results.accuracy}%</p>
          <div style={{fontSize: '0.8rem', marginTop: '10px'}}>
            <strong>Confusion Matrix:</strong>
            <pre style={{background: '#fff', padding: '5px'}}>{JSON.stringify(results.confusion_matrix)}</pre>
          </div>
        </div>
      )}
    </aside>
  );
}