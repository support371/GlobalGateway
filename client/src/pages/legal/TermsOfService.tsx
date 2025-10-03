import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';

export default function TermsOfService({ open, onClose }) {
  const [terms, setTerms] = React.useState('');

  const handleSave = () => {
    // Implement save logic here, e.g., send to an API
    console.log('Terms saved:', terms);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Terms of Service</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            Current Terms of Service
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            variant="outlined"
            placeholder="Enter terms of service here..."
            InputProps={{
              style: { backgroundColor: '#f0f0f0' },
            }}
          />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Terms of Service
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            variant="outlined"
            placeholder="Edit terms of service here..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}