import React from "react";
import { PieChart, Pie, Cell } from "recharts";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";

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
  return (
    <Paper className={classes.root} elevation={1}>
      <Typography variant="subtitle1" component="h3">
        Répartition des dossiers par statut
      </Typography>
      <br />
      <br />
      <ResponsiveContainer height={400}>
        <PieChart>
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
      </ResponsiveContainer>
    </Paper>
  );
};

export default withStyles(styles)(ChartStatuts);
