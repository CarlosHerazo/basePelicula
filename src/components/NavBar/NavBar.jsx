import React, { useState, useEffect } from 'react'
import NavListDrawer from './NavListDrawer'
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from "@mui/icons-material/Menu"
import { NavLink } from "react-router-dom"
import MovieIcon from '@mui/icons-material/Movie';

function NavBar({ navList }) {
    // enlaces

    const [open, setOpen] = useState(false)

    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 100) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: scrolled ? 'primary.main' : 'transparent', transition: 'background-color 0.3s ease-in-out', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        size="large"
                        onClick={() => setOpen(true)}
                        sx={{ display: { sm: "none", xs: "flex" } }}

                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        component={NavLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "inherit",
                            '&:hover': {
                                textDecoration: "underline",
                            },
                            '&.active': {
                                fontWeight: "bold",
                            },
                        }}
                    >
                        PeliHz
                    </Typography>

                    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                        {
                            navList.map(item => (
                                <Button color="inherit" key={item.title} component={NavLink} to={item.path}>{item.title}</Button>
                            ))
                        }
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                open={open}
                anchor="left"
                onClose={() => setOpen(false)}
                sx={{ display: { xs: "flex", sm: "none" } }}
            >
                <NavListDrawer navList={navList} NavLink={NavLink} setOpen={setOpen} />
            </Drawer>

        </>
    )
}

export default NavBar
