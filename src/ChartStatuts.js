import React from "react";
import { PieChart, Pie, Cell } from "recharts";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const COLORS = {
  closed: "#00C49F",
  initiated: "#FFBB28",
  received: "#ffa629",
  refused: "#333",
  without_continuation: "#999"
};

const LABELS = {
  closed: "Accepté",
  initiated: "En construction",
  received: "En instruction",
  refused: "Refusé",
  without_continuation: "Sans suite"
};

const getChartData = data => {
  if (data) {
    return Object.keys(data.status)
      .reduce(
        (entries, status) => [
          ...entries,
          {
            name: LABELS[status],
            color: COLORS[status],
            count: data.status[status].count
          }
        ],
        []
      )
      .filter(row => row.count > 0);
  }
  return [];
};

const renderCustomizedLabel = props =>
  `${props.payload.name} : ${props.payload.count}`;

const ChartStatuts = ({ classes, data }) => {
  const pieData = getChartData(data);
  const pieWidth =
    (typeof window !== undefined && Math.min(window.innerWidth * 0.8, 800)) ||
    800;
  return (
    <Paper className={classes.root} elevation={1}>
      <Typography variant="subtitle1" component="h3">
        Répartition des dossiers par statut
      </Typography>
      <br />
      <br />
      <PieChart width={pieWidth} height={400}>
        <Pie
          label={renderCustomizedLabel}
          data={pieData}
          dataKey="count"
          fill="#8884d8"
        >
          {pieData &&
            pieData.map((entry, index) => (
              <Cell key={entry.color} fill={entry.color} />
            ))}
        </Pie>
      </PieChart>
    </Paper>
  );
};

export default withStyles(styles)(ChartStatuts);
