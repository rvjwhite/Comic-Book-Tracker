import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
} from '@mui/material';
import { createCollection } from '../store/slices/collectionSlice';

const conditions = ['Poor', 'Fair', 'Good', 'Very Good', 'Fine', 'Very Fine', 'Near Mint', 'Mint'];
const gradingCompanies = ['None', 'CGC', 'CBCS', 'PGX', 'Other'];

function AddComic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    issueNumber: '',
    variant: 'Regular Edition',
    publicationDate: '',
    condition: 'Very Good',
    gradingCompany: 'None',
    grade: '',
    purchasePrice: '',
    currentValue: '',
    notes: '',
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const collectionData = {
      ...formData,
      grade: formData.grade ? parseFloat(formData.grade) : null,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      currentValue: parseFloat(formData.currentValue) || parseFloat(formData.purchasePrice) || 0,
    };

    await dispatch(createCollection(collectionData));
    navigate('/collection');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Comic
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Issue Number"
                name="issueNumber"
                value={formData.issueNumber}
                onChange={onChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={formData.publisher}
                onChange={onChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Variant"
                name="variant"
                value={formData.variant}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publication Date"
                name="publicationDate"
                type="date"
                value={formData.publicationDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Condition"
                name="condition"
                value={formData.condition}
                onChange={onChange}
              >
                {conditions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Grading Company"
                name="gradingCompany"
                value={formData.gradingCompany}
                onChange={onChange}
              >
                {gradingCompanies.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grade (if graded)"
                name="grade"
                type="number"
                value={formData.grade}
                onChange={onChange}
                inputProps={{ min: 0.5, max: 10, step: 0.5 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={onChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Value"
                name="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={onChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={onChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
              >
                Add to Collection
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddComic;
