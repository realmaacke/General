"use strict";
const URL = "https://api.pettersonhome.se/tv";
const sender = {

    GET_BASIC: async function GET_BASIC(endpoint) {
        try {

            let response = await fetch(`${URL}/${endpoint}`, { credentials: 'include' });

            if (!response.ok) {
                console.error(`Response isnt ok, ${response.message}`);
                return null;
            }

            return await response.text();
        } catch (error) {
            console.error(error.message);
            return null;
        }

    },

    POST_BASIC: async function POST_BASIC(endpoint, data) {
        try {
            let response = await fetch(`${URL}/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.error(`Response isnt ok, ${response.message}`);
                return null;
            }

            return await response.text();

        } catch (error) {
            console.error(error.message);
            return null;
        }
    },

    newPlaylist: async function newPlaylist(playlist) {
        let data = await this.POST_BASIC('new_playlist', playlist);
        return data;
    }


};

export default sender;