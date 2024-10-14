let BASE_URL;
let DEVELOPMENT;

DEVELOPMENT = true;

if (DEVELOPMENT) {
    BASE_URL = 'http://localhost:8082';
} else {
    BASE_URL = 'https://api.tradexquant.com'
}

const BASE_VARS = {
    BASE_URL,
}

export default BASE_VARS;