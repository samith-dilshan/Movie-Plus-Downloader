const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID === undefined ? '𝙰𝚂𝙸𝚃𝙷𝙰-𝙼𝙳=OyIzwJJL#E9kulJ-N-gdHk0P3kQULPVFKC_enGqQOu4uBRfGiXYQ' : process.env.SESSION_ID,
};
