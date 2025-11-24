import React from 'react';

function AdminLoginPage() {
  return (
    <div>
      <h1>Admin Login</h1>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="admin@example.com" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
