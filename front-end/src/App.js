import CreateBlogPage from './components/CreateBlogPage';
import EditBlogPage from './components/EditBlogPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import SignupPage from './components/SignupPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeleteBlogPage from './components/DeleteBlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import MyBlogs from './components/MyBlogs';
import { useState, useEffect } from 'react';
import Header from './layout/Header';
import './static/master.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const fetchBlogs = () => {
      fetch('http://localhost:8080/api/blog/all')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch blogs');
            }
            return response.json();
          })
          .then((data) => {
            setBlogs(data.blogs);
            setFilteredBlogs(data.blogs);
            setLoading(false);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
    };

    useEffect(() => {
        fetchBlogs();
      }, []);

  return (
    <Router>
      <Header blogs={blogs} setFilteredBlogs={setFilteredBlogs} />

        <Routes>
          <Route path="/" element={
            <HomePage
              filteredBlogs={filteredBlogs}
              loading={loading}
              error={error}
              fetchBlogs={fetchBlogs}
            />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create" element={
            <PrivateRoute>
              <CreateBlogPage />
            </PrivateRoute>
            } />
          <Route path="/blog/:id" element={
            <PrivateRoute>
              <BlogDetailPage />
            </PrivateRoute>
            } />
          <Route path="/myblogs" element={
            <PrivateRoute>
              <MyBlogs />
            </PrivateRoute>
            } />
          <Route path="/edit/:id" element={
            <PrivateRoute>
              <EditBlogPage />
            </PrivateRoute>
          } />
          <Route path="/delete/:id" element={
            <PrivateRoute>
              <DeleteBlogPage />
            </PrivateRoute>
          } />
      </Routes>
    </Router>

  );
}

export default App;
