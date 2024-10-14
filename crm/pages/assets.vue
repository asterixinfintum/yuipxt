<template>
    <div class="dashboard container">
        <DashboardHeader />

        <div class="dashboard__list">
            <div class="dashboard__listitem dashboard__listheader" :style="header_grid_style">
                <div class="dashboard__listitem--section dashboard__listheader--section align-text-to-right"
                    v-for="(item, index) in header">{{ item }}</div>
            </div>

            <div class="dashboard__listitem" :style="grid_style" v-for="asset in assets"
                @click.stop="openItemPage('asset', asset._id)">
                <div class="dashboard__listitem--section borderless icons">
                    <div class="dashboard__listitem--svg" @click.stop="delist(asset._id)">
                        <span class="svg delist btn">
                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z">
                                </path>
                            </svg>
                        </span>
                    </div>
                    <div class="dashboard__listitem--svg" @click.stop="relist(asset._id)">
                        <span class="svg relist btn">
                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true">
                                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z">
                                </path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.name }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.symbol }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.price }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.assetType }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.chain }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.initialPrice }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ asset.tickerSymbol }}</div>
                <div class="dashboard__listitem--section borderless align-text-to-right">{{ toHumanReadable(asset.time) }}
                </div>

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
                'name',
                'symbol',
                'price',
                'asset type',
                'chain',
                'initial price',
                'ticker symbol',
                'added'
            ]
        }
    },
    methods: {
        delist(assetId) {
            const { base_url, admin } = this;
            const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

            try {
                fetch(`${base_url}/delistinhouseasset?adminId=${admin._id}&assetId=${assetId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })
            } catch (error) {
                console.log(error)
            }
        },
        relist(assetId) {
            const { base_url, admin } = this;
            const admin_token = localStorage.getItem('873__jh6bdjkadmtoken');

            try {
                fetch(`${base_url}/relistinhouseasset?adminId=${admin._id}&assetId=${assetId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${admin_token}`
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
