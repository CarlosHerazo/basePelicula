import React from 'react';
import { Box } from '@mui/material';

export default function SkeletonCard({ count = 12 }) {
  return (
    <div className="movie-card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          className="skeleton"
          sx={{
            aspectRatio: '2 / 3',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        />
      ))}
    </div>
  );
}
