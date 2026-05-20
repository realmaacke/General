import "../../assets/base.css";
import "./Information.css";

import { Cpu, HardDrive } from "lucide-react";

interface usageBody {
    cpu: cpu_interface,
    disk: disk_interface[]
}

interface cpu_interface {
    name: string,
    cores: number,
    clock: string,
    usage: number
}

interface disk_interface {
    partition: string,
    clock: string,
    size: string,
    inUse: string
}


export function Information(parameter: usageBody) {

    const parseGB = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

    return (
        <>
            <div className="home-information-item">
                <div className="flex-row">
                    <span className="icon-span">
                        <Cpu
                            size={64}
                        />
                    </span>
                    <div className="information-item-content">
                        <p>CPU: {parameter.cpu.name}</p>
                        <p>CORES: {parameter.cpu.cores}</p>
                        <p>CLOCK: {parameter.cpu.clock}</p>
                        <p>USAGE: {parameter.cpu.usage}%</p>
                    </div>

                </div>
            </div>
            {parameter.disk.map((item, index) => (

                <div className="home-information-item" key={index}>
                    <div className="flex-row">
                        <span className="icon-span">
                            <HardDrive
                                size={64}
                            />
                        </span>
                        <div className="information-item-content">
                            <p>PARTITION: {item.partition}</p>
                            <p>CLOCK: {item.clock}</p>
                            <p>SIZE: {item.size}</p>
                            <p>REMAINING: {parseGB(item.size) - parseGB(item.inUse)}GB</p>
                        </div>
                    </div>
                </div>

            ))}
        </>
    );
}