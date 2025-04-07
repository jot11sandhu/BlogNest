import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth'
import '../static/master.css'

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const token = getToken();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const blogData = {
      title,
      content,
      tags
    };

    fetch('http://localhost:8080/api/blog', {
        method: 'POST', // HTTP method for creating a new resource
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Title: blogData.title,
          Content: blogData.content,
          Tags: blogData.tags
        }

        ), // Convert the blog data to JSON format
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset the form after submission
          setTitle('');
          setContent('');
          setTags('');

          navigate('/myblogs')
        })
        .catch((error) => {
          console.error('Error creating blog:', error); // Handle errors
        });

    // Reset the form after submission
    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <div className="create-blog-page">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags:</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags, separated by commas"
          />
        </div>


        <button type="submit">Create Blog Post</button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
