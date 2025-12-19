import React from 'react';
import useDatabase from '../hooks/useDatabase.js';
import SuitCard from '../components/SuitCard.js';

const SuitCatalog = () => {
  const { data: trajes, loading, error } = useDatabase('trajes');

  if (loading) {
    return <div>Loading trajes...</div>;
  }

  if (error) {
    return <div>Error loading trajes. Please try again later.</div>;
  }

  return (
    <div className="w3-row-padding" style={{padding: '0 8px'}}>
      {trajes && trajes.map(traje => (
        <div className="w3-col l4 m6 w3-margin-bottom" key={traje.id}>
            <SuitCard suit={traje} />
        </div>
      ))}
    </div>
  );
};

export default SuitCatalog;
