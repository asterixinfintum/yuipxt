import BASE_VARS from '@/store/base_vars';

const { BASE_URL } = BASE_VARS;

export default {
    methods: {
        returnCryptoLogo(image) {
            if (/^http/.test(image)) {
                return image;
            }
            return `${BASE_URL}/${image}`;
        }
    }
}