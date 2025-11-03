import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  CleanHands as CleanHandsIcon,
  PhotoCamera as PhotoCameraIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI } from '../services/api';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);
  const [cleanupImage, setCleanupImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getById(id);
      setReport(response.data);
    } catch (error) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await reportsAPI.claim(id, user.id);
      loadReport();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to claim report');
    }
  };

  const handleCleanupSubmit = async () => {
    if (!cleanupImage) {
      setError('Please upload a cleanup image');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', cleanupImage);
      formData.append('userId', user.id);

      const response = await reportsAPI.submitCleanup(id, formData);
      setCleanupDialogOpen(false);
      setCleanupImage(null);
      loadReport();
      
      if (response.data.verification.verified) {
        alert('Cleanup verified! You earned 50 points!');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit cleanup');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: 'warning',
      claimed: 'info',
      cleaned: 'primary',
      verified: 'success',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Report not found</Alert>
      </Container>
    );
  }

  const canClaim = report.status === 'reported' && user;
  const canCleanup = (report.status === 'claimed' || report.status === 'reported') && 
                     user && report.claimedBy === user.id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/reports')}
        sx={{ mb: 3 }}
      >
        Back to Reports
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip
                label={report.status.toUpperCase()}
                color={getStatusColor(report.status)}
                size="large"
              />
              {report.status === 'verified' && (
                <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
              )}
            </Box>

            <Typography variant="h5" gutterBottom>
              {report.address}
            </Typography>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </Typography>
            </Box>

            {report.description && (
              <Typography variant="body1" paragraph>
                {report.description}
              </Typography>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Waste Classifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {report.wasteClassifications?.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={`${item.type}: ${item.confidence}%`}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <img
                src={`http://localhost:5000${report.imageUrl}`}
                alt="Garbage site"
                style={{ width: '100%', borderRadius: 8 }}
              />
            </Box>

            {report.cleanupImages && report.cleanupImages.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Cleanup Images
                </Typography>
                <Grid container spacing={2}>
                  {report.cleanupImages.map((img, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Cleanup ${idx + 1}`}
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>

            {canClaim && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleClaim}
                sx={{ mb: 2 }}
              >
                Claim This Site
              </Button>
            )}

            {canCleanup && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CleanHandsIcon />}
                onClick={() => setCleanupDialogOpen(true)}
              >
                Submit Cleanup
              </Button>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Points Available: {report.pointsAwarded} pts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(report.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cleanup Dialog */}
      <Dialog open={cleanupDialogOpen} onClose={() => setCleanupDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Cleanup Verification</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="cleanup-upload"
              type="file"
              onChange={(e) => setCleanupImage(e.target.files[0])}
            />
            <label htmlFor="cleanup-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                fullWidth
                sx={{ py: 2, mb: 2 }}
              >
                {cleanupImage ? cleanupImage.name : 'Upload Cleanup Image'}
              </Button>
            </label>
            {cleanupImage && (
              <img
                src={URL.createObjectURL(cleanupImage)}
                alt="Cleanup preview"
                style={{ width: '100%', borderRadius: 8 }}
              />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Upload a photo showing the cleaned area. Our AI will verify it matches the original report.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCleanupDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCleanupSubmit}
            variant="contained"
            disabled={!cleanupImage || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportDetail;
