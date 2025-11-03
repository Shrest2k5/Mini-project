import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  Visibility as VisibilityIcon,
  EmojiEvents as EmojiEventsIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { statisticsAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    statisticsAPI.get()
      .then((response) => setStats(response.data))
      .catch((error) => console.error('Error fetching statistics:', error));
  }, []);

  const features = [
    {
      title: 'Report Trash Sites',
      description: 'Upload images and location data for trash sites in your community',
      icon: <AddCircleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'AI Verification',
      description: 'Automatic verification of cleanup completion using AI technology',
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Waste Classification',
      description: 'AI-powered classification of waste types for better recycling',
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Rewards System',
      description: 'Earn points for reporting and cleaning up sites',
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        position: 'relative',
        '&::before': {
          content: '"🌿"',
          position: 'absolute',
          left: '-5%',
          top: '10%',
          fontSize: '4rem',
          opacity: 0.15,
          animation: 'float 8s ease-in-out infinite',
        },
        '&::after': {
          content: '"🍃"',
          position: 'absolute',
          right: '-5%',
          bottom: '10%',
          fontSize: '3rem',
          opacity: 0.15,
          animation: 'float 6s ease-in-out infinite 2s',
        },
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 800, 
          color: 'primary.main',
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}>
          🌿 Clean Community Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Report, Clean, and Transform Your Community
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Join our community-driven initiative to identify, report, and clean up trash sites. 
          Use AI-powered tools to verify cleanups and earn rewards for your contributions.
        </Typography>
        {user ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/create-report')}
            sx={{ mr: 2 }}
          >
            Report a Site
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        )}
      </Box>

      {/* Statistics */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
              border: '2px solid',
              borderColor: 'primary.light',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '"📊"',
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.5rem',
                opacity: 0.2,
              },
            }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {stats.totalReports}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Reports
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
              border: '2px solid',
              borderColor: 'success.light',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '"✅"',
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.5rem',
                opacity: 0.2,
              },
            }}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {stats.totalCleanups}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Cleanups Completed
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
              border: '2px solid',
              borderColor: 'secondary.light',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '"👥"',
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.5rem',
                opacity: 0.2,
              },
            }}>
              <Typography variant="h3" color="secondary.main" fontWeight="bold">
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Active Members
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              p: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
              border: '2px solid',
              borderColor: 'primary.light',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '"🏆"',
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '1.5rem',
                opacity: 0.2,
              },
            }}>
              <Typography variant="h3" color="primary.dark" fontWeight="bold">
                {stats.totalPointsAwarded}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Points Awarded
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Features */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ 
        mb: 4, 
        textAlign: 'center',
        color: 'primary.dark',
        fontWeight: 700,
      }}>
        🌱 Platform Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%)',
              border: '2px solid',
              borderColor: 'rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)',
                borderColor: 'primary.main',
              },
            }}>
              <Box sx={{ 
                color: feature.color, 
                mb: 2,
                display: 'flex',
                justifyContent: 'center',
                '& svg': {
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                },
              }}>
                {feature.icon}
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 Q 40 20, 30 30 Q 20 20, 30 10' fill='%23ffffff' opacity='0.1'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        },
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, position: 'relative', zIndex: 1 }}>
          🌍 Ready to Make a Difference?
        </Typography>
        <Typography variant="body1" paragraph sx={{ position: 'relative', zIndex: 1 }}>
          Join thousands of community members working together to keep our environment clean.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(user ? '/create-report' : '/register')}
          sx={{ 
            mt: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            color: 'primary.main',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.05)',
            },
            position: 'relative',
            zIndex: 1,
          }}
        >
          {user ? 'Report a Site' : 'Get Started Now'}
        </Button>
      </Paper>
    </Container>
  );
};

export default Home;
