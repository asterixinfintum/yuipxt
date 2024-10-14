export default {
    mounted() {
        this.formatParagraphs();
    },
    methods: {
        formatParagraphs() {
            const textcontent = this.$refs.textcontent;

            const { textarray } = this;

            textarray.forEach((text) => {
                const template = `
              <p class="info__display--p">${text}</p>
            `;

                textcontent.insertAdjacentHTML("beforeend", template);
            });
        },
    },
}