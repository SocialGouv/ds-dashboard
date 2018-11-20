import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import memoize from "memoizee";

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";

import {
  Button,
  CircularProgress,
  Typography,
  CssBaseline,
  Card,
  CardContent,
  CardActions
} from "@material-ui/core";

import AppBar from "./AppBar";
import Stats from "./Stats";
import AsyncFetch from "./AsyncFetch";

const memoFetch = memoize(url => fetch(url).then(r => r.json()), {
  promise: true
});

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 6,
    marginRight: 6
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  }
});

const theme = createMuiTheme({
  palette: {
    primary: { main: "#003189" }
  }
});

class _Dashboard extends React.Component {
  state = {
    drawerOpen: false
  };
  handleDrawerToggle = () => {
    this.setState(curState => ({ drawerOpen: !curState.drawerOpen }));
  };
  render() {
    const { config, classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          config={config}
          classes={classes}
          handleDrawerToggle={this.handleDrawerToggle}
          drawerOpen={this.state.drawerOpen}
        />
        <main className={classes.content}>
          <Switch>
            {config.groups.map(group => (
              <Route
                exact
                key={group.url}
                path={group.url}
                render={() => <Stats {...group} />}
              />
            ))}
            <Route render={() => <Redirect to={config.groups[0].url} />} />
          </Switch>
        </main>
      </div>
    );
  }
}

const LoadError = ({ onRetryClick }) => (
  <Card>
    <CardContent>
      <Typography component="p">Cannot load config.json</Typography>
    </CardContent>
    <CardActions>
      <Button onClick={onRetryClick} size="small">
        Retry
      </Button>
    </CardActions>
  </Card>
);

// first, load config client-side
// handle visual progress while loading
const ConfigLoader = ({ render }) => (
  <AsyncFetch
    autoFetch={true}
    fetch={() => memoFetch("/config.json")}
    render={({ status, result, fetch }) => {
      if (status === "error") {
        return <LoadError onRetryClick={fetch} />;
      }
      if (status === "success" && result) {
        return render({
          result
        });
      }
      return <CircularProgress />;
    }}
  />
);

const Dashboard = props => (
  <MuiThemeProvider theme={theme}>
    <ConfigLoader
      render={({ result }) => <_Dashboard {...props} config={result} />}
    />
  </MuiThemeProvider>
);

export default withStyles(styles)(Dashboard);
