import React from 'react';
import './Pseudocode.css'; // Ensure you have a CSS file for styling

function Pseudocode() {
  return (
    <div className='pseudocode'>
      <h2>Pseudocode of Banker's Algorithm</h2>

      <h3>1. Safety Algorithm</h3>
      <div className="code-box">
        <pre>
          {`function isSafe(processes, resources, available, max, allocation):
  need = max - allocation
  work = available
  finish = [false] * processes
  
  while True:
    found = false
    for i in range(processes):
      if finish[i] == false and need[i] <= work:
        work = work + allocation[i]
        finish[i] = true
        found = true
    if not found:
      break
  
  if all finish == true:
    return "Safe State"
  else:
    return "Unsafe State"`}
        </pre>
      </div>

      <h3>2. Resource Request Algorithm</h3>
      <div className="code-box">
        <pre>
          {`function requestResources(process, request, available, max, allocation, need):
  if request <= need[process]:
    if request <= available:
      // Pretend to allocate resources
      available = available - request
      allocation[process] = allocation[process] + request
      need[process] = need[process] - request
      
      if isSafe(processes, resources, available, max, allocation) == "Safe State":
        return "Resources allocated"
      else:
        // Rollback
        available = available + request
        allocation[process] = allocation[process] - request
        need[process] = need[process] + request
        return "Resources cannot be allocated"
    else:
      return "Resources not available, process must wait"
  else:
    return "Request exceeds maximum claim"`}
        </pre>
      </div>

      <h3>3. Explanation of Data Structures</h3>
      <ul>
        <li><strong>Available:</strong> Array of length 'm' indicating available resources.</li>
        <li><strong>Max:</strong> n x m matrix indicating maximum resource needs for each process.</li>
        <li><strong>Allocation:</strong> Matrix indicating currently allocated resources to each process.</li>
        <li><strong>Need:</strong> Matrix representing remaining resource needs for each process.</li>
        <li><strong>Finish:</strong> Boolean array indicating if processes have completed.</li>
      </ul>

      {/* Add the reference here */}
      <p>
        References: 
        <a href="https://www.javatpoint.com/bankers-algorithm-in-operating-system" target="_blank" rel="noopener noreferrer">
          JavaTpoint - Banker's Algorithm in Operating System
        </a>
      </p>
    </div>
  );
}

export default Pseudocode;
