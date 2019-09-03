import React from "react";
import CountUp from "react-countup";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import fetchDs from "./fetchDs";
import mergeStats from "./mergeStats";
import AsyncFetch from "./AsyncFetch";
import ChartSubmissions from "./ChartSubmissions";
import ChartDuration from "./ChartDuration";
import ChartStatuts from "./ChartStatuts";

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
  const summed = result
    .filter(r => r.count)
    .slice(1)
    .reduce((a, c) => mergeStats(a, c), result[0]);
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
      (result && result.status && (
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
              value={Math.ceil(parseFloat(result.duration))}
              suffix={
                Math.ceil(parseFloat(result.duration)) > 1 ? " jours" : " jour"
              }
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
