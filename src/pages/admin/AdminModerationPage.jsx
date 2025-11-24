import React from 'react';

function AdminModerationPage() {
  return (
    <div>
      <h1>Review & Report Moderation</h1>

      <h2>Pending Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Example Restaurant</td>
            <td>Great food!</td>
            <td>
              <button>Approve</button>
              <button>Reject</button>
              <button>Respond</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Flagged Content</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Comment</td>
            <td>Inappropriate comment</td>
            <td>
              <button>Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminModerationPage;
