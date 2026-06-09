let BASE_URL;
let DEVELOPMENT;

DEVELOPMENT = false;

if (DEVELOPMENT) {
    BASE_URL = 'http://localhost:8082';
} else {
    BASE_URL = 'https://api.bsn.finance'
}

const BASE_VARS = {
    BASE_URL,
}

export default BASE_VARS;