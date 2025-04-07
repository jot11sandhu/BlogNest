import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getuserid, getToken } from '../utils/auth'
import '../static/master.css'

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userid = getuserid();
  const token = getToken();

  useEffect(() => {
    fetch(`http://localhost:8080/api/blog/user/${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        return response.json();
      })
      .then((data) => {
        setBlogs(data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setError(error.message);
        setLoading(false);
      });
  }, [userid, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="home-page">No blogs found !!!</div>;
  }

  return (
    <div className="home-page">
      <h2 className="page-title">My Blogs</h2>
      
      <div className="blog-list">
        {blogs.map((blog, index) => (
          <div key={blog.ID} className="blog-card">
            <Link to={`/blog/${blog.ID}`} className="blog-title-link">
              <h3>{blog.Title}</h3>
            </Link>
            <p>{blog.Content}</p>
            <div className="tags">
              {blog.Tags &&
                blog.Tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag.trim()}
                  </span>
                ))}
            </div>
            <div className="blog-actions-dropdown">
              <div className="dots">⋮</div>
              <div className="dropdown-menu">
                <Link to={`/edit/${blog.ID}`} className="edit-button">Edit</Link>
                <Link to={`/delete/${blog.ID}`} className="delete-button">Delete</Link>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default MyBlogs;