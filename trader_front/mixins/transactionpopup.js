export default {
    props: ['subject', 'backFunction', 'closeFunction'],
    data() {
        return {
            opacity: true,
            numberInput: '',
            confirmTrade: false
        }
    },
    methods: {
        validateNumberInput() {
            const formattedNumber = this.numberInput.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            this.numberInput = formattedNumber;
        },
        toggleconfirmTrade() {
            this.confirmTrade ? this.confirmTrade = false : this.confirmTrade = true;
        } 
    }
}