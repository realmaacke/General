"use strict";
import { load } from "cheerio";
import { loadFilters } from "../util.js";
;
export class Parser {
    filterObj = null;
    constructor() {
        this.filterObj = loadFilters();
    }
    assertInitialized() {
        if (!this.filterObj)
            throw new Error("[class]: Parser, filter not initialized");
    }
    skipTypes(rawUrl) {
        this.assertInitialized();
        let url;
        try {
            url = new URL(rawUrl);
        }
        catch {
            return true;
        }
        const pathName = url.pathname.toLowerCase();
        if (this.filterObj.url.excludeExtensions.some(ext => pathName.endsWith(ext)))
            return true;
        if (this.filterObj.url.excludePathContains.some(ext => pathName.includes(ext)))
            return true;
        for (const param of url.searchParams.keys()) {
            if (this.filterObj.url.excludeQueryParams.includes(param.toLowerCase()))
                return true;
        }
        return false;
    }
    parse(html, baseUrl) {
        this.assertInitialized();
        const content = load(html);
        const links = [];
        const anchors = [];
        content(this.filterObj?.url.excludeAttributes.join(", ")).remove();
        content("a[href]").each((_, element) => {
            const href = content(element).attr("href");
            const anchorText = content(element).text() || "";
            if (!href)
                return;
            try {
                let absolutePath = new URL(href, baseUrl).href;
                if (absolutePath.includes("/url?")) {
                    const u = new URL(absolutePath);
                    absolutePath = u.searchParams.get("q") || absolutePath;
                }
                links.push(absolutePath);
                let newAnchor = {
                    url: absolutePath,
                    text: anchorText
                };
                anchors.push(newAnchor);
            }
            catch (error) {
                console.error("Could not parse link: ", href);
            }
        });
        const title = content("title").text() || "";
        const text = "Fix this inside parser.ts";
        const res = {
            links, anchors, title, text
        };
        return res;
    }
    sanitizeText(text) {
        return text
            .replace(/\s+/g, " ")
            .replace(/\u00a0/g, " ")
            .trim();
    }
}
