import React from 'react';
import { useParams } from 'react-router-dom';

function ServiceDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Service Detail Page</h1>
      <p>Details for service ID: {id}</p>
    </div>
  );
}

export default ServiceDetailPage;