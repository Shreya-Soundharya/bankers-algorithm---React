import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [processes, setProcesses] = useState('');
  const [resources, setResources] = useState('');
  const [allocated, setAllocated] = useState([]);
  const [maximum, setMaximum] = useState([]);
  const [available, setAvailable] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);
  const [isSafe, setIsSafe] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleProcessChange = (e) => {
    let newProcesses = e.target.value === '' ? '' : Math.max(1, Math.min(20, parseInt(e.target.value)));
    setProcesses(newProcesses);

    if (newProcesses === '') {
      // Reset states if the input is cleared
      setAllocated([]);
      setMaximum([]);
      setAvailable([]);
      setSafeSequence([]);
      setIsSafe(null);
      setWarnings([]);
    } else {
      const newProcessCount = parseInt(newProcesses);
      setAllocated(Array(newProcessCount).fill().map(() => Array(resources || 0).fill(0)));
      setMaximum(Array(newProcessCount).fill().map(() => Array(resources || 0).fill(0)));
      setSafeSequence([]);
      setIsSafe(null);
      setWarnings([]);
    }
  };

  const handleResourceChange = (e) => {
    let newResources = e.target.value === '' ? '' : Math.max(1, Math.min(10, parseInt(e.target.value)));
    setResources(newResources);

    if (newResources === '') {
      // Reset states if the input is cleared
      setAllocated([]);
      setMaximum([]);
      setAvailable([]);
      setSafeSequence([]);
      setIsSafe(null);
      setWarnings([]);
    } else {
      const newResourceCount = parseInt(newResources);
      setAllocated(Array(processes || 0).fill().map(() => Array(newResourceCount).fill(0)));
      setMaximum(Array(processes || 0).fill().map(() => Array(newResourceCount).fill(0)));
      setAvailable(Array(newResourceCount).fill(0));
      setSafeSequence([]);
      setIsSafe(null);
      setWarnings([]);
    }
  };

  const handleInputChange = (e, type, i, j) => {
    const value = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value));
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
          max="10"
          value={resources}
          onChange={handleResourceChange}
        /><br />
      </form>

      <div className="rules-box">
        <h3>How to Use the Calculator</h3>
        <ul className="rules-list">
          <li>Enter the number of processes (p), resources (n) and fill in the input fields.</li>
          <li>Maximum number of processes is 20 and maximum number of resources is 10.</li>
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
                {allocated.map((allocRow, i) => (
                  <tr key={i}>
                    <td>Process {i + 1}</td>
                    {allocRow.map((allocVal, j) => (
                      <React.Fragment key={j}>
                        <td>
                          <input
                            type="number"
                            value={allocVal}
                            onChange={(e) => handleInputChange(e, 'allocated', i, j)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={maximum[i][j]}
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
          <div className="available-matrix">
            <h3>Available Resources</h3>
            <table>
              <thead>
                <tr>
                  {Array.from({ length: resources }).map((_, i) => (
                    <th key={i}>Resource {i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {available.map((availVal, i) => (
                    <td key={i}>
                      <input
                        type="number"
                        value={availVal}
                        onChange={(e) => handleInputChange(e, 'available', 0, i)}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <button onClick={checkSafeState}>Check Safe State</button>

      {warnings.length > 0 && (
        <div className="warnings">
          <h3>Warnings</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {isSafe !== null && (
        <div className={`safe-state ${isSafe ? 'safe' : 'unsafe'}`}>
          {isSafe ? (
            <>
              <h3>The system is in a safe state!</h3>
              <p>Safe sequence: {safeSequence.map((proc) => `P${proc + 1}`).join(', ')}</p>
            </>
          ) : (
            <h3>The system is not in a safe state!</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
