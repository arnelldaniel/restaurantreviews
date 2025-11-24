import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from './supabaseClient';

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Info = styled.p`
  margin-bottom: 10px;
`;

const Button = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      alert('Error fetching restaurant: ' + error.message);
    } else {
      setRestaurant(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  if (loading) return <Container><p>Loading...</p></Container>;
  if (!restaurant) return <Container><p>Restaurant not found.</p></Container>;

  return (
    <Container>
      <Title>{restaurant.name}</Title>
      <Info><strong>Location:</strong> {restaurant.location}</Info>
      <Info><strong>Cuisine:</strong> {restaurant.cuisine}</Info>
      <Info><strong>Description:</strong> {restaurant.description}</Info>

      <Button to={`/restaurant/${restaurant.id}/menu`}>View Menu</Button>
      <Button to={`/restaurant/${restaurant.id}/reviews`} style={{ marginLeft: '10px' }}>
        View Reviews
      </Button>
      <Button to={`/restaurant/${restaurant.id}/review`} style={{ marginLeft: '10px' }}>
        Submit Review
      </Button>
      <Button to="/search" style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
  Back to Search
</Button>
    </Container>
  );
}
