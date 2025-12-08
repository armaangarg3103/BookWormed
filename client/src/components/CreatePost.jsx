import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const { backendUrl, token, loadSiteStats } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Split by comma or # and clean up tags
      const tagArray = tags.split(/[,#]/)
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const response = await axios.post(
        `${backendUrl}/api/post/create`,
        {
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim(),
          tags: tagArray
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        // Reset form
        setTitle('');
        setContent('');
        setImageUrl('');
        setTags('');
        setShowForm(false);
        
        // Callback to refresh posts
        if (onPostCreated) {
          onPostCreated(response.data.post);
        }
        // Refresh global stats (posts count)
        try { loadSiteStats && loadSiteStats(); } catch(e) { /* ignore */ }
      } else {
        setError(response.data.message || 'Failed to create post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-gray-400">💭</span>
          <span className="text-gray-300">Create a post...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Create a Post</h2>
        <button
          onClick={() => {
            setShowForm(false);
            setError('');
          }}
          className="text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={300}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={6}
            maxLength={10000}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tags (comma or # separated, e.g., fiction, mystery or #fiction #mystery)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {tags && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.split(/[,#]/).map((tag, index) => {
                const trimmedTag = tag.trim();
                return trimmedTag ? (
                  <span
                    key={index}
                    className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full"
                  >
                    #{trimmedTag}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setTitle('');
              setContent('');
              setImageUrl('');
              setTags('');
              setError('');
            }}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
