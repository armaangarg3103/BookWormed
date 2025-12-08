import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { backendUrl, token, user } = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(user?._id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editContent, setEditContent] = useState(post.content || '');
  const [editImageUrl, setEditImageUrl] = useState(post.imageUrl || '');
  const [editTags, setEditTags] = useState(post.tags?.join(', ') || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAuthor = user?._id === post.author?._id || user?._id === post.author;

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/post/${post._id}/like`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setIsLiked(response.data.isLiked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/post/${post._id}/comment`,
        { text: newComment.trim() },
        { headers: { token } }
      );

      if (response.data.success) {
        setComments([...comments, response.data.comment]);
        setCommentsCount(response.data.commentsCount);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/post/${post._id}`,
        { 
          headers: { token },
          data: { confirmed: true }
        }
      );

      if (response.data.success) {
        if (onPostDelete) {
          onPostDelete(post._id);
        }
        setShowDeleteConfirm(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeleteModal(true);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Title and content are required');
      return;
    }

    setIsUpdating(true);
    try {
      // Split by comma or # and clean up tags
      const tagArray = editTags.split(/[,#]/)
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const response = await axios.put(
        `${backendUrl}/api/post/${post._id}`,
        {
          title: editTitle.trim(),
          content: editContent.trim(),
          imageUrl: editImageUrl.trim(),
          tags: tagArray
        },
        { headers: { token } }
      );

      if (response.data.success) {
        if (onPostUpdate) {
          onPostUpdate(response.data.post);
        }
        setIsEditing(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {post.authorName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-white">{post.authorName || 'Anonymous'}</h3>
              <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="text-gray-400 hover:text-gray-200 px-2"
              >
                ⋮
              </button>
              {showDeleteConfirm && (
                <div className="absolute right-0 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDeleteConfirm(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-blue-400 hover:bg-gray-600"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-600"
                  >
                    Delete Post
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="p-4 bg-gray-900">
          <form onSubmit={handleUpdatePost}>
            <div className="mb-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={300}
                disabled={isUpdating}
              />
            </div>
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
                maxLength={10000}
                disabled={isUpdating}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma or # separated)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              />
              {editTags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {editTags.split(/[,#]/).map((tag, index) => {
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(post.title || '');
                  setEditContent(post.content || '');
                  setEditImageUrl(post.imageUrl || '');
                  setEditTags(post.tags?.join(', ') || '');
                }}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-gray-300 whitespace-pre-wrap mb-3">{post.content}</p>
          
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full rounded-lg mb-3 max-h-96 object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-700 flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-400 bg-red-900/30'
              : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-700 p-4 bg-gray-900">
          {/* Add Comment Form */}
          {token && (
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCommenting}
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={isCommenting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {isCommenting ? '...' : 'Post'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment, index) => (
                <div key={comment._id || index} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      @
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          @{comment.userName || 'anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Delete Post?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
