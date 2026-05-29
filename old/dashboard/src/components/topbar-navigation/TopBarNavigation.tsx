"use strict";

"use strict";
import {
    LayoutDashboard,
    Github,
} from "lucide-react";

import "./TopBarNavigation.css";
import DropDownMenu from "../menu/DropDownMenu";

export default function TopBarNavigation({
}) {
    return (
        <ul className="top-navigation">
            <div className="nav-center-group">
            <li>
                <a href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/realmaacke/General" target="_blank" rel="noopener noreferrer">
                    <Github />
                    <span>GitHub</span>
                </a>
		    </li>

            <li>
                <a href="https://github.com/realmaacke/IaC-server" target="_blank" rel="noopener noreferrer">
                    <Github />
                    <span>IaC GitHub </span>
                </a>
            </li>
            </div>

            <li className="nav-right">
                <DropDownMenu/>
            </li>
        </ul>
    );
}
