import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Zoom in={visible}>
      <Tooltip title="Volver arriba" placement="left">
        <Fab
          size="small"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1200,
            bgcolor: 'rgba(13,13,13,0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,193,7,0.35)',
            color: '#FFC107',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            '&:hover': {
              bgcolor: 'rgba(255,193,7,0.12)',
              borderColor: '#FFC107',
              transform: 'scale(1.08)',
            },
            transition: 'all 0.22s ease',
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
