import React from 'react';

const Entries = props => {
  return (
    <div>
      <div className="white f3">{props.name}, your entry count is...</div>
      <div className="white f1">{props.entries}</div>
    </div>
  );
};

export default Entries;
