import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const RestaurantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RestaurantCard = styled.div`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

export default function SearchRestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch restaurants from Supabase
  const fetchRestaurants = async () => {
    setLoading(true);

    let query = supabase.from('restaurants').select('*');

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,cuisine.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      alert('Error fetching restaurants: ' + error.message);
    } else {
      setRestaurants(data);
    }

    setLoading(false);
  };

  // Fetch all restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fetch restaurants when search term changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRestaurants();
    }, 300); // wait 300ms after typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <Container>
      <h2>Search Restaurants</h2>
      <SearchInput
        type="text"
        placeholder="Search by name, location, or cuisine"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {!loading && restaurants.length === 0 && <p>No restaurants found.</p>}

      <RestaurantList>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p><strong>Location:</strong> {restaurant.location}</p>
            <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            <p>{restaurant.description}</p>
            <Link to={`/restaurant/${restaurant.id}`}>View Details</Link>
          </RestaurantCard>
        ))}
      </RestaurantList>
    </Container>
  );
}
