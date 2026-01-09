const URL = "https://api.petterssonhome.se";

const API = {

    login: async function login(User) {
        try {
            let response = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(User)
            });

            if (!response.ok) {
                console.error(`Response is not ok: ${response.statusText}`);
                return null;
            }

            const data = response.json();
            return data;
        } catch (error) {
            console.error(`Error when trying to login(), msg: ${error}`);
            return null;
        }
    }

};

export default API;