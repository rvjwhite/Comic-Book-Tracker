import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Collections,
  AttachMoney,
  Token,
} from '@mui/icons-material';
import { getStats, getCollections } from '../store/slices/collectionSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, isLoading, isError, message } = useSelector((state) => state.collection);

  useEffect(() => {
    dispatch(getStats());
    dispatch(getCollections());
  }, [dispatch]);

  if (isLoading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError && !stats) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {message || 'Failed to load dashboard data. Please check your connection.'}
        </Alert>
        <Button variant="contained" onClick={() => { dispatch(getStats()); dispatch(getCollections()); }}>
          Retry
        </Button>
      </Box>
    );
  }

  const statsCards = [
    {
      title: 'Total Items',
      value: stats?.totalItems || 0,
      icon: <Collections fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Value',
      value: `$${(stats?.totalValue || 0).toFixed(2)}`,
      icon: <AttachMoney fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Total Invested',
      value: `$${(stats?.totalInvested || 0).toFixed(2)}`,
      icon: <TrendingUp fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'NFTs Minted',
      value: stats?.nftMinted || 0,
      icon: <Token fontSize="large" />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection by Publisher
              </Typography>
              {stats?.byPublisher && Object.entries(stats.byPublisher).map(([publisher, count]) => (
                <Box key={publisher} display="flex" justifyContent="space-between" sx={{ py: 1 }}>
                  <Typography>{publisher}</Typography>
                  <Typography fontWeight="bold">{count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection by Condition
              </Typography>
              {stats?.byCondition && Object.entries(stats.byCondition).map(([condition, count]) => (
                <Box key={condition} display="flex" justifyContent="space-between" sx={{ py: 1 }}>
                  <Typography>{condition}</Typography>
                  <Typography fontWeight="bold">{count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
