"use strict";

import { SettingsType } from "../util.js";

import iconv from "iconv-lite";

export class Fetcher {
    settings: SettingsType | null = null;
    userAgent: string | null = null;

    constructor(settigns: SettingsType, userAgent: string = "General Crawler") {
        this.userAgent = userAgent;
        this.settings = settigns;
    }

    private assertInitialized(): asserts this is {
        userAgent: string,
        settings: SettingsType
    } {
        if (!this.settings) throw new Error("Settings could not be loaded");
        if (!this.userAgent) throw new Error("You need to specify userAgent");
    }

    async fetchPage(url: string, abortTime: number = 10000) {
        this.assertInitialized();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller?.abort(), abortTime);

        let res: any;
        try {
            res = await fetch(url, {
                headers: { "User-Agent": this.userAgent },
                redirect: "follow",
                signal: controller.signal
            });

            if (!res.ok) {
                console.error("[class]: Fetcher, fetch was not ok");
                return null;
            }
        } catch (error) {
            console.error("[class]: Fetcher, could not fetch");
            return null;
        }

        try {

            const contentType = res.headers.get("content-type") || "";

            if (!contentType.includes("text/html"))
                return null;

            const buffer = Buffer.from(await res.arrayBuffer());
            let charset = this.settings.PRIMARY_CHARSET || "utf-8";

            const match = contentType.match(/charset=([^;]+)/i);

            if (match) {
                charset = match[1].trim().toLowerCase();
            } else {
                const ascii = buffer.toString("ascii");
                const meta = ascii.match(/<meta[^>]+charset=["']?([^"'/> ]+)/i);
                if (meta) {
                    charset = meta[1].toLowerCase();
                }
            }

            if (!iconv.encodingExists(charset)) {
                charset = this.settings.PRIMARY_CHARSET || "utf-8";
            }

            return iconv.decode(buffer, charset);
        } catch (error) {
            console.error("[class]: Fetcher, error on mehtod: FetchPage, error: ", error);
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }
}