import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
`;

const Nav = styled.nav`
  margin: 20px 0;
  a, button {
    margin: 0 10px;
    padding: 10px 15px;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    background-color: #007bff;
    &:hover { background-color: #0056b3; }
  }
`;

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in (Supabase v2)
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
    };
    fetchSession();

    // Optional: subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <Container>
      <h1>Welcome to FoodReviews!</h1>
      <p>Discover restaurants, read reviews, and share your experiences.</p>

      <Nav>
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <span>Hello, {user.email || user.user_metadata?.username || 'User'}!</span>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/search">Search Restaurants</Link>
          </>
        )}
      </Nav>
    </Container>
  );
}
