<template>
    <div class="viewagents container">
        <DashboardHeader />
        <div>
            <AgentsList :agents="users"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            itemsArr: []
        }
    },
    computed: {
        ...mapState({
            users: state => state.utility.users,
        })
    }
}
</script>

<style lang="scss" scoped>
.viewagents {
    @include base-container-style;
}
</style>