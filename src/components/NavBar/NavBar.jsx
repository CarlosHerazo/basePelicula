import React, { useState, useEffect } from 'react'
import NavListDrawer from './NavListDrawer'
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from "@mui/icons-material/Menu"
import { NavLink } from "react-router-dom"

function NavBar({ navList, isDetail }) {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: solid ? 'rgba(13,13,13,0.92)' : 'transparent',
          backdropFilter:   solid ? 'blur(18px)'          : 'none',
          WebkitBackdropFilter: solid ? 'blur(18px)'      : 'none',
          boxShadow: solid ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
          transition: 'background-color 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => setOpen(true)}
            sx={{ display: { sm: 'none', xs: 'flex' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h5"
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': { opacity: 0.85 },
              transition: 'opacity 0.2s',
            }}
          >
            PeliHz
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
            {navList.map(item => (
              <Button
                key={item.title}
                component={NavLink}
                to={item.path}
                sx={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.4px',
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.75,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    background: '#FFC107',
                    borderRadius: '1px',
                    transition: 'width 0.22s ease',
                  },
                  '&:hover': {
                    color: '#FFC107',
                    backgroundColor: 'transparent',
                    '&::after': { width: '55%' },
                  },
                  '&.active': {
                    color: '#FFC107',
                    '&::after': { width: '55%' },
                  },
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        anchor="left"
        onClose={() => setOpen(false)}
        sx={{ display: { xs: 'flex', sm: 'none' } }}
      >
        <NavListDrawer navList={navList} NavLink={NavLink} setOpen={setOpen} />
      </Drawer>
    </>
  )
}

export default NavBar
