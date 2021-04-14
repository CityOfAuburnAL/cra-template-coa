import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { useEffect, useState } from 'react';
import { useStateStore } from '../../services/State';
import { userLogout } from '../../services/coa-authorization';
import { Menu, MenuItem, AppBar, Toolbar, IconButton, Hidden, SwipeableDrawer, Drawer, LinearProgress } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router';
import { usePromiseTracker } from 'react-promise-tracker';
import usePushNotification from '../PushNotificationSubscriber';
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { useStorageState } from 'react-storage-hooks';

//Layout styles
const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  navIconHideSm: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  navIconHideLg: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transitionDuration: '0ms !important',
  },
  drawerDocked: {
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  list: {
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    minWidth: 0, // So the Typography noWrap works
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      marginLeft: -drawerWidth,
    },
  },
}));

function AppSkeleton({ pages, children }) {
  const history = useHistory(); // TODO - look into NavLink or useLocation?
  const classes = useStyles();
  /* Mobile Phone drawer controller (swipe) */
  const [drawer, setDrawer] = useState(false);
  /* Desktop drawer, toggle preference */
  const [persistDrawer, setPersistDrawer] = useStorageState(localStorage, 'persist-drawer', false);
  const [currentPath, setCurrentPath] = useState(history.location.pathname.replace(/\/$/, '')); //we use currentPath === page.path in a number of places, this breaks when a trailing slash is present
  const [accountIcon, setAccountIcon] = useState(null);
  const menuList = pages || [];
  const [user] = useStateStore('userProfile');// userAuthStatus("pressrelease");
  const [pushNotifications, togglePushNotifications] = usePushNotification();
  const { promiseInProgress } = usePromiseTracker();
  const [updatedSWVersion, setUupdatedSWVersion] = useState(false);

  serviceWorkerRegistration.register({
    onUpdate: setUupdatedSWVersion
  });

  const handleSWRegistrationUpdate = () => {
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
    updatedSWVersion.waiting.postMessage({type: 'SKIP_WAITING'})
  }
  
  useEffect(() => {
    history.listen(() => {
      setDrawer(false);
      setCurrentPath(history.location.pathname.replace(/\/$/, ''));
    });
    
    //can't get current state, only initial state
    document.body.addEventListener('keyup', (event) => {
      if (event.code === "Escape") {
        setPersistDrawer(!window.globalPersistDrawer)
      }
    });
  }, [history, setPersistDrawer]);
  
  useEffect(() => {
    window.globalPersistDrawer = persistDrawer;
  }, [persistDrawer]);

  const handleListItemClick = (event, index, route) => {
    //history.push(`${process.env.PUBLIC_URL}${route}`);
    history.push(route);
  };

  /** Side Navigation */
  const drawerContents = (
    <List component="nav">
      {menuList.map((item, i) => (
        <ListItem key={i} button selected={currentPath === item.path} onClick={event => handleListItemClick(event, i, item.path)}>{item.name}</ListItem>
      ))}
    </List>
  );

  return (
    <React.Fragment>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={() => { setDrawer(!drawer)}} className={`${classes.menuButton} ${classes.navIconHideLg}`} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => { setPersistDrawer(!persistDrawer)}} className={`${classes.menuButton} ${classes.navIconHideSm}`} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <h1 className={classes.grow}>City of Auburn &mdash; {`${pages.find(e => e.path === currentPath)?.name || 'cra-template-coa'}`}</h1>
          <div>
            {updatedSWVersion && (
              <IconButton title="New Version Available" onClick={handleSWRegistrationUpdate} style={{color: '#FFF'}}>
                <SystemUpdateAltIcon></SystemUpdateAltIcon>
              </IconButton>
            )}
            <IconButton
              aria-owns={accountIcon ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={(event) => { setAccountIcon(event.currentTarget)}}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={accountIcon}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(accountIcon)}
              onClose={() => { setAccountIcon(null)}}
            >
              <MenuItem onClick={() => { setAccountIcon(null)}}>{user.email}</MenuItem>
              <MenuItem title="Experimental" onClick={() => { togglePushNotifications(); setAccountIcon(null) }}>Toggle Push Notifications: {(pushNotifications ? 'Off' : 'On')}</MenuItem>
              <MenuItem onClick={userLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
        {promiseInProgress && (<LinearProgress />)}
      </AppBar>
      <Hidden mdUp>
        <SwipeableDrawer
          open={drawer}
          onClose={() => { setDrawer(!drawer)}}
          onOpen={() => { setDrawer(!drawer)}}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.list}>
            {drawerContents}
          </div>
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="persistent"
          anchor="left"
          open={persistDrawer}
          classes={{
            paper: classes.drawerPaper,
            docked: classes.drawerDocked,
          }}
        >
          <div className={classes.list}>
            <div className={classes.toolbar} />
            {drawerContents}
          </div>
        </Drawer>
      </Hidden>
      <main className={`${classes.content} ${(!persistDrawer && classes.contentShift)}`}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </React.Fragment>
  );
}

export default AppSkeleton;
