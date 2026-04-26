import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import OpenInNewIcon   from '@mui/icons-material/OpenInNew';

export default function WikiTrivia({ movieTitle }) {
  const [data, setData] = useState(null); // null=loading, false=not found, object=found

  useEffect(() => {
    if (!movieTitle) return;
    setData(null);

    fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(movieTitle)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (d.type === 'disambiguation' || !d.extract || d.extract.length < 80) {
          throw new Error('not useful');
        }
        setData({
          extract:   d.extract.length > 750 ? d.extract.slice(0, 750) + '…' : d.extract,
          wikiUrl:   d.content_urls?.desktop?.page,
          thumbnail: d.thumbnail?.source,
        });
      })
      .catch(() => setData(false));
  }, [movieTitle]);

  if (!data) return null;

  return (
    <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <AutoStoriesIcon sx={{ color: '#FFC107', fontSize: 17 }} />
          <Typography className="section-title" sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
            En Wikipedia
          </Typography>
        </Box>
        {data.wikiUrl && (
          <Box
            component="a" href={data.wikiUrl} target="_blank" rel="noopener noreferrer"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.35,
              color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem',
              textDecoration: 'none', transition: 'color 0.2s',
              '&:hover': { color: '#FFC107' },
            }}
          >
            Leer más <OpenInNewIcon sx={{ fontSize: 11 }} />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {data.thumbnail && (
          <Box
            component="img" src={data.thumbnail} alt={movieTitle}
            sx={{
              width: 88, height: 110, objectFit: 'cover', borderRadius: '10px',
              flexShrink: 0, display: { xs: 'none', sm: 'block' },
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          />
        )}
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          {data.extract}
        </Typography>
      </Box>
    </Box>
  );
}
