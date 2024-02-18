import React, { useState } from 'react';
import firebase from '../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    CssBaseline,
    Container
  } from '@mui/material';
  import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const defaultTheme = createTheme();

  const handleLogin = (e) => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Usuario logueado:', user);
        // redirect to home
        navigate('/');
      })
      .catch((error) => {
        console.log('Error al iniciar sesión:', error);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Iniciar sesión
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }} method="post">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
                >
                    Ingresar
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                    <Link variant="body2" to="/register">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
        </Container>
    </ThemeProvider>
  );
}

export default Login;