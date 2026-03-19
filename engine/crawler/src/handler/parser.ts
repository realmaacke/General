"use strict";
import { CheerioAPI, load } from "cheerio";
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
        const text = this.grabMainContent(content);

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

    grabMainContent(content: CheerioAPI) {
        let bestNode = "";
        let bestScore: number = 0;

        content("body *").each((_, element) => {
            const node = content(element);
            const text = node.text().trim();

            if (!text || text.length < 80) return;

            const linkText = node.find("a").text().length;
            const textLen = text.length;

            const density = textLen - linkText * 2;

            let bonus = 1;

            const tag = element.tagName?.toLowerCase();

            bonus += this.addBonus(tag);

            const score = density * bonus;

            if (score > bestScore) {
                bestScore = score;
                bestNode = node.text();
            }
        });

        if (bestNode) {
            return bestNode;
        }
        return content("body").text();
    }

    addBonus(tag: string) {
        switch (tag) {
            case "article": return 40;
            case "main": return 30;
            case "section": return 10;
            case "div": return 5;
            default: return 0;
        }
    }

}