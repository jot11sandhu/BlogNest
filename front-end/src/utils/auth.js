  export const login = (data) => {
    localStorage.setItem('token', data.token);  // Save JWT token to localStorage
    localStorage.setItem('userid', data.userid);
    localStorage.setItem('name', data.name);
  };

  export const logout = () => {
    localStorage.removeItem('token');  // Remove JWT token on logout
    localStorage.removeItem('userid');
    localStorage.removeItem('name');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');  // Retrieve JWT token
  };
  
  export const getuserid = () => {
    return localStorage.getItem('userid');  // Retrieve userid
  };

  export const isAuthenticated = () => {
    return !!getToken();  // Return true if the token exists, false otherwise
  };

  export const getName = () => {
    return localStorage.getItem('name') ? localStorage.getItem('name') : "Profile" ; // Retrieve name
  };
