import { React, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { isAuthenticated, logout, getName } from '../utils/auth';
import '../static/master.css'

const Header = ({ blogs, setFilteredBlogs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.Tags.toLowerCase().includes(query)
      );
      setFilteredBlogs(filtered);
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function to remove the JWT token
    navigate('/login'); // Redirect to the login page after logging out
  };

  return (
     <Navbar bg="light" expand="lg" fixed="top">
     <Container>
       <Navbar.Brand as={Link} to="/">BlogNest</Navbar.Brand>
       {location.pathname === '/' && (
          <input
            type="text"
            placeholder="Search by tags"
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
        )}
       <Navbar.Toggle aria-controls="basic-navbar-nav" />
       <Navbar.Collapse id="basic-navbar-nav">
         <Nav className="ms-auto">
           {isAuthenticated() ? (
             <>
              <NavDropdown title={getName()} id="profile-dropdown">
                <NavDropdown.Item as={Link} to="/create">Create New Blog</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/myblogs">My Blogs</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
             </>
           ) : (
             <>
               <Nav.Link as={Link} to="/login">Login</Nav.Link>
               <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
             </>
           )}
         </Nav>
       </Navbar.Collapse>
     </Container>
   </Navbar>
  );
};

export default Header;