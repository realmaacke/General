"use strict";
import iconv from "iconv-lite";
import { loadSettings } from "../indexer/settings.mjs";
const settings = loadSettings();

export async function fetchPage(url, abortTime = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), abortTime);

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "GeneralCrawler/0.1" },
            redirect: "follow",
            signal: controller.signal
        });

        if (!res.ok) {
            return null;
        }

        const contentType = res.headers.get("content-type") || "";
        
        if (!contentType.includes("text/html")) {
            return null;
        }
        
        const buffer = Buffer.from(await res.arrayBuffer());
        
        let charset = settings['PRIMARY_CHARSET'] || "utf-8";
        
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
            charset = settings['PRIMARY_CHARSET'] ||"utf-8";
        }

        return iconv.decode(buffer, charset);

    } catch {
        console.error("Could not fetch page: ", url);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}