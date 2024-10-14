<template>
    <div class="dashboard container">
        <DashboardHeader />
        <div class="dashboard__list">
            <div class="dashboard__listitem dashboard__listheader" :style="header_grid_style">
                <div class="dashboard__listitem--section dashboard__listheader--section align-text-to-right"
                    v-for="(item, index) in header">{{ item }}</div>
            </div>

            <div class="dashboard__listitem" :style="grid_style" v-for="(client, index) in clients"
                @click="goToUser(client._id, admin_token, adminId)">
                <div class="dashboard__listitem--section borderless icons">
                    <div class="dashboard__listitem--checkbox">
                        <input type="checkbox" />
                    </div>
                    <div class="dashboard__listitem--svg">
                        <span class="svg">
                            <svg>
                                <use xlink:href="@/assets/imgs/sprites.svg#icon-star-full"></use>
                            </svg>
                        </span>
                    </div>
                    <div class="dashboard__listitem--svg">
                        <span class="svg">
                            <svg>
                                <use xlink:href="@/assets/imgs/sprites.svg#icon-phone1"></use>
                            </svg>
                        </span>
                    </div>
                    <div class="dashboard__listitem--svg">
                        <span class="svg">
                            <svg>
                                <use xlink:href="@/assets/imgs/sprites.svg#icon-edit-pencil"></use>
                            </svg>
                        </span>
                    </div>
                    <div class="dashboard__listitem--svg">
                        <span class="svg">
                            <svg>
                                <use xlink:href="@/assets/imgs/sprites.svg#icon-ellipsis-h"></use>
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ client.anonId }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ client.password }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ client.phonenumber }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ client.verified }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ client.email }}</div>
            </div>
        </div>
    </div>
</template>
  
<script>
import dashboardMixin from '@/mixins/dashboard.js';

export default {
    mixins: [dashboardMixin],
    mounted() {
        this.getCurrentAdmin(this.adminId)
            .then(token => this.getClients(token))
            .catch(err => console.log(err))
    },
    computed: {
        header() {
            return [
                '',
                'anon Id',
                'Password',
                'Phone number',
                'Verified',
                'Email',
                'Status',
                'Created Date',
                'Assigned Date'
            ]
        },
        adminId() {
            return this.$route.params.dashboard;
        }
    }
}
</script>