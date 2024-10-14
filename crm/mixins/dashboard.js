import utilityMixin from '@/mixins/utility.js';

export default {
    mixins: [utilityMixin],
    computed: {
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
    },
    methods: {
        toHumanReadable(dateString) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };

            const dateObj = new Date(dateString);
            return dateObj.toLocaleString(undefined, options);
        }
    }
}