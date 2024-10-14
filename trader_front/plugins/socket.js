import io from 'socket.io-client';

let socket;
let BASE_URL;
let DEVELOPMENT;

DEVELOPMENT = true;

if (DEVELOPMENT) {
    BASE_URL = 'http://localhost:8083';
} else {
    BASE_URL = 'https://apitwo.tradexquant.com'
}

if (process) {
    if (process.client) {
        const token = localStorage.getItem('873__jh6bdjktoken');

        if (token) {
            socket = io(`${BASE_URL}`, {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            socket = io(`${BASE_URL}`);
        }
    }
} else {
    const token = localStorage.getItem('873__jh6bdjktoken');

    if (token) {
        socket = io(`${BASE_URL}`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    } else {
        socket = io(`${BASE_URL}`);
    }
}




export default socket;