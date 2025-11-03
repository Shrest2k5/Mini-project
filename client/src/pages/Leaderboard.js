import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.get();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 0) return '#FFD700'; // Gold
    if (rank === 1) return '#C0C0C0'; // Silver
    if (rank === 2) return '#CD7F32'; // Bronze
    return 'inherit';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading leaderboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Leaderboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Top contributors making a difference in their communities
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell align="right">Reports</TableCell>
              <TableCell align="right">Cleanups</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  bgcolor: index < 3 ? 'action.hover' : 'inherit',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {index < 3 && (
                      <EmojiEventsIcon
                        sx={{ mr: 1, color: getRankColor(index) }}
                      />
                    )}
                    <Typography variant="body1" fontWeight={index < 3 ? 'bold' : 'normal'}>
                      {index + 1}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body1">{user.username}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={user.points}
                    color="warning"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{user.reportsCreated}</TableCell>
                <TableCell align="right">{user.cleanupsCompleted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {leaderboard.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography color="text.secondary">
            No users on the leaderboard yet. Be the first!
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Leaderboard;
