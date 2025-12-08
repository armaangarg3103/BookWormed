import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import CreatePost from '../components/CreatePost';
import PostFeed from '../components/PostFeed';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Posts = () => {
  const { user, setShowLogin, token, backendUrl } = useContext(AppContext);
  const postFeedRef = useRef(null);
  const location = useLocation();
  const [followingReviews, setFollowingReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (user && token) {
      fetchFollowingReviews();
    }
  }, [user, token]);

  const fetchFollowingReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(`${backendUrl}/api/book/reviews/following`, {
        headers: { token }
      });
      console.log('Following reviews response:', response.data);
      if (response.data.success) {
        let reviews = response.data.reviews;
        
        // Supplement with cover images from public JSON if backend reviews lack images
        try {
          const pubResp = await fetch('/books_full.json');
          if (pubResp.ok) {
            const pubData = await pubResp.json();
            const imageMap = new Map();
            
            // Create a map of book titles/authors to their cover images
            pubData.forEach(b => {
              const key = `${String(b.Book || '').toLowerCase().trim()}___${String(b.Author || '').toLowerCase().trim()}`;
              imageMap.set(key, b.Image_URL || '');
            });
            
            // Supplement reviews with images
            reviews = reviews.map(review => {
              if (review.book && (!review.book.coverImage || review.book.coverImage === '')) {
                const key = `${String(review.book.title || '').toLowerCase().trim()}___${String(review.book.author || '').toLowerCase().trim()}`;
                if (imageMap.has(key)) {
                  console.log('Found image for book:', review.book.title, imageMap.get(key));
                  return {
                    ...review,
                    book: { ...review.book, coverImage: imageMap.get(key) }
                  };
                }
              }
              return review;
            });
          }
        } catch (e) {
          console.warn('Could not supplement with cover images:', e);
        }
        
        console.log('Setting reviews:', reviews);
        setFollowingReviews(reviews);
      }
    } catch (error) {
      console.error('Error fetching following reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Trigger a refresh of the feed
    setRefreshTrigger(prev => prev + 1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-600'}>
          ★
        </span>
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Posts & Reviews
          </h1>
          <p className="text-gray-400">Share your thoughts and see what your friends are reading</p>
        </div>

        {/* Create Post Section - Only show if user is logged in */}
        {user ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6 text-center">
            <p className="text-gray-300 mb-4">
              Join the conversation! Login to create posts and interact with the community.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Login Now
            </button>
          </div>
        )}

        {/* Reviews from Following Users */}
        {user && (
          <>
            {followingReviews.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">📚 Recent Reviews from People You Follow</h2>
                <div className="space-y-4">
                  {followingReviews.filter(review => review.book && review.user).map((review) => (
                    <div key={review._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="flex gap-4">
                        {/* Book Cover - Clickable */}
                        <Link to={`/books/${review.book._id}`} className="flex-shrink-0">
                          {review.book.coverImage ? (
                            <img
                              src={review.book.coverImage}
                              alt={review.book.title}
                              className="w-24 h-36 object-cover rounded shadow-lg hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-24 h-36 bg-gradient-to-br from-gray-700 to-gray-600 rounded flex items-center justify-center">
                              <span className="text-4xl">📚</span>
                            </div>
                          )}
                        </Link>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          {/* User Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <Link to={`/profile/${review.user._id}`} className="font-semibold text-blue-400 hover:text-blue-300">
                              @{review.user.username || review.user.email.split('@')[0]}
                            </Link>
                            <span className="text-gray-500">reviewed</span>
                            <span className="text-gray-400 text-sm">• {formatDate(review.createdAt)}</span>
                          </div>

                          {/* Book Title - Clickable */}
                          <Link to={`/books/${review.book._id}`} className="block mb-2">
                            <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
                              {review.book.title}
                            </h3>
                            <p className="text-sm text-gray-400">by {review.book.author}</p>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-400">({review.rating}/5)</span>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {review.reviewText}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !loadingReviews && (
              <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-400">
                  No reviews yet from people you follow. Follow more users or encourage them to write reviews!
                </p>
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {user && loadingReviews && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Posts Feed */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">💬 Community Posts</h2>
          <PostFeed ref={postFeedRef} triggerRefresh={refreshTrigger} />
        </div>
      </div>

      {/* Info Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold text-emerald-400 mb-2">Community Guidelines</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Be respectful and kind to others</li>
            <li>• Share meaningful content</li>
            <li>• No spam or self-promotion</li>
            <li>• Keep discussions constructive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Posts;
