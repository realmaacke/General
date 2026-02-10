"use strict";
const domainState = new Map();

export async function acquireDomain(url, dealyMs = 2000) {
    const domain = new URL(url).hostname;

    if (!domainState.has(domain)) {
        domainState.set(domain, {
            lastFetch: 0,
            locked: false
        });
    }

    const state = domainState.get(domain);

    while (state.locked) {
        await sleep(50);
    }

    state.locked = true;

    const difference = Date.now() - state.lastFetch;

    if (difference < dealyMs) {
        await sleep(dealyMs - difference);
    }
}

export function releaseDomain(url) {
    const domain = new URL(url).hostname;
    const state = domainState.get(domain);

    if (!state) return;

    state.lastFetch = Date.now();
    state.locked = false;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}


const lastFetch = new Map();

export async function waitForDomain(url, delay = 2000) {
    const domain = new URL(url).hostname;
    const last = lastFetch.get(domain) || 0;
    const difference = Date.now() - last;

    if (difference < delay) {
        await new Promise(r => setTimeout(r, delay - difference));
    }

    lastFetch.set(domain, Date.now());
}