import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Token, TrendingUp } from '@mui/icons-material';
import { mintNFT } from '../store/slices/web3Slice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ComicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { isConnected, isLoading: web3Loading } = useSelector((state) => state.web3);

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appraisal, setAppraisal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComic();
  }, [id]);

  const fetchComic = async () => {
    try {
      const response = await axios.get(`${API_URL}/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComic(response.data.collection);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAppraise = async () => {
    try {
      const response = await axios.get(`${API_URL}/appraisal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppraisal(response.data.appraisal);
    } catch (err) {
      setError('Failed to appraise comic');
    }
  };

  const handleUpdateValue = async () => {
    if (!appraisal) return;

    try {
      await axios.post(
        `${API_URL}/appraisal/${id}/update`,
        { estimatedValue: appraisal.estimatedValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Value updated successfully!');
      fetchComic();
    } catch (err) {
      setError('Failed to update value');
    }
  };

  const handleMintNFT = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const uri = `${API_URL}/nft/metadata/${comic.nftTokenId || 'temp'}?contractAddress=${import.meta.env.VITE_CONTRACT_ADDRESS}`;

      const result = await dispatch(
        mintNFT({
          title: comic.title,
          publisher: comic.publisher,
          issueNumber: comic.issueNumber,
          condition: comic.condition,
          uri,
        })
      ).unwrap();

      // Update backend with NFT info
      await axios.post(
        `${API_URL}/nft/mint/${id}`,
        {
          tokenId: result.tokenId,
          contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
          transactionHash: result.transactionHash,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('NFT minted successfully!');
      fetchComic();
    } catch (err) {
      setError('Failed to mint NFT: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!comic) {
    return <Alert severity="info">Comic not found</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Button onClick={() => navigate('/collection')} sx={{ mb: 2 }}>
        Back to Collection
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={comic.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={comic.title}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {comic.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {comic.publisher} - Issue #{comic.issueNumber}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Chip label={comic.condition} color="primary" sx={{ mr: 1 }} />
              {comic.variant !== 'Regular Edition' && (
                <Chip label={comic.variant} sx={{ mr: 1 }} />
              )}
              {comic.isMintedAsNFT && (
                <Chip label="NFT Minted" color="secondary" icon={<Token />} />
              )}
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Purchase Price
                </Typography>
                <Typography variant="h6">${comic.purchasePrice?.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Current Value
                </Typography>
                <Typography variant="h6">${comic.currentValue?.toFixed(2)}</Typography>
              </Grid>
              {comic.gradingCompany !== 'None' && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Grading Company
                    </Typography>
                    <Typography variant="h6">{comic.gradingCompany}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Grade
                    </Typography>
                    <Typography variant="h6">{comic.grade}</Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {comic.notes && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body1">{comic.notes}</Typography>
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<TrendingUp />}
                onClick={handleAppraise}
                sx={{ mr: 2 }}
              >
                Appraise Value
              </Button>

              {!comic.isMintedAsNFT && (
                <Button
                  variant="outlined"
                  startIcon={<Token />}
                  onClick={handleMintNFT}
                  disabled={!isConnected || web3Loading}
                >
                  {web3Loading ? 'Minting...' : 'Mint as NFT'}
                </Button>
              )}
            </Box>

            {appraisal && (
              <Paper elevation={2} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Appraisal Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Value
                    </Typography>
                    <Typography variant="h5" color="primary">
                      ${appraisal.estimatedValue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Confidence
                    </Typography>
                    <Typography variant="h5">{appraisal.confidence}%</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleUpdateValue}
                      fullWidth
                    >
                      Update Current Value
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ComicDetail;
