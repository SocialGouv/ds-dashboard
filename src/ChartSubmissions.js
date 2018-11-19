import React from "react";
import Line from "recharts/lib/cartesian/Line";
import { format } from "date-fns";
import frLocale from "date-fns/locale/fr";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

import SimpleLineChart from "./SimpleLineChart";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const dateFormat = str =>
  format(new Date(str), "MMMM YYYY", { locale: frLocale });

const getChartData = data => {
  if (data) {
    return Object.keys(data.monthly)
      .filter((a, i, l) => i < l.length - 1)
      .reduce(
        (months, month) => [
          ...months,
          {
            name: dateFormat(month),
            closed: data.monthly[month].status.closed.count,
            total: data.monthly[month].count
          }
        ],
        []
      );
  }
  return [];
};

const ChartSubmissions = ({ classes, data }) => (
  <Paper className={classes.root} elevation={1}>
    <Typography variant="subtitle1" component="h3">
      Dossier déposés et acceptés par mois
    </Typography>
    <br />
    <br />
    <SimpleLineChart data={getChartData(data)}>
      <Line
        name="Dossiers déposés"
        type="monotone"
        dataKey="total"
        stroke="#8884d8"
      />
      <Line
        name="Dossiers acceptés"
        type="monotone"
        dataKey="closed"
        stroke="#82ca9d"
        activeDot={{ r: 8 }}
      />
    </SimpleLineChart>
  </Paper>
);

export default withStyles(styles)(ChartSubmissions);
