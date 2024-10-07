import React from 'react';

// This is the home page, we will do a check to see if the user has a auth key to see if they get the corresponding details

const HomePage = () => {
  const jwt = localStorage.getItem('JWT');
  const name = localStorage.getItem('name');

  return (
    <div style={styles.container}>
      <h1>WELCOME {jwt && name ? name : ''}</h1>
      {!jwt && !name && <p>you are not logged in</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    paddingTop: '20px',
  },
};

export default HomePage;