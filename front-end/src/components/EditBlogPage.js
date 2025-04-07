import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth'
import '../static/master.css'

const EditBlogPage = () => {
  const { id } = useParams();  
  const navigate = useNavigate(); 
  const [blog, setBlog] = useState({ID:'', Title: '', Content: '', Tags: '' });
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
      .then((response) => response.json())
      .then((data) => {
        setBlog({
            ID: data.ID,
            Title: data.Title,
            Content: data.Content,
            Tags: data.Tags || ''
          });
      })
      .catch((error) => setError('Error fetching blog'));
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blog),
    })
      .then(() => navigate('/myblogs'))
      .catch((error) => setError('Error updating blog'));
  };

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create-blog-page">
      <h2>Edit Blog</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="Title"
            value={blog.Title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="Content"
            value={blog.Content}
            onChange={handleChange}
            placeholder="Content"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="Tags"
            value={blog.Tags}
            onChange={handleChange}
            placeholder="Enter tags, separated by comas"
          />
        </div>

        <button type="submit" >Update Blog</button>
        <button type="submit" onClick={() => navigate('/myblogs')}>Go back</button>
      </form>
    </div>
  );
};

export default EditBlogPage;
