const API_URL = import.meta.env.VITE_URL;

const Auth = {
    checkCookies: async function checkCookies() {
        try {
            const response = await fetch(`${API_URL}/check-cookies`, {
                credentials: 'include'
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(`Error in checkCookies(); msg: ${err.message}`);
            return null;
        }
    }
};

export default auth;