<template>
    <div class="dashboard container">
        <DashboardHeader />

        <div class="dashboard__list">
            <div class="dashboard__listitem dashboard__listheader" :style="header_grid_style">
                <div class="dashboard__listitem--section dashboard__listheader--section align-text-to-right"
                    v-for="(item, index) in header">{{ item }}</div>
            </div>

            <div class="dashboard__listitem" :style="grid_style" v-for="announcement in announcements"
                @click.stop="openItemPage('announcement', announcement._id)">
                <div class="dashboard__listitem--section borderless icons">
                   
                    <div class="dashboard__listitem--svg" @click.stop="remove(announcement._id)">
                        <span class="svg btn">
                            delete
                        </span>
                    </div>
                </div>

                <div class="dashboard__listitem--section borderless align-text-to-right">{{ announcement.header }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ announcement.preview }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ announcement.content }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardMixin from '@/mixins/dashboard.js';

export default {
    mixins: [dashboardMixin],
    computed: {
        header() {
            return [
                '',
                'header',
                'preview',
                'content'
            ]
        }
    }, 
    methods: {
        remove(announcement_id) {
              const { base_url } = this;
              const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

              try {
                fetch(`${base_url}/announcements/${announcement_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    },
                })
                .then((response) => response.json())
                .then((data) => this.reloadPage())
                .catch((error) => console.error(error));
              } catch (error) {

              }
        }
    }
}
</script>