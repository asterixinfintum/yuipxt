import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            timeToRequestData: 6000
        }
    },
    computed: {
        ...mapState({
            assets: state => state.list.assets
        })
    },
    methods: {
        ...mapActions('list', ['getassets']),
        getCharactersBeforeUnderscore(str) {
            const parts = str.split('_');
            return parts[0];
        },
        removeUnderscore(str) {
            return str.replace(/_/g, '');
        }
    },
    mounted() {
        //this.getassets();
    }
}