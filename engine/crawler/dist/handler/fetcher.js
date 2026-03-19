"use strict";
import iconv from "iconv-lite";
export class Fetcher {
    controller = null;
    settings = null;
    userAgent = null;
    constructor(settigns, userAgent = "General Crawler") {
        this.controller = new AbortController();
        this.userAgent = userAgent;
        this.settings = settigns;
    }
    assertInitialized() {
        if (!this.settings)
            throw new Error("Settings could not be loaded");
        if (!this.controller)
            throw new Error("Controller is not initialized");
        if (!this.userAgent)
            throw new Error("You need to specify userAgent");
    }
    async fetchPage(url, abortTime = 10000) {
        this.assertInitialized();
        const timeout = setTimeout(() => this.controller?.abort(), abortTime);
        try {
            const res = await fetch(url, {
                headers: { "User-Agent": this.userAgent },
                redirect: "follow",
                signal: this.controller?.signal
            });
            if (!res.ok)
                return null;
            const contentType = res.headers.get("content-type") || "";
            if (!contentType.includes("text/html"))
                return null;
            const buffer = Buffer.from(await res.arrayBuffer());
            let charset = this.settings.PRIMARY_CHARSET || "utf-8";
            const match = contentType.match(/charset=([^;]+)/i);
            if (match) {
                charset = match[1].trim().toLowerCase();
            }
            else {
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
        }
        catch (error) {
            console.error("[class]: Fetcher, error on mehtod: FetchPage, error: ", error);
            return null;
        }
        finally {
            clearTimeout(timeout);
        }
    }
}
