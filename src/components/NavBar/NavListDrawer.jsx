import React from 'react'
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'

function NavListDrawer({ navList, NavLink, setOpen }) {
  return (
    <Box sx={{ width: 260, pt: 2 }}>
      {/* Logo in drawer */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PeliHz
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 1 }} />

      <List disablePadding>
        {navList.map(item => (
          <ListItem disablePadding key={item.title}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => setOpen(false)}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255,193,7,0.07)',
                  '& .MuiListItemText-primary': { color: '#FFC107' },
                },
                '&.active': {
                  backgroundColor: 'rgba(255,193,7,0.1)',
                  borderLeft: '3px solid #FFC107',
                  '& .MuiListItemText-primary': { color: '#FFC107', fontWeight: 700 },
                },
                transition: 'background-color 0.2s',
              }}
            >
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NavListDrawer
