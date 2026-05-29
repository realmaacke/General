import { Tv, Film, Layers, ListChecks, Wrench, Popcorn, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import "../../public/dashboard.css";
import "../util";

import Modal from "../components/Modal";
import util from "../util";
import send from "../send";

function Dashboard() {
  const navigate = useNavigate();

  const [playlistValues, setPlaylistValuesValuesValues] = useState({});


  const gridItems = [
    { icon: <Tv className="w-8 h-8 text-blue-600" />, label: "Channels", path: "/channels" },
    { icon: <Film className="w-8 h-8 text-blue-600" />, label: "Movies", path: "/movies" },
    { icon: <Layers className="w-8 h-8 text-blue-600" />, label: "Series", path: "/series" },
  ];

  const bigButton = {
    icon: <Undo2 size={36} />,
    label: "Return to dashboard",
    color: "linear-gradient(135deg,#f43f5e,#fb7185)",
  };

  const handleReturnButton = () => {
    window.location.href = "https://petterssonhome.se";
  };

  const handleNewPlaylist = useCallback(async (values) => {
    const file = values.Upload;
    const text = await file.text();

    const playlist = {
      file: JSON.stringify(text),
      url: values.M3U_URL ?? "",
      portal: values.Portal ?? "",
      username: values.Username ?? "",
      password: values.Password ?? ""
    };

    let res = await send.newPlaylist(playlist);

    console.log(res)
  }, [playlistValues]);


  return (
    <>
      <div className="dashboard-bg d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
        <div className="container" style={{ maxWidth: "700px" }}>
          <h1 className="fw-bold text-white display-5 text-glow mb-5 text-center">
            Media Dashboard
          </h1>

          <div className="grid-layout mb-4">
            {gridItems.map((item) => (
              <div
                key={item.label}
                className="media-card p-4 text-center"
                onClick={() => navigate(item.path)}
              >
                <div className="media-icon mb-2">{item.icon}</div>
                <h5 className="fw-semibold mb-0">{item.label}</h5>
              </div>
            ))}

            <Modal
              buttonName="M3U Playlist"
              setReturnValues={setPlaylistValuesValuesValues}
              callback={handleNewPlaylist}
              innerTitle="Manage M3U Playlists"
              fields={[
                {
                  name: "Upload",
                  label: "Upload M3U File",
                  type: "file",
                  accept: ".m3u",
                },
                {
                  name: "M3U_URL",
                  label: "URL for M3U File",
                  type: "text",
                  placeholder: "Enter Playlist url"
                },
                {
                  name: "Portal",
                  label: "Portal url",
                  type: "text",
                  placeholder: "Enter portal url"
                },
                {
                  name: "Username",
                  label: "Username",
                  type: "text",
                  placeholder: "Enter Username"
                },
                {
                  name: "Password",
                  label: "Password",
                  type: "text",
                  placeholder: "Enter Password"
                }
              ]}
            />

            {/* Full-width Fix button */}
            <div
              className="media-card big-card p-4 text-center"
              onClick={handleReturnButton}
            >
              <div className="media-icon mb-2">{bigButton.icon}</div>
              <h5 className="fw-semibold mb-0">{bigButton.label}</h5>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;