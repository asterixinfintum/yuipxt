import { mapActions } from 'vuex';

export default {
    props: ['items'],
    methods: {
        extractDateFromString(dateTimeString) {
            const date = new Date(dateTimeString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            return formattedDate;
        },
    },
    computed: {
        header() {
            return [
                '',
                'First Name',
                'Last Name',
                'Email',
                'Phone',
                'Status',
                'Created By',
                'Assigned to',
                'Created Date'
            ]
        },
        grid_number() {
            return this.header.length;
        },
        grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.grid_number}, 1fr)`,
            }
        },
        header_grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.grid_number}, 1fr)`,
            }
        }
    }
}