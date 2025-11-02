import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Chip,
  IconButton,
  CardActions,
} from '@mui/material';
import { Delete, Edit, Token } from '@mui/icons-material';
import { getCollections, deleteCollection } from '../store/slices/collectionSlice';

function CollectionList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { collections, isLoading } = useSelector((state) => state.collection);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comic?')) {
      await dispatch(deleteCollection(id));
      dispatch(getCollections());
    }
  };

  const filteredCollections = collections.filter((comic) =>
    comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comic.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comic.issueNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Collection
      </Typography>

      <TextField
        fullWidth
        label="Search comics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredCollections.map((comic) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={comic._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={comic.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
                alt={comic.title}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => navigate(`/comic/${comic._id}`)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {comic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {comic.publisher} #{comic.issueNumber}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={comic.condition} size="small" color="primary" />
                  {comic.isMintedAsNFT && (
                    <Chip
                      label="NFT"
                      size="small"
                      color="secondary"
                      icon={<Token />}
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ${comic.currentValue?.toFixed(2) || '0.00'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/comic/${comic._id}`)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(comic._id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCollections.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No comics found in your collection
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default CollectionList;
