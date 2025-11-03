import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, statusFilter, searchTerm]);

  const loadReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
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

  const getStatusLabel = (status) => {
    const labels = {
      reported: 'Reported',
      claimed: 'Claimed',
      cleaned: 'Cleaned',
      verified: 'Verified',
    };
    return labels[status] || status;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <ReportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Garbage Reports
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search reports"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="reported">Reported</MenuItem>
              <MenuItem value="claimed">Claimed</MenuItem>
              <MenuItem value="cleaned">Cleaned</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredReports.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No reports found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredReports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${report.imageUrl}`}
                  alt="Garbage site"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={getStatusLabel(report.status)}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                    {report.status === 'verified' && (
                      <CheckCircleIcon color="success" />
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom noWrap>
                    {report.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {report.description || 'No description provided'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {report.wasteClassifications?.slice(0, 3).map((item, idx) => (
                      <Chip
                        key={idx}
                        label={`${item.type} (${item.confidence}%)`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/report/${report.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Reports;
