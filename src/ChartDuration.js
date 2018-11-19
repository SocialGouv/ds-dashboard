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
            total: parseInt(data.monthly[month].duration * 100) / 100
          }
        ],
        []
      );
  }
  return [];
};

const ChartDuration = ({ classes, data }) => (
  <Paper className={classes.root} elevation={1}>
    <Typography variant="subtitle1" component="h3">
      Temps de traitement par mois
    </Typography>
    <br />
    <br />
    <SimpleLineChart data={getChartData(data)}>
      <Line
        name="Temps de traitement moyen en jours"
        type="monotone"
        dataKey="total"
        stroke="#8884d8"
      />
    </SimpleLineChart>
  </Paper>
);

export default withStyles(styles)(ChartDuration);
