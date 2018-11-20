import React from "react";
import { format } from "date-fns";
import frLocale from "date-fns/locale/fr";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

//import {BarChart, CartesianGrid, XAxis, YAxis,Tooltip,Legend,Bar} from

import BarChart from "recharts/lib/chart/BarChart";

import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Legend from "recharts/lib/component/Legend";
import Tooltip from "recharts/lib/component/Tooltip";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";

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

    <ResponsiveContainer height={400}>
      <BarChart data={getChartData(data)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: 20 }} />
        <Bar dataKey="total" fill="#8884d8" name="Dossiers déposés" />
        <Bar dataKey="closed" fill="#82ca9d" name="Dossiers acceptés" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default withStyles(styles)(ChartSubmissions);
