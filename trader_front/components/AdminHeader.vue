<template>
    <div>
        <div class="adminheader">
            <div class="adminheader__menu">
                <div class="adminheader__menuitem" :class="{ current: currentmenu('users') }" @click="adminrouter('users')">users</div>
                <div class="adminheader__menuitem" :class="{ current: currentmenu('assets') }" @click="adminrouter('assets')">assets</div>
            </div>
        </div>
    </div>
</template>

<script>
import adminMixin from "@/mixins/admin";

export default {
    mixins: [adminMixin],
    methods: {
        currentmenu(str) {
            return this.currentpath.includes(str);
        }
    },
    computed: {
        currentpath() {
            const currentpath = this.$route.matched[0].name;

            return currentpath;
        }
    }
}
</script>

<style lang="scss" scoped>
.adminheader {
    position: fixed;
    top: 0;
    left: 0;
    padding: #{scaleValue(30)} #{scaleValue(100)};
    background: rgba($primary-color, .4);
    width: 100vw;
    z-index: 3;

    &__menu {
        display: flex;
    }

    &__menuitem {
        margin-right: #{scaleValue(50)};
        font-size: #{scaleValue(13)};
        text-transform: uppercase;
        cursor: pointer;
        transition: all .5s ease;

        &.current {
            color: $landing-green;
        }

        &:hover {
            color: $landing-green;
        }
    }
}
</style>