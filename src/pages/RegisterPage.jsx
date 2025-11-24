import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

// Container styling
const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

// Styled input
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
`;

// Styled button
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #28a745; /* green for register */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  if (!username || !password) return alert("Fill all fields");

  const { error } = await supabase
    .from('users')
    .insert([{ username, password }]);

  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('User registered successfully!');
    setUsername('');
    setPassword('');
    navigate('/login'); // redirect to login page
  }
};

  return (
    <Container>
      <h2>Register Account</h2>
      <form onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Register</Button>
      </form>
    </Container>
  );
}