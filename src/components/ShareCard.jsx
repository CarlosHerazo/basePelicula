import React, { useState } from 'react';
import { Box, Typography, Modal, Backdrop, IconButton, Tooltip } from '@mui/material';
import CloseIcon          from '@mui/icons-material/Close';
import IosShareIcon       from '@mui/icons-material/IosShare';
import ContentCopyIcon    from '@mui/icons-material/ContentCopy';
import CheckIcon          from '@mui/icons-material/Check';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

export default function ShareCard({ open, onClose, movie }) {
  const [copied, setCopied] = useState(false);

  if (!movie) return null;

  const shareUrl  = window.location.href;
  const canShare  = Boolean(navigator.share);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: movie.title,
        text:  `${movie.title} (${movie.release_date?.slice(0, 4)}) — ★ ${movie.vote_average?.toFixed(1)} · Mírala en CineBase`,
        url:   shareUrl,
      });
    } catch { /* cancelled */ }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const score      = movie.vote_average ?? 0;
  const scoreColor = score >= 7.5 ? '#4CAF50' : score >= 6 ? '#FFC107' : '#E53935';

  return (
    <Modal
      open={open} onClose={onClose}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300, sx: { bgcolor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' } } }}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Box sx={{ outline: 'none', animation: 'fadeUp 0.35s var(--ease-spring) both' }}>

        {/* Close */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff' } }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* CARD — screenshot-able area */}
        <Box sx={{
          width: { xs: 320, sm: 440 },
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Backdrop blurred */}
          {movie.backdrop_path && (
            <Box component="img"
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px) brightness(0.35)', transform: 'scale(1.08)' }}
            />
          )}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(13,13,13,0.85) 100%)' }} />

          {/* Content */}
          <Box sx={{ position: 'relative', p: { xs: 2.5, sm: 3.5 }, display: 'flex', gap: 2.5 }}>
            {/* Poster */}
            {movie.poster_path && (
              <Box component="img"
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                sx={{ width: 100, borderRadius: '12px', flexShrink: 0, boxShadow: '0 12px 36px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            )}

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.15, color: '#fff' }}>
                {movie.title}
              </Typography>
              {movie.tagline && (
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{movie.tagline}"
                </Typography>
              )}

              {/* Score */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Box sx={{
                  bgcolor: scoreColor, color: '#000',
                  fontWeight: 900, fontSize: '0.85rem',
                  px: 1.2, py: 0.25, borderRadius: '6px',
                }}>
                  ★ {score.toFixed(1)}
                </Box>
                {movie.release_date && (
                  <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                    {movie.release_date.slice(0, 4)}
                  </Typography>
                )}
                {movie.runtime > 0 && (
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Typography>
                )}
              </Box>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {movie.genres.slice(0, 3).map(g => (
                    <Box key={g.id} sx={{
                      px: 0.9, py: 0.2, borderRadius: '4px', fontSize: '0.62rem', fontWeight: 700,
                      bgcolor: 'rgba(255,193,7,0.12)', color: '#FFC107', border: '1px solid rgba(255,193,7,0.3)',
                    }}>
                      {g.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{
            position: 'relative', px: 3.5, py: 1.2,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', fontWeight: 700 }}>
              CINEBASE · powered by TMDB
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              {[1,2,3].map(i => (
                <Box key={i} sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: i === 2 ? '#FFC107' : 'rgba(255,193,7,0.3)' }} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Screenshot hint */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, justifyContent: 'center', mt: 1.5 }}>
          <CameraAltOutlinedIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.22)' }} />
          <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)' }}>
            Presiona y mantén la tarjeta para guardarla
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2 }}>
          {canShare && (
            <Box
              onClick={handleNativeShare}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.7,
                px: 2.5, py: 1, borderRadius: '10px', cursor: 'pointer',
                bgcolor: '#FFC107', color: '#000', fontWeight: 700, fontSize: '0.8rem',
                transition: 'transform 0.18s', '&:hover': { transform: 'scale(1.04)' },
              }}
            >
              <IosShareIcon sx={{ fontSize: 16 }} /> Compartir
            </Box>
          )}
          <Box
            onClick={handleCopy}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.7,
              px: 2.5, py: 1, borderRadius: '10px', cursor: 'pointer',
              bgcolor: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600, fontSize: '0.8rem',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.18s', '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
            }}
          >
            {copied ? <CheckIcon sx={{ fontSize: 16, color: '#4CAF50' }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
            {copied ? 'Copiado' : 'Copiar enlace'}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
