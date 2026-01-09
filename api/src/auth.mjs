import db from "./database.mjs";

const auth = {

    // Test methods
    testEmail: async function testEmail(email) {
        // Checks so email isnt null
        if (typeof email !== 'string') {
            return {
                ok: false,
                msg: "Invalid Email"
            }
        }
        // Checks if email in database
        if (await db.select("users", "email", "email=?", [email])) {
            return {
                ok: false,
                msg: "Email already taken"
            };
        }
        // Checks if email is valid according to regex pattern
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(email)) {
            return {
                ok: true,
                msg: "Email is valid"
            };
        }
        // Returns invalid if all else statements dont goes through
        return {
            ok: false,
            msg: "Invalid Email"
        };
    },

    testPassword: async function testPassword(password) {
        let regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;

        if (typeof password !== 'string') {
            return {
                ok: false,
                msg: "Invalid Password Type"
            }
        }

        if (regex.test(password)) {
            return {
                ok: true,
                msg: "Password is valid"
            };
        }

        return {
            ok: false,
            msg: "Password must be between 8-32 characters long, must contain at least one uppercase letter, contain at least on number and one special character"
        }
    },

    // Auth methods
    register: async function register(user) {
        let emailState = await this.testEmail(user.email);

        if (!emailState.ok) {
            return emailState;
        }

        let passwordState = await this.testPassword(user.password);

        if (!passwordState.ok) {
            return passwordState;
        }

        //TODO HASH PASSWORD
        // DO CHECKS ON NAME

        let userCreation = await db.insert("users", {
            name: user.name,
            email: user.email,
            password: user.password
        });

        return {
            ok: true,
            msg: "Sucessfully created an Account.",
        };
    },

    login: async function login(user) {
        let dbUser = await db.select('users', '*', 'email=?', [user.email]);

        console.log(dbUser);
        return dbUser
        // if (user.email == dbUser.emai)
    }

};


export default auth;