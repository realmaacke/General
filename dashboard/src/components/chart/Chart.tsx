import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartArray {
  data: Array<ChartData>
}

interface ChartData {
  name: string,
  current: number,
  max: number
};

export default function Chart({ data }: ChartArray) {
  const normalizeData = data.map(item => ({
    ...item,
    percent: Math.floor((item.current / item.max) * 100)
  }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart
        data={normalizeData}
        barCategoryGap="80%"
        barGap={12}
      >
        <XAxis
          dataKey="name"
          interval={0}
          textAnchor="end"
        />
        <YAxis domain={[0, 100]} />
        <Tooltip />

        <Bar dataKey="percent" stackId="a" fill="#0f172a" isAnimationActive={false} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
