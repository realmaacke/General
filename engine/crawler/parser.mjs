"use strict";
import { load } from "cheerio";

import { grabHeadlines, grabMainContent } from "./filter.mjs";

import { loadSettings, loadFilters } from "./settings.mjs";

const settings = loadSettings();

export function parse(html, baseUrl) {
    const filter = loadFilters();
    const content = load(html);
    const links = [];

    content(filter.url.excludeAttributes.join(", ")).remove();
    
    const anchors = [];

    content("a[href]").each((_, element) => {
        const href = content(element).attr("href");
        const anchorText = content(element).text() || "";

        if (!href){
            return;
        }

        try {
            let absolutePath = new URL(href, baseUrl).href;

            if (absolutePath.includes("/url?")) {
                const u = new URL(absolutePath);
                absolutePath = u.searchParams.get("q") || absolutePath;
            }

            links.push(absolutePath);

            anchors.push({
                url: absolutePath,
                text: anchorText
            });

        } catch {
            console.error("Could not parse link: ", href);
        }
    });

    const title = content("title").text() || "";
    const text = grabMainContent(content) || "";

    return {links, anchors, title, text};
}