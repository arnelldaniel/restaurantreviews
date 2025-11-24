import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { UserContext } from './UserContext';

export default function ViewReviewsPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const CURRENT_USER_ID = user?.id;

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurant info
  const fetchRestaurant = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', id)
      .single();
    if (error) console.error(error);
    else setRestaurant(data);
  };

  // Fetch reviews including vote counts from reviews table
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        helpful_count,
        unhelpful_count,
        reported,
        user:users(username),
        comments(
          id,
          comment,
          user:users(username)
        )
      `)
      .eq('restaurant_id', id)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else {
      setReviews(data.map(r => ({ ...r, comments: r.comments || [], newComment: '' })));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [id]);

  // Vote handler
  const voteReview = async (reviewId, type) => {
    if (!CURRENT_USER_ID) return alert('You must be logged in to vote.');

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('review_votes')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', CURRENT_USER_ID)
      .maybeSingle();

    if (checkError) {
      console.error(checkError);
      return;
    }
    if (existingVote) {
      alert('You already voted on this review.');
      return;
    }

    // Insert vote
    const { error: voteError } = await supabase
      .from('review_votes')
      .insert([{ review_id: reviewId, user_id: CURRENT_USER_ID, vote_type: type }]);
    if (voteError) {
      console.error(voteError);
      return;
    }

    // Update review table counts directly
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const updatedCounts =
      type === 'helpful'
        ? { helpful_count: review.helpful_count + 1 }
        : { unhelpful_count: review.unhelpful_count + 1 };

    const { error: updateError } = await supabase
      .from('reviews')
      .update(updatedCounts)
      .eq('id', reviewId);

    if (updateError) console.error(updateError);

    fetchReviews();
  };

  // Report review
  const reportReview = async (reviewId) => {
  const { error } = await supabase
    .from('reviews')
    .update({ reported: true })
    .eq('id', reviewId);

  if (error) {
    console.error(error);
    alert('Failed to report review.');
  } else {
    alert('Review reported successfully!');
    fetchReviews();
  }
};

  // Add comment
  const setReviewComment = (reviewId, text) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, newComment: text } : r)
    );
  };

  const addComment = async (e, reviewId) => {
  e.preventDefault();

  if (!CURRENT_USER_ID) {
    alert('You must be logged in to post a comment.');
    return;
  }

  const review = reviews.find(r => r.id === reviewId);
  if (!review || !review.newComment || review.newComment.trim() === '') {
    alert('Comment cannot be empty.');
    return;
  }

  const { error } = await supabase
    .from('comments')
    .insert([{
      review_id: reviewId,
      user_id: CURRENT_USER_ID,
      comment: review.newComment.trim(),
    }]);

  if (error) {
    console.error(error);
    alert('Failed to post comment.');
  } else {
    setReviewComment(reviewId, '');
    fetchReviews();
  }
};

  return (
    <div>
      <h2>Reviews for {restaurant ? restaurant.name : 'Restaurant'}</h2>
      {loading && <p>Loading reviews...</p>}
      {!loading && reviews.length === 0 && <p>No reviews yet.</p>}
      <ul>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: '20px' }}>
            <strong>{r.user.username}</strong>: {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} - {r.comment}
            <br />
            Helpful: {r.helpful_count} | Unhelpful: {r.unhelpful_count}
            <br />
            <button onClick={() => voteReview(r.id, 'helpful')}>Mark Helpful</button>
            <button onClick={() => voteReview(r.id, 'unhelpful')}>Mark Unhelpful</button>
            <button onClick={() => reportReview(r.id)}>Report</button>

            <form onSubmit={(e) => addComment(e, r.id)}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={r.newComment || ''}
                onChange={(e) => setReviewComment(r.id, e.target.value)}
                style={{ marginTop: '5px', width: '70%' }}
              />
              <button type="submit" style={{ marginLeft: '5px' }}>Post Comment</button>
            </form>

            <ul>
              {r.comments.map((c) => (
                <li key={c.id}><strong>{c.user.username}</strong>: {c.comment}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
