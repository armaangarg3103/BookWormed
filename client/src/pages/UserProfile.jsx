import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { assets } from '../assests/assets';

const UserProfile = () => {
  const { userId } = useParams();
  const { backendUrl, token, user: currentUser, fetchUser } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalPosts: 0,
    booksInLists: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Check if userId is valid (not 'undefined' string or null)
    if (userId && userId !== 'undefined') {
      fetchUserProfile();
    } else if (currentUser?._id) {
      // If no valid userId in URL but user is logged in, show their profile
      fetchUserProfile(currentUser._id);
    }
  }, [userId, currentUser]);

  // Update follow status when currentUser changes
  useEffect(() => {
    if (currentUser && userId) {
      setIsFollowing(currentUser.following?.includes(userId) || false);
    }
  }, [currentUser, userId]);

  const fetchUserProfile = async (profileId = userId) => {
    try {
      setLoading(true);
      
      // Validate profileId - don't proceed if it's undefined or 'undefined' string
      if (!profileId || profileId === 'undefined') {
        console.error('Invalid profile ID:', profileId);
        setLoading(false);
        return;
      }
      
      // Fetch user basic info
      const userResponse = await axios.get(`${backendUrl}/api/user/profile/${profileId}`);
      console.log('User profile response:', userResponse.data);
      
      if (userResponse.data.success) {
        const userData = userResponse.data.user;
        setUser(userData);
        
        // Set followers and following with populated data
        setFollowers(userData.followers || []);
        setFollowing(userData.following || []);
        
        // Update follower count and check if current user is following
        setStats(prev => ({
          ...prev,
          followersCount: userData.followers?.length || 0,
          followingCount: userData.following?.length || 0
        }));
        
        // Check if current user is following this profile
        if (currentUser) {
          setIsFollowing(currentUser.following?.includes(userId) || false);
        }
      } else {
        console.error('Failed to fetch user:', userResponse.data.message);
      }

      // Fetch user statistics and activity
      if (token) {
        fetchUserActivity(profileId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async (profileId = userId) => {
    try {
      // Validate profileId
      if (!profileId || profileId === 'undefined') {
        console.error('Invalid profile ID for activity:', profileId);
        return;
      }
      
      // Fetch reviews
      const reviewsResponse = await axios.get(`${backendUrl}/api/book/reviews/user/${profileId}`);
      if (reviewsResponse.data.success) {
        setRecentReviews(reviewsResponse.data.reviews.slice(0, 5));
        setStats(prev => ({ ...prev, totalReviews: reviewsResponse.data.reviews.length }));
      }

      // Fetch posts
      const postsResponse = await axios.get(`${backendUrl}/api/post/user/${profileId}`);
      if (postsResponse.data.success) {
        setRecentPosts(postsResponse.data.posts.slice(0, 5));
        setStats(prev => ({ ...prev, totalPosts: postsResponse.data.posts.length }));
      }

      // Fetch reading lists
      const listsResponse = await axios.get(`${backendUrl}/api/book/lists/user/${profileId}`);
      if (listsResponse.data.success) {
        setReadingLists(listsResponse.data.lists);
        setStats(prev => ({ ...prev, booksInLists: listsResponse.data.lists.length }));
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!token) {
      alert('Please login to follow users');
      return;
    }

    const targetUserId = userId || user?._id;
    if (!targetUserId) return;

    // Prevent multiple simultaneous requests (race condition prevention)
    if (isFollowLoading) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await axios.post(
          `${backendUrl}/api/user/unfollow/${targetUserId}`,
          { userId: currentUser._id },
          { headers: { token } }
        );
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
      } else {
        // Follow
        await axios.post(
          `${backendUrl}/api/user/follow/${targetUserId}`,
          { userId: currentUser._id },
          { headers: { token } }
        );
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
      }
      
      // Update current user's following list in context
      await fetchUser();
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessage = () => {
    // For now, show an alert. You can implement a chat feature later
    alert(`Chat feature coming soon! You want to message @${user.username || user.email?.split('@')[0]}`);
    // TODO: Implement chat/messaging functionality
    // This could redirect to a messages page or open a chat modal
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
    return stars;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">User not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-400">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900"></div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex items-end gap-6">
                {/* Profile Picture */}
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center text-5xl overflow-hidden">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user?.username || user?.email?.split('@')[0] || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', user.profilePicture);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-5xl">👤</span>';
                      }}
                      onLoad={() => console.log('Profile picture loaded successfully:', user.profilePicture)}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                
                {/* Username */}
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-white mb-1">@{user?.username || user?.email?.split('@')[0] || 'user'}</h1>
                  {user.bio && <p className="text-gray-300 mt-2 max-w-2xl">{user.bio}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              {currentUser && currentUser._id !== (userId || user?._id) && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`px-6 py-2 rounded-lg transition-colors font-semibold ${
                      isFollowLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : isFollowing
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}
                  </button>
                  <button 
                    onClick={handleMessage}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    💬 Message
                  </button>
                </div>
              )}
              
              {/* Edit Profile Button for Own Profile */}
              {currentUser && currentUser._id === (userId || user?._id) && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Link
                    to="/settings"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    ⚙️ Edit Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalReviews}</div>
                <div className="text-sm text-gray-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                <div className="text-sm text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.booksInLists}</div>
                <div className="text-sm text-gray-400">Books</div>
              </div>
              <button 
                onClick={() => setShowFollowersModal(true)}
                className="text-center hover:bg-gray-700 rounded-lg transition-colors p-2"
              >
                <div className="text-2xl font-bold text-white">{stats.followersCount}</div>
                <div className="text-sm text-gray-400">Followers</div>
              </button>
              <button 
                onClick={() => setShowFollowingModal(true)}
                className="text-center hover:bg-gray-700 rounded-lg transition-colors p-2"
              >
                <div className="text-2xl font-bold text-white">{stats.followingCount}</div>
                <div className="text-sm text-gray-400">Following</div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'about'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews ({stats.totalReviews})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Posts ({stats.totalPosts})
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'library'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Library ({stats.booksInLists})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Info */}
              <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Bio</h3>
                    <p className="text-gray-300">
                      {user.bio || 'No bio added yet.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Member Since</h3>
                    <p className="text-gray-300">{formatDate(user.createdAt || new Date())}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Engineering', 'Computer Science', 'Programming', 'Reading'].map((interest, idx) => (
                        <span key={idx} className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Active</span>
                    <span className="text-white">Today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Contributions</span>
                    <span className="text-white">{stats.totalReviews + stats.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Books Read</span>
                    <span className="text-white">{readingLists.filter(l => l.listType === 'read').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Currently Reading</span>
                    <span className="text-white">{readingLists.filter(l => l.listType === 'currently-reading').length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Reviews</h2>
              {recentReviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review._id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/books/${review.book._id}`} className="text-lg font-semibold text-white hover:text-blue-400">
                            {review.book.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Posts</h2>
              {recentPosts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No posts yet</p>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post._id}
                      to="/posts"
                      onClick={() => window.scrollTo(0, 0)}
                      className="block bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-300 line-clamp-2 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>❤️ {post.likes?.length || 0}</span>
                        <span>💬 {post.comments?.length || 0}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Reading Library</h2>
              {readingLists.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No books in library yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {readingLists.slice(0, 20).map((item) => (
                    <Link
                      key={item._id}
                      to={`/books/${item.book._id}`}
                      className="bg-gray-700 rounded-lg overflow-hidden hover:border-blue-500 border border-gray-600 transition-all"
                    >
                      {item.book.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="book-cover-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = '<div class="w-20 h-28 bg-gradient-to-br from-gray-700 to-gray-600 rounded flex items-center justify-center"><span class="text-3xl">📚</span></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-sm text-white line-clamp-2">{item.book.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowersModal(false)}>
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Followers</h2>
              <button onClick={() => setShowFollowersModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {followers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No followers yet</p>
              ) : (
                <div className="divide-y divide-gray-700">
                  {followers.map((follower) => (
                    <Link
                      key={follower._id}
                      to={`/profile/${follower._id}`}
                      onClick={() => setShowFollowersModal(false)}
                      className="flex items-center gap-3 p-4 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={follower.profilePicture || assets.profile_icon}
                        alt={follower.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">@{follower.username || follower.email.split('@')[0]}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowingModal(false)}>
          <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Following</h2>
              <button onClick={() => setShowFollowingModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {following.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Not following anyone yet</p>
              ) : (
                <div className="divide-y divide-gray-700">
                  {following.map((followedUser) => (
                    <Link
                      key={followedUser._id}
                      to={`/profile/${followedUser._id}`}
                      onClick={() => setShowFollowingModal(false)}
                      className="flex items-center gap-3 p-4 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={followedUser.profilePicture || assets.profile_icon}
                        alt={followedUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">@{followedUser.username || followedUser.email.split('@')[0]}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
