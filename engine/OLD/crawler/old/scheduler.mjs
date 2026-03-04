"use strict";

export class Scheduler {
    constructor(ttlMs = 10 * 60 * 1000) {
        this.domainState = new Map();
        this.ttlMs = ttlMs;

        setInterval(() => this.clean(), 60_000);
    }

    async acquireDomain(url, delayMs = 2000) {
        const domain = new URL(url).hostname;

        let state = this.domainState.get(domain);

        if (!state) {
            state = {
                lastFetch: 0,
                lastUsed: Date.now(),
                pending: 0,
                chain: Promise.resolve()
            };
            this.domainState.set(domain, state);
        }

        state.lastUsed = Date.now();
        state.pending++;

        state.chain = state.chain.then(async () => {
            const now = Date.now();
            const wait = Math.max(0, delayMs - (now - state.lastFetch));

            if (wait > 0) {
                await this.sleep(wait);
            }

            state.lastFetch = Date.now();
            state.lastUsed = Date.now();
            state.pending--;
        });

        await state.chain;
    }

    clean() {
        const now = Date.now();

        for (const [domain, state] of this.domainState) {
            const inactive = now - state.lastUsed > this.ttlMs;

            if (inactive && state.pending === 0) {
                this.domainState.delete(domain);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
