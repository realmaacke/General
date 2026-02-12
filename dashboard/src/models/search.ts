"use strict";

export const searchModel = {
    query: async function query(param: string) {
        try {
            let res = await fetch(`https://api.petterssonhome.se/engine/search?query=${param}`);
            const data = res.json();

            return data;
        } catch {
            return {};
        }

    }

};