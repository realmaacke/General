import "./Metrics.css";
import type { Metrics as MetricsType } from "../../types/metrics";

interface props {
    data: MetricsType
}

export default function Metrics(data: props) {
    return (
        <>
            <p>{data.data.cpu.usage}%</p>
        </>
    );
}