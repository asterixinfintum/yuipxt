<template>
    <div class="imageitem">
        <div class="imageitem__body">
            <figure v-if="imgitem"> 
                <img 
                    :id="`myImage-${imgitem._id}`" 
                    :src="`${base_api_url}/${imgitem.jpegName}`"/>
            </figure>
        </div>
    </div>
</template>

<script>
import variables from '@/store/variables';

const { BASE_API_URL_TWO } = variables;

export default {
    props: ['imgitem', 'ind'],
    data() {
        return {
            base_api_url: BASE_API_URL_TWO
        }
    },
    mounted() {},
    methods: {},
    computed: {}
}
</script>

<style lang="scss" scoped>
.imageitem {
    width: 100%;
    height: 100%;

    &__body {
        width: 100%;
        height: 100%;

        & figure {
            width: 100%;
            height: 100%;

            & img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}
</style>