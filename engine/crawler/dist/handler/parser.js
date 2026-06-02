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
        const text = this.grabMainContent(content);
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
    grabMainContent(content) {
        let bestNode = "";
        let bestScore = 0;
        content("body *").each((_, element) => {
            const node = content(element);
            const text = node.text().trim();
            if (!text || text.length < 80)
                return;
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
    addBonus(tag) {
        switch (tag) {
            case "article": return 40;
            case "main": return 30;
            case "section": return 10;
            case "div": return 5;
            default: return 0;
        }
    }
}
