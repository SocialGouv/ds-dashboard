import React from "react";

import CountUp from "react-countup";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import fetchDs from "./fetchDs";
import AsyncFetch from "./AsyncFetch";
import ChartSubmissions from "./ChartSubmissions";
import ChartDuration from "./ChartDuration";
import ChartStatuts from "./ChartStatuts";

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

const CardNumber = ({ title, value, suffix = "" }) => (
  <Grid item xs={12} sm={6} lg={4}>
    <Card>
      <CardContent style={{ textAlign: "center" }}>
        <Typography color="textPrimary" gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <Typography variant="h4">
          <CountUp end={value} />
          {suffix}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const fetchAllData = async urls => {
  // sum up multiple results and make averages
  const result = await Promise.all(urls.map(url => fetchDs(url)));
  console.log("result", result);
  const summed = result.slice(1).reduce((a, c) => mergeByKey(a, c), result[0]);

  summed.duration /= result.length;

  // average duration on monthly data
  // TODO: better average
  summed.monthly = Object.keys(summed.monthly).reduce((a, c) => {
    return {
      ...a,
      [c]: {
        ...summed.monthly[c],
        duration: summed.monthly[c].duration / result.length || 0
      }
    };
  }, {});
  return summed;
};

// fetch a single stat or merge multiple
const fetchData = urls =>
  urls.length === 1 ? fetchDs(urls[0]) : fetchAllData(urls);

const Stats = ({ title, data }) => (
  <AsyncFetch
    autoFetch={true}
    fetch={() => fetchData(data)}
    render={({ status, result }) =>
      console.log("result2", result) ||
      (result &&
        result.status && (
          <div>
            <Typography color="textPrimary" gutterBottom variant="h5">
              {title}
            </Typography>
            <Grid container spacing={24} justify="center">
              <CardNumber
                title="Nombre de dossiers déposés"
                value={result.count}
              />
              <CardNumber
                title="Nombre de dossiers acceptés"
                value={result.status.closed && result.status.closed.count}
              />
              <CardNumber
                title="Temps de traitement moyen"
                value={parseInt(result.duration)}
                suffix={parseInt(result.duration) > 1 ? " jours" : " jour"}
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

export default Stats;
