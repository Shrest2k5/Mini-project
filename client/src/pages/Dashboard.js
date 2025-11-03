import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
  Report as ReportIcon,
  CleanHands as CleanHandsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI, usersAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadUserReports();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const response = await usersAPI.getById(user.id);
      setUserData(response.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReports = async () => {
    try {
      const response = await reportsAPI.getAll({ userId: user.id });
      setUserReports(response.data);
    } catch (error) {
      console.error('Error loading user reports:', error);
    }
  };

  if (loading || !userData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome back, {userData.username}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{userData.points}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Points
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReportIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{userData.reportsCreated}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reports Created
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CleanHandsIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{userData.cleanupsCompleted}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cleanups Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Your Reports
      </Typography>

      {userReports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't created any reports yet. Start by reporting a garbage site!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {userReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={report.status}
                      size="small"
                      color={report.status === 'verified' ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="h6" noWrap gutterBottom>
                    {report.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
