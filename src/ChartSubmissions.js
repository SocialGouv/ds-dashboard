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

const dateFormat = str => format(new Date(str), "MMM YY", { locale: frLocale });

const dateSort = (a, b) => {
  if (a.month < b.month) return -1;
  if (a.month > b.month) return 1;
  return 0;
};

const getChartData = data => {
  if (data) {
    const rows = Object.keys(data.monthly).reduce(
      (months, month) => [
        ...months,
        {
          month,
          name: dateFormat(month),
          closed: data.monthly[month].status.closed.count,
          total: data.monthly[month].count
        }
      ],
      []
    );
    rows.sort(dateSort);
    return rows;
  }
  return [];
};

const ChartSubmissions = ({ classes, data }) => (
  <Paper className={classes.root} elevation={1}>
    <Typography variant="subtitle1" component="h3">
      Dossiers déposés et acceptés par mois
    </Typography>
    <br />
    <br />

    <ResponsiveContainer height={400}>
      <BarChart data={getChartData(data)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontFamily: "sans-serif" }} />
        <YAxis tick={{ fontFamily: "sans-serif" }} />
        <Tooltip wrapperStyle={{ fontFamily: "sans-serif" }} />
        <Legend wrapperStyle={{ paddingTop: 20, fontFamily: "sans-serif" }} />
        <Bar dataKey="total" fill="#0053b3" name="Dossiers déposés" />
        <Bar dataKey="closed" fill="#003b80" name="Dossiers acceptés" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default withStyles(styles)(ChartSubmissions);
