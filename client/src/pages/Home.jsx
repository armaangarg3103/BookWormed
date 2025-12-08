import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Home = () => {
  const { user, setShowLogin, backendUrl, siteStats, loadSiteStats } = useContext(AppContext);
  const navigate = useNavigate();
  // local stats no longer needed; use siteStats from context
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured books
      const booksResponse = await axios.get(`${backendUrl}/api/book/browse?limit=6`);
      if (booksResponse.data.success) {
        let books = booksResponse.data.books;
        
        // Supplement with cover images from public JSON if backend books lack images
        try {
          const pubResp = await fetch('/books_full.json');
          if (pubResp.ok) {
            const pubData = await pubResp.json();
            const imageMap = new Map();
            
            // Create a map of book titles/authors to their cover images
            pubData.forEach(b => {
              const key = `${String(b.Book || '').toLowerCase()}___${String(b.Author || '').toLowerCase()}`;
              imageMap.set(key, b.Image_URL || '');
            });
            
            // Supplement server books with images
            books = books.map(book => {
              if (!book.coverImage || book.coverImage === '') {
                const key = `${String(book.title || '').toLowerCase()}___${String(book.author || '').toLowerCase()}`;
                if (imageMap.has(key)) {
                  return { ...book, coverImage: imageMap.get(key) };
                }
              }
              return book;
            });
          }
        } catch (e) {
          console.warn('Could not supplement with cover images:', e);
        }
        
        setFeaturedBooks(books);
      }

      // Fetch recent posts
      const postsResponse = await axios.get(`${backendUrl}/api/post/all?limit=3`);
      if (postsResponse.data.success) {
        setRecentPosts(postsResponse.data.posts);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      
      // Fallback to local JSON if backend fails
      try {
        const pubResp = await fetch('/books_full.json');
        if (pubResp.ok) {
          const pubData = await pubResp.json();
          const books = pubData.slice(0, 6).map((b, idx) => ({
            _id: `fallback-${idx}`,
            title: b.Book || '',
            author: b.Author || '',
            synopsis: b.Description || '',
            averageRating: b.Avg_Rating || 0,
            totalRatings: b.Num_Ratings || 0,
            coverImage: b.Image_URL || ''
          }));
          setFeaturedBooks(books);
        }
      } catch (e) {
        console.error('Fallback also failed:', e);
      }
    }
  };

  const features = [
    {
      icon: '📚',
      title: 'Browse Books',
      description: 'Explore thousands of books across all genres',
      link: '/books'
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description: 'Share your thoughts and help others discover great reads',
      link: '/books'
    },
    {
      icon: '👥',
      title: 'Connect',
      description: 'Follow readers with similar tastes and join discussions',
      link: '/search'
    },
    {
      icon: '📝',
      title: 'Share Posts',
      description: 'Create posts about your reading journey',
      link: '/posts'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                BookWormed
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Your Social Reading Platform
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Discover books, share reviews, connect with fellow readers, and track your reading journey—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link
                    to="/books"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Browse Books
                  </Link>
                  <Link
                    to="/posts"
                    className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Community Posts
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started Free
                  </button>
                  <Link
                    to="/about"
                    className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-400">Books</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{siteStats?.reviews ?? 0}+</div>
                <div className="text-gray-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{siteStats?.posts ?? 0}+</div>
                <div className="text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-400">Stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">Built for book lovers, by book lovers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Featured Books</h2>
                <p className="text-gray-400">Discover your next favorite read</p>
              </div>
              <Link
                to="/books"
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center"><span class="text-5xl">📚</span></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                        <span className="text-5xl">📚</span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">{book.author}</p>
                      {book.averageRating > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm text-gray-300">{book.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Section */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Community Buzz</h2>
                <p className="text-gray-400">See what readers are talking about</p>
              </div>
              <Link
                to="/posts"
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
              >
                View All Posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post._id}
                  to="/posts"
                  onClick={() => window.scrollTo(0, 0)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {post.authorName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{post.authorName || 'Anonymous'}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!user && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your Reading Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of readers sharing their love for books
              </p>
              <button
                onClick={() => setShowLogin(true)}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                Sign Up Now - It's Free!
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
