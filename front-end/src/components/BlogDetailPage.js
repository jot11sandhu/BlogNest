import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../static/master.css'
import { getToken } from '../utils/auth'

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const token = getToken();

  useEffect(() => {
    fetch(`http://localhost:8080/api/blog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blog');
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => setError(err.message));
  }, [id, token]);

  if (error) return <div className="error-message">{error}</div>;
  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-detail-container">
    <h2>{blog.Title}</h2>
    <p>{blog.Content}</p>
  
    {blog.Tags && (
      <div className="tags">
              {blog.Tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag.trim()}
                  </span>
                ))}
      </div>
    )}


  
    <div className="meta-info">
      <span className="author">By: {blog.User.Firstname + ' ' + blog.User.Lastname}</span>
      <span className="date">Published: {new Date(blog.PublicationDate).toISOString().split('T')[0]}</span>
    </div>
  
    <div className="back-home-link">
      <Link to="/">← Back to Home</Link>
    </div>
  </div>
  );
};

export default BlogDetailPage;
