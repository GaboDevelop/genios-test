import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Grid
} from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function Home() {
    const [authed, setAuthed] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [datasetInteraction, setDatasetInteraction] = useState([ ]);
    const [datasetSentiment, setDatasetSentiment] = useState([ ]);
    const [datasetEmotion, setDatasetEmotion] = useState([ ]);
    const [loadingInteraction, setLoadingInteraction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingSentiment, setLoadingSentiment] = useState(false);
    const [loadingEmotion, setLoadingEmotion] = useState(false);
    const [errorSentiment, setErrorSentiment] = useState(false);
    const [errorEmotion, setErrorEmotion] = useState(false);
    const [errorInteraction, setErrorInteraction] = useState(false);
    const [errorMessageSentiment, setErrorMessageSentiment] = useState('');
    const [errorMessageEmotion, setErrorMessageEmotion] = useState('');
    const [errorMessageInteraction, setErrorMessageInteraction] = useState('');
    const [file, setFile] = useState(null);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(200);
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

    const handleLogout = () => {
        firebase.auth().signOut()
        .then(() => {
            console.log('Sesión cerrada correctamente');
        })
        .catch((error) => {
            console.log('Error al cerrar la sesión:', error);
        });
    };

    const handleUploadInteraction = async (formData) => {
      setLoadingInteraction(true);
      // get api url of .env

      const resInteraction = await axios.post(
        `${process.env.REACT_APP_API_URL}/analysis/interaction/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoadingInteraction(false);
      if (resInteraction.status === 200 && resInteraction.data.success) {
        console.log('Archivo subido correctamente');
        const { data } = resInteraction.data;
        let { likes, comments, shares, reactions } = data;
        if (datasetInteraction.length > 0) {
          let likeItem = datasetInteraction[0];
          let commentsItem = datasetInteraction[1];
          let sharesItem = datasetInteraction[2];
          let reactionsItem = datasetInteraction[3];
          likes = (likes + likeItem.value) / 2;
          comments = (comments + commentsItem.value) / 2;
          shares = (shares + sharesItem.value) / 2;
          reactions = (reactions + reactionsItem.value) / 2;
        }
        let newDataSet = [
          {
            id: 0,
            value: likes,
            label: 'Likes',
          },
          {
            id: 1,
            value: comments,
            label: 'Comentarios',
          },
          {
            id: 2,
            value: shares,
            label: 'Compartidos',
          },
          {
            id: 3,
            value: reactions,
            label: 'Reacciones',
          },
        ];
        setDatasetInteraction(newDataSet);
        setErrorInteraction(false);
        setErrorMessageSentiment('');
      }else{
        console.log('Error al subir el archivo');
        setDatasetInteraction([]);
        setErrorInteraction(true);
        setErrorMessageInteraction('Error al subir el archivo: ' + resInteraction.data.error? resInteraction.data.error : 'Error desconocido');
      }
    };

    const handleUploadSentiment = async (formData) => {
      setLoadingSentiment(true);
      const resSentiment = await axios.post(
        `${process.env.REACT_APP_API_URL}/analysis/sentiment/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoadingSentiment(false);
      if (resSentiment.status === 200 && resSentiment.data.success) {
        console.log('Archivo subido correctamente');
        const { data } = resSentiment.data;
        let { NEU, NEG, POS } = data;
        if (datasetSentiment.length > 0) {
          let currentData = datasetSentiment[0];
          NEU = (NEU + currentData.NEU) / 2;
          NEG = (NEG + currentData.NEG) / 2;
          POS = (POS + currentData.POS) / 2;
        }
        let newDataSet = [
          {
            NEG: NEG,
            NEU: NEU,
            POS: POS,
          },
        ];
        setDatasetSentiment(newDataSet);
        setErrorSentiment(false);
        setErrorMessageSentiment('');
      }else{
        console.log('Error al subir el archivo');
        setDatasetSentiment([]);
        setErrorSentiment(true);
        setErrorMessageSentiment('Error al subir el archivo: ' + resSentiment.data.error? resSentiment.data.error : 'Error desconocido');
      }
    };

    const handleUploadEmotion = async (formData) => {
      setLoadingEmotion(true);
      const resEmotion = await axios.post(
        `${process.env.REACT_APP_API_URL}/analysis/emotion/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoadingEmotion(false);
      if (resEmotion.status === 200 && resEmotion.data.success) {
        console.log('Archivo subido correctamente');
        const { data } = resEmotion.data;
        let { anger, disgust, joy, fear, surprise, sadness, others } = data;
        if (datasetEmotion.length > 0) {
          let currentData = datasetEmotion[0];
          anger = (anger + currentData.anger) / 2;
          disgust = (disgust + currentData.disgust) / 2;
          joy = (joy + currentData.joy) / 2;
          fear = (fear + currentData.fear) / 2;
          surprise = (surprise + currentData.surprise) / 2;
          sadness = (sadness + currentData.sadness) / 2;
          others = (others + currentData.others) / 2;
        } 
        let newDataSet = [
          {
            anger,
            disgust,
            joy,
            fear,
            surprise,
            sadness,
            others,
          },
        ];
        setDatasetEmotion(newDataSet);
        setErrorEmotion(false);
        setErrorMessageEmotion('');
      }else{
        console.log('Error al subir el archivo');
        setDatasetEmotion([]);
        setErrorEmotion(true);
        setErrorMessageEmotion('Error al subir el archivo: ' + resEmotion.data.error? resEmotion.data.error : 'Error desconocido');
      }
    };

    const handleUpload = async () => {
        if (!file) {
          setError(true);
          setErrorMessage('Por favor seleccione un archivo');
          return;
        }

        if (limit < 1) {
          setError(true);
          setErrorMessage('El limite debe ser mayor a 0');
          return;
        }

        if (offset < 0) {
          setError(true);
          setErrorMessage('Debe empezar en un rango mayor o igual a 0');
          return;
        }

        if (limit > 200) {
          setError(true);
          setErrorMessage('El limite no puede ser mayor a 200');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('offset', offset);
        formData.append('limit', limit);
        
        await handleUploadInteraction(formData);
        await handleUploadSentiment(formData);
        await handleUploadEmotion(formData);

    };


    console.log("ENV", process.env)

    return (
        <Grid container spacing={2} justifyContent="center" alignContent="center">
            <Grid item xs={8}>
              <Button onClick={handleLogout}>Cerrar sesión</Button>
            </Grid>
            <Grid item xs={8}>
              <h1 style={{'textAlign': 'center'}} sx={{ mt: 2 }}>Subir archivo</h1>
            </Grid>

            <Grid container xs={8} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={8}>
              <Alert severity="warning">El analisis esta limitado a 200 registros por peticion, por favor agregue el rango de datos a analizar y agregar a la data existente.</Alert>
              </Grid>
            </Grid>

            <Grid container xs={8} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item xs={8}>
              {
                error ? (
                  <Alert severity="error">
                    {errorMessage}
                  </Alert>
                ) : ''
              }
              </Grid>
            </Grid>

            <Grid container xs={8} justifyContent="center"  sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <TextField id="offset" name="offset" label="Desde" variant="outlined" type="number" onChange={(e) => setOffset(e.target.value)} value={offset} />
              </Grid>
              <Grid item xs={4}>
                <TextField id="limit" name="limit" label="Cantidad de registros" variant="outlined" type="number" onChange={(e) => setLimit(e.target.value)} value={limit} />
              </Grid>
              <Grid item xs={8} sx={{ mt: 2 }}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                  Cargar archivo
                  <VisuallyHiddenInput type="file" onChange={(e) => setFile(e.target.files[0])} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </Button>
              </Grid>
              <Grid item xs={8} sx={{ mt: 2 }}>
                {file ?(
                      <Box sx={{ mt: 2 }}>
                      <p>Archivo seleccionado: {file.name}</p>
                      </Box>
                  ) : ""}
                  {loading ? (
                <CircularProgress />
            ) : ''}

            { 
              !loading && file ? (
                  <Button onClick={handleUpload}>Analizar</Button>
              ) : ''
            }
              </Grid>
            </Grid>
        

            <Grid container spacing={2} justifyContent="center" style={{'textAlign': 'center'}}  sx={{ mt: 2 }}>
              <Grid item xs={8}>
                {
                  errorInteraction ? (
                      <Alert severity="error">
                        {errorMessageInteraction}
                      </Alert>
                    
                  ) : ''
                }
                {
                  loadingInteraction ? (
                    <CircularProgress />
                  ) : ''
                }
                {
                  !loadingInteraction && datasetInteraction.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: datasetInteraction,
                      },
                    ]}
                    height={400}
                  />
                  )
                  : ''
                }
                
              </Grid>

              <Grid item xs={6} justifyContent="center" alignContent="center" style={{'textAlign': 'center'}}>
                {
                  errorSentiment ? (
                    <Alert severity="error">
                      {errorMessageSentiment}
                    </Alert>
                  ) : ''
                }
                {
                  loadingSentiment ? (
                    <CircularProgress />
                  ) : ''
                }
                {
                  !loadingSentiment && datasetSentiment.length > 0 ? (
                    <BarChart
                        dataset={datasetSentiment}
                        height={400}
                        xAxis={[{ data: ['Sentimiento'], scaleType: 'band' }]}
                        series={[
                          { dataKey: 'NEG', label: 'Negativo' },
                          { dataKey: 'NEU', label: 'Neutro' },
                          { dataKey: 'POS', label: 'Positivo' },
                        ]}
                        margin={{ top: 40, bottom: 30, left: 40, right: 10 }}
                    />
                  ) : ''
                }
              </Grid>

              <Grid item xs={6} justifyContent="center" alignContent="center" style={{'textAlign': 'center'}}>
                {
                  errorEmotion ? (
                    <Alert severity="error">
                      {errorMessageEmotion}
                    </Alert>
                  ) : ''
                }
                {
                  loadingEmotion ? (
                    <CircularProgress />
                  ) : ''
                }
                {
                  !loadingEmotion && datasetEmotion.length > 0 ? (
                    <BarChart
                        dataset={datasetEmotion}
                        height={400}
                        xAxis={[{ data: ['Sentimiento'], scaleType: 'band' }]}
                        series={[
                          { dataKey: 'anger', label: 'Enojo' },
                          { dataKey: 'disgust', label: 'Disgusto' },
                          { dataKey: 'joy', label: 'Alegria' },
                          { dataKey: 'fear', label: 'Miedo' },
                          { dataKey: 'surprise', label: 'Sorpresa' },
                          { dataKey: 'sadness', label: 'Tristeza' },
                          { dataKey: 'others', label: 'Otros' },
                        ]}
                        margin={{ top: 40, bottom: 30, left: 40, right: 10 }}
                    />
                  ) : ''
                }
              </Grid>
            </Grid>
        </Grid>
    );
}

export default Home;