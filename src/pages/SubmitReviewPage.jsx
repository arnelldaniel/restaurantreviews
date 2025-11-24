import React from 'react';
import { useParams } from 'react-router-dom';

export default function SubmitReviewPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Submit Review for Restaurant {id}</h2>
      <form>
        <textarea placeholder="Write your review..." /><br />
        <input type="number" min="1" max="5" placeholder="Rating (1-5)" /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
