import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type NumberDomain,
} from "recharts";

interface ChartArray {
  data: Array<ChartData>
}

interface ChartData {
    name: string,
    current: number
};

const newData = [
  { name: 'A', current: 50},
  { name: 'B', current: 12}
];

const data = [
  { name: "A", blue: 40, purple: 20, teal: 15 },
  { name: "B", blue: 30, purple: 25, teal: 20 },
  { name: "C", blue: 50, purple: 15, teal: 10 },
  { name: "D", blue: 35, purple: 30, teal: 15 },
  { name: "E", blue: 25, purple: 20, teal: 10 },
];

export default function Chart({ data } : ChartArray) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />

        <Bar dataKey="blue" stackId="a" fill="#60a5fa" />
        <Bar dataKey="purple" stackId="a" fill="#a78bfa" />
        <Bar dataKey="teal" stackId="a" fill="#5eead4" />
      </BarChart>
    </ResponsiveContainer>
  );
}
