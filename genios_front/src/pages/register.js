import React, { useState } from 'react';
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const handleRegister = (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Usuario registrado:', user);
        // redirect to login
        navigate('/login');
      })
      .catch((error) => {
        console.log('Error al registrarse:', error);
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
                Registro
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }} method="post">
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
                        onClick={handleRegister}
                    >
                        Registrar
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                        <Link variant="body2" to="/login">
                            ¿Ya tienes una cuenta? Inicia sesión
                        </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
  );
}

export default Register;