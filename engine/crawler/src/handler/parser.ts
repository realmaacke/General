"use strict";
import { load } from "cheerio";
import { FiltersType, loadFilters } from "../util.js";

interface AnchorObj {
    url: string,
    text: string
}

export interface ParsedObject {
    links: string[],
    anchors: AnchorObj[],
    title: string,
    text: string
};

export class Parser {
    filterObj: FiltersType | null = null;

    constructor() {
        this.filterObj = loadFilters();
    }


    private assertInitialized(): asserts this is {
        filterObj: FiltersType
    } {
        if (!this.filterObj) throw new Error("[class]: Parser, filter not initialized");
    }

    skipTypes(rawUrl: string | URL) {
        this.assertInitialized();

        let url: string | URL;

        try {
            url = new URL(rawUrl);
        } catch {
            return true;
        }

        const pathName: string = url.pathname.toLowerCase();

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

    parse(html: string, baseUrl: string) {
        this.assertInitialized();
        const content = load(html);

        const links: string[] = [];
        const anchors: AnchorObj[] = [];

        content(this.filterObj?.url.excludeAttributes.join(", ")).remove();

        content("a[href]").each((_, element) => {
            const href = content(element).attr("href");
            const anchorText: string = content(element).text() || "";

            if (!href) return;

            try {
                let absolutePath = new URL(href, baseUrl).href;

                if (absolutePath.includes("/url?")) {
                    const u = new URL(absolutePath);
                    absolutePath = u.searchParams.get("q") || absolutePath;
                }

                links.push(absolutePath);

                let newAnchor: AnchorObj = {
                    url: absolutePath,
                    text: anchorText
                };

                anchors.push(newAnchor)
            } catch (error) {
                console.error("Could not parse link: ", href);
            }
        });

        const title = content("title").text() || "";
        const text = "Fix this inside parser.ts";

        const res: ParsedObject = {
            links, anchors, title, text
        };

        return res;
    }

    sanitizeText(text: string) {
        return text
            .replace(/\s+/g, " ")
            .replace(/\u00a0/g, " ")
            .trim();
    }

}