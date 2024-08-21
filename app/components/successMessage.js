import React from 'react';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div style={styles.container}>
      <div style={styles.message}>
        <p>{message}</p>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    padding: '15px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  message: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    marginLeft: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default SuccessMessage;
