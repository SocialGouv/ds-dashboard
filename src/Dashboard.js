import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import classNames from "classnames";
import CountUp from "react-countup";
import memoize from "memoizee";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import BarChartIcon from "@material-ui/icons/BarChart";
import LaunchIcon from "@material-ui/icons/Launch";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";

import fetchDs from "./fetchDs";
import AsyncFetch from "./AsyncFetch";
import ChartSubmissions from "./ChartSubmissions";
import ChartDuration from "./ChartDuration";
import ChartStatuts from "./ChartStatuts";

const memoFetch = memoize(url => fetch(url).then(r => r.json()), {
  promise: true
});

function _typeof(obj) {
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol
    ? "symbol"
    : typeof obj;
}

function mergeByKey(obj1, obj2, cb) {
  var obj = {};
  Object.keys(obj1).forEach(function(key) {
    if (!obj1[key]) {
      obj[key] = 0;
    } else if (_typeof(obj1[key]) === "object") {
      obj[key] = mergeByKey(obj1[key], (obj2 && obj2[key]) || {}, cb);
    } else if (cb && typeof cb === "function") {
      obj[key] = cb(obj1[key], obj2[key]);
    } else {
      obj[key] = obj1[key] + ((obj2 && obj2[key]) || 0);
    }
  });
  return obj;
}

const drawerWidth = 240;

//Azd
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
    marginLeft: 12,
    marginRight: 12
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

const CardNumber = ({ title, value }) => (
  <Grid item xs={4}>
    <Card>
      <CardContent style={{ textAlign: "center" }}>
        <Typography color="textPrimary" gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <Typography variant="h4">
          <CountUp end={value} />
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

//const sum = arr => arr.reduce((s, c) => s + c, 0);

const fetchAllData = async urls => {
  // sum up multiple results and make averages
  const result = await Promise.all(urls.map(url => fetchDs(url)));

  const summed = result.slice(1).reduce((a, c) => mergeByKey(a, c), result[0]);

  summed.duration /= result.length;
  summed.monthly = Object.keys(summed.monthly).reduce((a, c) => {
    return {
      ...a,
      [c]: {
        ...summed.monthly[c],
        duration: summed.monthly[c].duration / result.length
      }
    };
  }, {});
  return summed;
};

const fetchData = urls =>
  urls.length === 1 ? fetchDs(urls[0]) : fetchAllData(urls);

const Stats = ({ title, data }) => (
  <AsyncFetch
    autoFetch={true}
    fetch={() => fetchData(data)}
    render={({ status, result }) =>
      (result &&
        result.status && (
          <div>
            <Typography color="textPrimary" gutterBottom variant="h3">
              {title}
            </Typography>
            <Grid container spacing={24}>
              <CardNumber
                title="Nombre de dossiers déposés"
                value={result.count}
              />
              <CardNumber
                title="Nombre de dossiers acceptés"
                value={result.status.closed && result.status.closed.count}
              />
              <CardNumber
                title="Temps de traitement moyen en jours"
                value={parseInt(result.duration)}
              />
            </Grid>
            <br />
            <br />
            <ChartSubmissions data={result} />
            <br />
            <br />
            <ChartDuration data={result} />
            <br />
            <br />
            <ChartStatuts data={result} />
          </div>
        )) || <CircularProgress />
    }
  />
);

class _Dashboard extends React.Component {
  state = {
    open: true
  };

  render() {
    const { config, classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {config.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
        >
          <div className={classes.toolbarIcon} />
          <Divider />
          <List>
            {config.groups.map(group => (
              <Link to={group.url} key={group.url}>
                <ListItem button>
                  <ListItemIcon style={{ marginRight: 8 }}>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText
                    style={{ paddingLeft: 0 }}
                    primary={group.title}
                  />
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
              >
                <ListItem button>
                  <ListItemIcon style={{ marginRight: 8 }}>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText
                    style={{ paddingLeft: 0 }}
                    primary={link.title}
                  />
                </ListItem>
              </a>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {config.groups.map(group => (
            <Route
              exact
              key={group.url}
              path={group.url}
              render={() => <Stats {...group} />}
            />
          ))}
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

const Dashboard = props => (
  <AsyncFetch
    autoFetch={true}
    fetch={() => memoFetch("/config.json")}
    render={({ status, result, fetch }) => {
      if (status === "error") {
        return <LoadError onRetryClick={fetch} />;
      }
      return (
        (status === "success" &&
          result && <_Dashboard {...props} config={result} />) || (
          <CircularProgress />
        )
      );
    }}
  />
);

export default withStyles(styles)(Dashboard);
