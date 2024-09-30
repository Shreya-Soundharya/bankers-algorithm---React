import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [processes, setProcesses] = useState(0);
  const [resources, setResources] = useState(0);
  const [allocated, setAllocated] = useState([]);
  const [maximum, setMaximum] = useState([]);
  const [available, setAvailable] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);
  const [isSafe, setIsSafe] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleProcessChange = (e) => {
    const newProcesses = parseInt(e.target.value);
    setProcesses(newProcesses);
    // Reset states when the number of processes changes
    setAllocated(Array(newProcesses).fill().map(() => Array(resources).fill(0)));
    setMaximum(Array(newProcesses).fill().map(() => Array(resources).fill(0)));
    setAvailable(Array(resources).fill(0));
    setSafeSequence([]);
    setIsSafe(null);
    setWarnings([]);
  };

  const handleResourceChange = (e) => {
    const newResources = parseInt(e.target.value);
    setResources(newResources);
    // Reset states when the number of resources changes
    setAllocated(Array(processes).fill().map(() => Array(newResources).fill(0)));
    setMaximum(Array(processes).fill().map(() => Array(newResources).fill(0)));
    setAvailable(Array(newResources).fill(0));
    setSafeSequence([]);
    setIsSafe(null);
    setWarnings([]);
  };

  const handleInputChange = (e, type, i, j) => {
    const value = parseInt(e.target.value);
    if (type === 'allocated') {
      const newAllocated = [...allocated];
      newAllocated[i][j] = isNaN(value) || value < 0 ? 0 : value; // Allow only non-negative values, 0 or above
      setAllocated(newAllocated);
    } else if (type === 'maximum') {
      const newMaximum = [...maximum];
      newMaximum[i][j] = isNaN(value) || value < 0 ? 0 : value; // Allow only non-negative values, 0 or above
      setMaximum(newMaximum);
    } else if (type === 'available') {
      const newAvailable = [...available];
      newAvailable[j] = isNaN(value) || value < 0 ? 0 : value; // Allow only non-negative values, 0 or above
      setAvailable(newAvailable);
    }
  };

  const validateInputs = () => {
    const warningsList = [];

    // Check for empty inputs in allocated, maximum, and available
    allocated.forEach((allocRow, i) => {
      allocRow.forEach((allocVal, j) => {
        if (allocVal === '' || isNaN(allocVal)) {
          warningsList.push(`Allocated resource R${j + 1} for Process P${i + 1} is not filled.`);
        }
      });
    });

    maximum.forEach((maxRow, i) => {
      maxRow.forEach((maxVal, j) => {
        if (maxVal === '' || isNaN(maxVal)) {
          warningsList.push(`Maximum resource R${j + 1} for Process P${i + 1} is not filled.`);
        } else if (maxVal < allocated[i][j]) {
          warningsList.push(`Maximum resource R${j + 1} for Process P${i + 1} cannot be less than allocated value.`);
        }
      });
    });

    // Check available resources
    available.forEach((availVal, i) => {
      if (availVal === '' || isNaN(availVal)) {
        warningsList.push(`Available resource R${i + 1} is not filled.`);
      }
    });

    setWarnings(warningsList);
    return warningsList.length === 0;
  };

  const checkSafeState = () => {
    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    console.log('Maximum:', maximum);
    console.log('Allocated:', allocated);
    console.log('Available:', available);

    // Calculate the need matrix
    const needMatrix = maximum.map((maxRow, i) =>
      maxRow.map((maxVal, j) => maxVal - allocated[i][j])
    );

    const work = [...available];
    const finish = Array(processes).fill(false);
    const sequence = [];
    let count = 0;

    // Banker's Algorithm for safe sequence
    while (count < processes) {
      let found = false;
      for (let i = 0; i < processes; i++) {
        if (!finish[i]) {
          let canProceed = true;
          for (let j = 0; j < resources; j++) {
            if (needMatrix[i][j] > work[j]) {
              canProceed = false;
              break;
            }
          }
          if (canProceed) {
            for (let k = 0; k < resources; k++) {
              work[k] += allocated[i][k];
            }
            sequence.push(i);
            finish[i] = true;
            found = true;
            count++;
          }
        }
      }
      if (!found) break;
    }

    if (count === processes) {
      setIsSafe(true);
      setSafeSequence(sequence);
    } else {
      setIsSafe(false);
      setSafeSequence([]);
    }
  };

  useEffect(() => {
    // Check if inputs are valid on changes
    const isValid = validateInputs();
    if (isValid) {
      setWarnings([]); // Clear warnings if valid
    }
  }, [allocated, maximum, available]); // Validate only when these states change

  return (
    <div className="calculator-container">
      <h2>Banker's Algorithm Simulation</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="processes">Number of Processes (p):</label><br />
        <input
          type="number"
          id="processes"
          name="processes"
          min="1"
          max="20"
          value={processes}
          onChange={handleProcessChange}
        /><br />
        <label htmlFor="resources">Number of Resources (n):</label><br />
        <input
          type="number"
          id="resources"
          name="resources"
          min="1"
          max="20"
          value={resources}
          onChange={handleResourceChange}
        /><br />
      </form>

      <div className="rules-box">
        <h3>How to Use the Calculator</h3>
        <ul>
          <li>Enter the number of processes (p) and resources (n).</li>
          <li>Fill in the input fields.</li>
          <li>The "Maximum" resources must be greater than or equal to the "Allocated" resources.</li>
          <li>You can input 0 or positive values only. No negative values are allowed.</li>
          <li>Leave the input field blank to input 0.</li>
          <li>Once all inputs are valid, click "Check Safe State" to see if the system is safe.</li>
        </ul>
      </div>

      {allocated.length > 0 && (
        <>
          <div className="resource-matrix">
            <h3>Allocated & Maximum Resources</h3>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  {Array.from({ length: resources }).map((_, i) => (
                    <th key={i} colSpan="2">Resource {i + 1}</th>
                  ))}
                </tr>
                <tr>
                  <th></th>
                  {Array.from({ length: resources }).map((_, i) => (
                    <React.Fragment key={i}>
                      <th>Allocated</th>
                      <th>Max</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: processes }).map((_, i) => (
                  <tr key={i}>
                    <td>P{i + 1}</td>
                    {Array.from({ length: resources }).map((_, j) => (
                      <React.Fragment key={j}>
                        <td>
                          <input
                            type="number"
                            value={allocated[i][j] || ''} // Ensure value is controlled
                            onChange={(e) => handleInputChange(e, 'allocated', i, j)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={maximum[i][j] || ''} // Ensure value is controlled
                            onChange={(e) => handleInputChange(e, 'maximum', i, j)}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="available-resources">
            <h3>Available Resources</h3>
            {Array.from({ length: resources }).map((_, i) => (
              <div key={i}>
                <label htmlFor={`available-${i}`}>Resource {i + 1}:</label>
                <input
                  type="number"
                  id={`available-${i}`}
                  value={available[i] || ''}
                  onChange={(e) => handleInputChange(e, 'available', 0, i)}
                />
              </div>
            ))}
          </div>

          {warnings.length > 0 && (
            <div className="warnings">
              <h4>Warnings:</h4>
              <ul>
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={checkSafeState}>Check Safe State</button>

          {isSafe !== null && (
            <div className="result">
              {isSafe ? (
                <>
                  <h4>The system is in a safe state.</h4>
                  <p>Safe sequence: {safeSequence.map((p) => `P${p + 1}`).join(', ')}</p>
                </>
              ) : (
                <h4>The system is not in a safe state.</h4>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calculator;
