"use strict";

/**
 * Re-design this whole class
 * 
 * MAJOR MEMORY LEAK
 */

interface domainStateState {
    lastFetch: number,
    lastUsed: number,
    pending: number,
    chain: Promise<any>
}

export class Scheduler {
    domainState: Map<string, domainStateState> | null = null;
    ttlMs: number | null = null;

    constructor(ttlMs: number = 10 * 60 * 1000) {
        this.domainState = new Map();
        this.ttlMs = ttlMs;

        setInterval(() => this.clean(), 60_000);
    }

    async acquireDomain(url: string, delayMs: number = 2000) {
        const domain = new URL(url).hostname;

        if (!this.domainState) {
            return;
        }

        let state = this.domainState?.get(domain);

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
            const now: number = Date.now();
            const wait: number = Math.max(0, delayMs - (now - state.lastFetch));

            if (wait > 0) {
                await this.sleep(wait);
            }

            state.lastFetch = Date.now();
            state.lastUsed = Date.now();
            state.pending--;
        });

        await state.chain;
    }

    clean(): void {
        const now: number = Date.now();

        if (!this.domainState) {
            return;
        }

        if (!this.ttlMs) {
            return;
        }

        for (const [domain, state] of this.domainState) {
            const inactive: boolean = now - (state.lastFetch) > this.ttlMs;

            if (inactive && state.pending === 0) {
                this.domainState.delete(domain);
            }
        }
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}