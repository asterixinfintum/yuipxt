import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    computed: {
        ...mapState({
            inhouseassets: state => state.inhouseassets.items,
            inhouseasset: state => state.inhouseassets.item
        })
    },
    methods: {
        ...mapActions('inhouseassets', ['getinhouseassets']),
    },
    mounted() {
        //this.getinhouseassets();
    }
}