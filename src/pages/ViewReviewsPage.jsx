import React from 'react';
import { useParams } from 'react-router-dom';

export default function ViewReviewsPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Reviews for Restaurant {id}</h2>
      <ul>
        <li>John Doe: ★★★★☆ - Great food!</li>
        <li>Jane Smith: ★★★☆☆ - Average experience.</li>
      </ul>
    </div>
  );
}
