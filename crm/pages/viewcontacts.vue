<template>
    <div class="viewcontacts container">
        <DashboardHeader />
        <div v-if="itemsArr.length">
            <ContactsList :items="itemsArr"/>
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
                contacts: state => state.contacts.contacts,
            }),
            ...mapState({
                users: state => state.utility.users,
            })
        },
        methods: {
            async populateitemsArr(contacts) {
                const itemsArr = [];
                const promises = contacts.map(async (contact) => {
                    console.log(contact)
                    itemsArr.push(contact)
                });

                await Promise.all(promises);
                this.itemsArr = itemsArr;
            }
        },
        mounted() {
            this.populateitemsArr(this.contacts);
        },
        watch: {
            contacts(updatedcontacts) {
                const contacts = updatedcontacts

                this.populateitemsArr(contacts)
            }
        }
    }
</script>

<style lang="scss" scoped>
.viewcontacts {
    @include base-container-style;
}
</style>