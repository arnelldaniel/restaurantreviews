import React from 'react';

function AdminMenuPage() {
  return (
    <div>
      <h1>Manage Menu Items</h1>
      <button>Add New Menu Item</button>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Example Dish</td>
            <td>$10</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminMenuPage;
