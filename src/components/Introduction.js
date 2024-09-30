import React from 'react';
import './Introduction.css'; // Add styling

function Introduction() {
  return (
    <div className="introduction-page">
        <h1>Introduction to Banker's Algorithm</h1>
        <h3>This is an introductory presentation on the Banker's Algorithm. There are a total of 24 slides.</h3>
      {/* Embed the Google Slides presentation */}
      <div className="slides-embed">
        <iframe 
          src="https://docs.google.com/presentation/d/e/2PACX-1vQWFK6UBDzLq5tqv0x3Srlg_51ra3iZFM65A6C7jn3AMy5bsLmtlj_Rsz3oDOeS8zgQNadYsLdwq3n0/embed?start=false&loop=false&delayms=3000"
          frameBorder="0" 
          width="100%" 
          height="100%" 
          allowFullScreen="true"
          allow="autoplay; encrypted-media"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
}

export default Introduction;
