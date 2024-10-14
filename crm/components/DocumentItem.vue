<template>
    <div class="documentitem">
        <a :href="`${base_api_url}/${documentName}`">View document</a>
    </div>
</template>

<script>
import variables from '@/store/variables';

const { BASE_API_URL_TWO } = variables;

export default {
    props: ['docitem', 'ind'],
    data() {
        return {
            base_api_url: BASE_API_URL_TWO
        }
    },
    computed: {
        documentName: function() {
            const docPath = `${this.docitem.filePath}`;
            const docname = docPath.substring(docPath.indexOf('/') + 1);

            return docname;
        }
    }
}
</script>

<style lang="scss" scoped>
.documentitem {

}
</style>