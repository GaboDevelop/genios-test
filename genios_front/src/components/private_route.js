import React, { useState, useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import firebase from '../firebase';

function PrivateRoute({ component: Component, ...rest }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthed(true);
      } else {
        setAuthed(false);
        navigate('/login'); // Use useNavigate here
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) => (authed ? <Component {...props} /> : null)}
    />
  );
}

export default PrivateRoute;
