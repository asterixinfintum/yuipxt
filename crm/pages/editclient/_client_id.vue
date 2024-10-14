<template>
    <div class="edititem container">
        <DashboardHeader />

        <div class="edititem__body">
            <div class="edititem__bodyheader">
                <div class="edititem__headerarea">
                    <span class="svg" @click="goToUser(client._id, admin_token, admin._id)">{{ `<--` }}</span>
                    <span class="svg-label">Back</span>
                </div>
            </div>

            <div class="edititem__content" v-if="client">
                <ClientEdit />
            </div>
        </div>
    </div>
</template>

<script>
import utilityMixin from '@/mixins/utility.js';

export default {
    mounted() {
        const client_id = this.$route.params.client_id;
        const admin_token = this.$route.query.admin_token;
        const admin_id = this.$route.query.adminId;

        this.getClient({ client_id, admin_token }).then(() => {
            this.getClientVerificationMedia({ client_id });
            this.getCurrentAdmin(admin_id)
                .then(token => this.getClients(token))
                .catch(err => console.log(err))
        });
    },
    mixins: [utilityMixin],
}
</script>

<style lang="scss" scoped>
.edititem {
    @include container;

    &__content {
        @include content;
        padding: #{scaleValue(30)};
    }

    &__headerarea {
        padding: #{scaleValue(18)} 0;
        display: flex;
        align-items: center;

        & span {
            cursor: pointer;

            &.svg {
                font-size:  #{scaleValue(15)};
            }

            &.svg-label {
                font-size: #{scaleValue(13)};
                margin-left: #{scaleValue(5)};
            }
        }

        & svg {
            fill: $font-color;
            cursor: pointer;
        }
    }
}
</style>