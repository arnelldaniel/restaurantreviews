import React from 'react';
import { useParams } from 'react-router-dom';

export default function ViewMenuPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Menu for Restaurant {id}</h2>
      <ul>
        <li>Pizza - $10</li>
        <li>Burger - $8</li>
      </ul>
    </div>
  );
}
