import React from "react";
import { Link } from "react-router-dom";

import {
  Hidden,
  Divider,
  Drawer,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import {
  BarChart as BarChartIcon,
  Launch as LaunchIcon,
  Menu as MenuIcon
} from "@material-ui/icons";

const DrawerContent = ({ config, classes }) => (
  <React.Fragment>
    <List>
      {config.groups.map(group => (
        <Link to={group.url} key={group.url} style={{ textDecoration: "none" }}>
          <ListItem button>
            <ListItemIcon style={{ marginRight: 8 }}>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: 0 }} primary={group.title} />
          </ListItem>
        </Link>
      ))}
    </List>
    <Divider />
    <List>
      {config.links.map(link => (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          key={link.url}
          style={{ textDecoration: "none" }}
        >
          <ListItem button>
            <ListItemIcon style={{ marginRight: 8 }}>
              <LaunchIcon />
            </ListItemIcon>
            <ListItemText style={{ paddingLeft: 0 }} primary={link.title} />
          </ListItem>
        </a>
      ))}
    </List>
  </React.Fragment>
);

const AppBar = ({ config, classes, handleDrawerToggle, drawerOpen }) => (
  <React.Fragment>
    <div style={{ alignItems: "start" }}>
      <Hidden smUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
    </div>
    <Hidden smUp>
      <Drawer
        variant="temporary"
        classes={{
          paper: classes.drawerPaper
        }}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
      >
        <DrawerContent config={config} classes={classes} />
      </Drawer>
    </Hidden>
    <Hidden xsDown>
      <Drawer
        classes={{
          paper: classes.drawerPaper
        }}
        variant="permanent"
        open
      >
        <DrawerContent config={config} classes={classes} />
      </Drawer>
    </Hidden>
  </React.Fragment>
);

export default AppBar;
