import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function RatingCircle({ rating, color, title }) {
  const value = Math.min(rating * 10, 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      {title && (
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', textAlign: 'center' }}>
          {title}
        </Typography>
      )}
      <Box sx={{ position: 'relative', width: 56, height: 56 }}>
        {/* Background track */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={56}
          thickness={3.5}
          sx={{ position: 'absolute', color: 'rgba(255,255,255,0.08)' }}
        />
        {/* Filled arc */}
        <CircularProgress
          variant="determinate"
          value={value}
          size={56}
          thickness={3.5}
          sx={{ position: 'absolute', color }}
        />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color,
            fontWeight: 700,
            fontSize: '0.78rem',
          }}
        >
          {typeof rating === 'number' && rating > 0 ? rating.toFixed(1) : '—'}
        </Typography>
      </Box>
    </Box>
  );
}
