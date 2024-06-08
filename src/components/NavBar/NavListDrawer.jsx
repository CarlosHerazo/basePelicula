import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import InboxIcon from "@mui/icons-material/Inbox"
import React from 'react'

function NavListDrawer({ navList ,NavLink,setOpen}) {

    return (
        <Box sx={{ width: 250 }}>
            <nav>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="PeliHz" />
                    </ListItem>
                </List>
            </nav>
            <Divider />
            <nav>
                <List>
                    {
                        navList.map(item => (
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    key={item.title}
                                    onClick={() => setOpen(false)}
                                >
                                <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }




                </List>
            </nav>
        </Box>
    )
}

export default NavListDrawer
