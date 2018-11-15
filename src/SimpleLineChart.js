import React from "react";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Legend from "recharts/lib/component/Legend";
import LineChart from "recharts/lib/chart/LineChart";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import Tooltip from "recharts/lib/component/Tooltip";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";

function SimpleLineChart({ data = [], children }) {
  return (
    // 99% per https://github.com/recharts/recharts/issues/172
    <ResponsiveContainer width="99%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: 20 }} />
        {children}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SimpleLineChart;
