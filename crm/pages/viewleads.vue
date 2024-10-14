<template>
    <div class="viewleads container">
        <DashboardHeader />
        <div v-if="itemsArr.length">
            <LeadsList :items="itemsArr"/>
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
            leads: state => state.leads.leads,
        }),
        ...mapState({
            users: state => state.utility.users,
        })
    },
    methods: {
        getItemOwner (owner_id) {
            const owner = this.users.find(user => user._id === owner_id);
            return owner;
        },
        async populateitemsArr(leads) {
            const itemsArr = [];
            const promises = leads.map(async (lead) => {
                lead.owner = await this.getItemOwner(lead.createdBy);
                itemsArr.push(lead);
            });

            await Promise.all(promises);
            this.itemsArr = itemsArr;
        }
    },
    mounted() {
        this.populateitemsArr(this.leads);
    },
    watch: {
        leads(updatedleads) {
            const leads = updatedleads

            this.populateitemsArr(leads)
        }
    }
}
</script>

<style lang="scss" scoped>
.viewleads {
    @include base-container-style;
}
</style>