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

  // Fetch restaurant name
  const fetchRestaurant = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', id)
      .single();

    if (error) console.error(error);
    else setRestaurant(data);
  };

  // Fetch reviews with comments and votes
  const fetchReviews = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        user:users(username),
        comments(
          id,
          comment,
          user:users(username)
        ),
        review_votes(
          id,
          vote_type,
          user_id
        )
      `)
      .eq('restaurant_id', id)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setReviews(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [id]);

  // Mark helpful/unhelpful
  const voteReview = async (reviewId, type) => {
    if (!CURRENT_USER_ID) return alert('You must be logged in to vote.');

    // Check if user already voted
    const { data: existing, error: checkError } = await supabase
      .from('review_votes')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', CURRENT_USER_ID)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // ignore not found
      console.error(checkError);
      return;
    }

    if (existing) {
      alert('You already voted on this review.');
      return;
    }

    const { error } = await supabase
      .from('review_votes')
      .insert([{ review_id: reviewId, user_id: CURRENT_USER_ID, vote_type: type }]);

    if (error) console.error(error);
    else fetchReviews();
  };

  // Report review
  const reportReview = async (reviewId) => {
    const { error } = await supabase
      .from('reviews')
      .update({ reported: true })
      .eq('id', reviewId);

    if (error) console.error(error);
    else fetchReviews();
  };

  // Comment handling
  const setReviewComment = (reviewId, text) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, newComment: text } : r)
    );
  };

  const addComment = async (e, reviewId) => {
    e.preventDefault();
    const review = reviews.find(r => r.id === reviewId);
    if (!review || !review.newComment || !CURRENT_USER_ID) return;

    const { error } = await supabase
      .from('comments')
      .insert([{ review_id: reviewId, user_id: CURRENT_USER_ID, comment: review.newComment }]);

    if (error) console.error(error);
    else {
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
        {reviews.map((r) => {
          // Count helpful/unhelpful votes
          const helpfulCount = r.review_votes?.filter(v => v.vote_type === 'helpful').length || 0;
          const unhelpfulCount = r.review_votes?.filter(v => v.vote_type === 'unhelpful').length || 0;

          return (
            <li key={r.id} style={{ marginBottom: '20px' }}>
              <strong>{r.user.username}</strong>: {'★'.repeat(r.rating)}
              {'☆'.repeat(5 - r.rating)} - {r.comment}
              <br />
              Helpful: {helpfulCount} | Unhelpful: {unhelpfulCount}
              <br />
              <button onClick={() => voteReview(r.id, 'helpful')}>Mark Helpful</button>
              <button onClick={() => voteReview(r.id, 'unhelpful')}>Mark Unhelpful</button>
              <button onClick={() => reportReview(r.id)}>Report</button>

              {/* Comment box */}
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

              {/* Display comments */}
              <ul>
                {r.comments?.map((c) => (
                  <li key={c.id}><strong>{c.user.username}</strong>: {c.comment}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
