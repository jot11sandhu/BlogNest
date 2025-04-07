import React from 'react';
import { Link } from 'react-router-dom';
import '../static/master.css'
import { useEffect } from 'react';

const HomePage = ({ filteredBlogs, loading, error, fetchBlogs }) => {
  
  useEffect(() => {
    fetchBlogs(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>No blogs available !!!</div>;
  }

  return (
    <div className="home-page">
      <div className="blog-list">
        {filteredBlogs.map((blog) => (
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
          </div>
        ))}
      </div> 
    </div>
  );
};

export default HomePage;
