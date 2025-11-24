import React from 'react';
import { Link } from 'react-router-dom';

function AdminRestaurantsPage() {
  return (
    <div>
      <h1>Manage Restaurants</h1>
      <button>Add New Restaurant</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr>
            <td>Example Restaurant</td>
            <td>City Center</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
              <Link to="/admin/restaurants/1/menu">Manage Menu</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminRestaurantsPage;
