import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddCircleIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #2e7d32 100%)',
        boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
      }}
    >
      <Toolbar>
        <RecyclingIcon sx={{ mr: 2, fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 0,
            mr: 4,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Trash2Treasure
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/reports">
            Reports
          </Button>
          <Button color="inherit" component={Link} to="/leaderboard">
            Leaderboard
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Chip
                label={`${user.username} - ${user.points} pts`}
                color="secondary"
                size="small"
              />
              <Button
                color="inherit"
                startIcon={<AddCircleIcon />}
                component={Link}
                to="/create-report"
              >
                Report
              </Button>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                component={Link}
                to="/dashboard"
              >
                Dashboard
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/register"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
