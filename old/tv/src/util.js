"use strict";
const util = {
    stingify : function stringify (obj) {
        const replacer = [];
        for (const key in obj) {
            replacer.push(key);
        }
        return JSON.stringify(obj, replacer);
    }
};

export default util;