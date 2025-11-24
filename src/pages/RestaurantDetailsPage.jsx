import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Restaurant Details - {id}</h2>
      <p>Description, Contact Info, Images...</p>
      <Link to={`/restaurant/${id}/menu`}>View Menu</Link><br />
      <Link to={`/restaurant/${id}/reviews`}>View Reviews</Link><br />
      <Link to={`/restaurant/${id}/review`}>Submit Review</Link>
    </div>
  );
}
