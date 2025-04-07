import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import '../static/master.css'

const DeleteBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const token = getToken();

  useEffect(() => {
    // Fetch blog details by ID
    fetch(`http://localhost:8080/api/blog/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch blog');
        return response.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => {
        console.error(err);
        setError('Error loading blog');
      });
  }, [id, token]);

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete blog');
        navigate('/myblogs');
      })
      .catch((err) => {
        console.error(err);
        setError('Error deleting blog');
      });
  };

  if (error) return <div className="error-message">{error}</div>;

  if (!blog) return <div>Loading blog info...</div>;

  return (
    <div className="delete-blog-container">
      <h2>Are you sure you want to delete this blog?</h2>
      <h3>{blog.Title}</h3>
      <p>{blog.Content}</p>

      <div className="delete-buttons">
        <button onClick={handleDelete} className="delete-btn">Yes, Delete</button>
        <button onClick={() => navigate('/myblogs')} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteBlogPage;
