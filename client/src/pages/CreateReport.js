import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI } from '../services/api';

const CreateReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          setError('Unable to retrieve your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.image) {
      setError('Please upload an image');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError('Please provide location coordinates');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('image', formData.image);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      submitData.append('reporterId', user?.id || 'anonymous');

      const response = await reportsAPI.create(submitData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/report/${response.data.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        setError('Backend server is not running. Please start the server on port 5000.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Failed to create report. Please check that the backend server is running and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Report a Trash Site
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Report created successfully! Redirecting...
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Description (optional)"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the garbage site..."
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address or location name"
            />
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleInputChange}
              required
              inputProps={{ step: 'any' }}
            />
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleInputChange}
              required
              inputProps={{ step: 'any' }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<LocationOnIcon />}
              onClick={getCurrentLocation}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Use Current Location
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                {formData.image ? formData.image.name : 'Upload Image'}
              </Button>
            </label>
            {formData.image && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Report'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateReport;
