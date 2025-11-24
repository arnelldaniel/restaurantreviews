import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ViewMenuPage() {
  const { id } = useParams(); // restaurant id
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch restaurant info
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('name')
        .eq('id', id)
        .single();

      if (restaurantError) {
        console.error('Error fetching restaurant:', restaurantError);
      } else {
        setRestaurant(restaurantData);
      }

      // Fetch menu items
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);

      if (menuError) {
        console.error('Error fetching menu:', menuError);
      } else {
        setMenuItems(menuData);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h2>
        Menu for {restaurant ? restaurant.name : 'Restaurant'}
      </h2>
    <button onClick={() => window.history.back()}>Back to Restaurant Details</button>
      {loading && <p>Loading menu...</p>}

      {!loading && menuItems.length === 0 && <p>No menu items found.</p>}

      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ${item.price.toFixed(2)}
            <br />
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
