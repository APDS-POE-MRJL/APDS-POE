import React from 'react';

const HomePage = () => {
  const jwt = localStorage.getItem('JWT');
  const name = localStorage.getItem('name');

  return (
    <div className="container text-center mt-5">
      <h1>Welcome {jwt && name ? name : 'to APDS Notice Board'}</h1>
      {!jwt && !name && <p>Please login to view your dashboard.</p>}
    </div>
  );
};

export default HomePage;
