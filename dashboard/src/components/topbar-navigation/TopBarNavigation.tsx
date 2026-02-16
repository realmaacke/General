"use strict";

"use strict";
import {
    LayoutDashboard,
    Github
} from "lucide-react";

import "./TopBarNavigation.css";

export default function TopBarNavigation({
}) {
    return (

        <ul className="top-navigation">
            <li>
                <a href="/dashboard">
                    <LayoutDashboard /><span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="https://github.com/realmaacke/General">
                    <Github /> <span>Github</span>
                </a>
            </li>

        </ul>
    );
}