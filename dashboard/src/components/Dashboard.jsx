import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/dashboard.css";
import {
  Tv, Database, Ruler, LayoutDashboard,
  Server, Monitor, Settings, User,
  Mail, Upload, Container, FileDown
} from "lucide-react"; // optional icons

function generatePath(sub, ssl = true, ending = "") {
  if (ssl) {
    return `https://${sub}.petterssonhome.se${ending}`;
  }
  return `http://${sub}.petterssonhome.se${ending}`;
}

const Dashboard = () => {
  const basePath = ".petterssonhome.se"
  const cards = [
    { status: "(Development)", title: "TV", icon: <Tv size={40} />, url: generatePath("tv") },
    { status: "(Sandbox)", title: "Database", icon: <Database size={40} />, url: generatePath("db") },
    { status: "(Development)", title: "API", icon: <Server size={40} />, url: generatePath("api") },
    { status: "", title: "Grafana", icon: <Monitor size={40} />, url: generatePath("grafana", true, "/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m") },
    { status: "", title: "Portainer", icon: <Container size={40} />, url: generatePath("docker") },
    { status: "", title: "SonarCube", icon: <Ruler size={40} />, url: generatePath("sonarqube", false) },
    { status: "", title: "Overseerr", icon: <FileDown size={40} />, url: generatePath("torrent") },
    { status: "", title: "<Comming soon>", icon: <Mail size={40} />, url: "#" },
    { status: "(Development)", title: "CDN", icon: <Upload size={40} />, url: generatePath("cdn") },
  ];

  const handleClick = (url) => {
    window.location.href = url;
  };

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">General</h1>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {cards.map((card, index) => (
          <div key={index} className="col">
            <div
              className="dashboard-card text-center p-4 rounded shadow-sm h-100"
              onClick={() => handleClick(card.url)}
              role="button"
            >
              <div className="mb-3 text-primary">{card.icon}</div>
              <h5 className="fw-semibold mb-2">{card.title} {card.status}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
