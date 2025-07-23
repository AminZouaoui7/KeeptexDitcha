import React from 'react';
import { useParams } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Product Detail Page</h1>
      <p>Details for product ID: {id}</p>
    </div>
  );
}

export default ProductDetailPage;