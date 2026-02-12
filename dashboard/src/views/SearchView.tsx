"use strict";
import { useEffect, useState } from "react";

import "../assets/base.css";
import "../assets/search.css";

import { searchModel } from "../models/search";

import GeneralIcon from "../assets/General_icon.png";



export default function SearchView() {
    const [query, setQuery] = useState("");
    const [searchData, setSearchData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {

        if (!query.trim()) return;

        setLoading(true);

        try {
            const data = await searchModel.query(query);
            console.log(data);
            setSearchData(data.out || []);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    const navigateToWebsite = (site: string) => {
        window.location.href = site;
    }

    if (loading) return <div>Loading…</div>;
    return (
        <div className="searchContainer">
            <div className="searchBody">

                <a href="/">
                    <img src={GeneralIcon} className="searchLogo" />
                </a>

                <form className="searchForm" onSubmit={handleSearch}>
                    <input
                        className="searchInput"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onSubmit={handleSearch}
                        placeholder="Search the web..."
                    />
                    <button
                        className="searchButton"
                        type="button"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </form>

                <p className="credit">
                    Made by Marcus Pettersson
                </p>
            </div>

            {/* RESULTS */}
            <div className="searchResult">
                {loading && <div className="loading">Loading…</div>}

                {searchData.map((item, i) => (
                    <div className="searchItem" key={i}>
                        <a onClick={() => { navigateToWebsite(item.url) }} target="_blank" className="searchItemLink">
                            {item.title || item.url}
                        </a>

                        <p className="searchSnippet">
                            {item.snippet}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
};
