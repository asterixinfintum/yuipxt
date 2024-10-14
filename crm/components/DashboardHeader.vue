<template>
    <div>
        <div class="dashboardheader" v-if="admin">

            <UploadCsv v-if="upload_popup" :open_csvupload="open_csvupload" />


            <div class="dashboardheader__top flex-area">
                <div class="dashboardheader__toparea flex-area">
                    <div class="dashboardheader__logo" @click="routeTo('/viewleads')">
                        <span>CRM</span>
                    </div>

                    <div class="dashboardheader__left flex-area margin-bottom-header">
                        <div class="dashboardheader__leftitem" @click="routeTo('/viewagents')">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-users"></use>
                                </svg>
                            </span>
                            <p class="label">Agents</p>
                        </div>
                        <div class="dashboardheader__leftitem" @click="routeTo('/activities')">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-activity"></use>
                                </svg>
                            </span>
                            <p class="label">Activities</p>
                        </div>
                        <div class="dashboardheader__leftitem">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-arrow_drop_down"></use>
                                </svg>
                            </span>
                            <p class="label">Actions</p>
                        </div>
                        <div class="dashboardheader__leftitem">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-bar-chart"></use>
                                </svg>
                            </span>
                            <p class="label">Reports</p>
                        </div>
                        <div class="dashboardheader__leftitem" @click="open_csvupload">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-open_in_browser"></use>
                                </svg>
                            </span>
                            <p class="label">Upload Csv/Excel</p>
                        </div>
                        <div class="dashboardheader__leftitem" @click="openPage('createasset')">
                            <span class="svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1pj0ttb">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4 4v7h7V4H4zm9 7V4h7v7h-7zm3.5 9.743L12.257 16.5l4.243-4.243 4.243 4.243-4.243 4.243zM4 13h7v7H4v-7z"
                                        fill="currentColor"></path>
                                </svg>
                            </span>
                            <p class="label">Add Asset</p>
                        </div>
                        <div class="dashboardheader__leftitem" @click="openPage('addannouncement')">
                            <span class="svg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1pj0ttb">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4 4v7h7V4H4zm9 7V4h7v7h-7zm3.5 9.743L12.257 16.5l4.243-4.243 4.243 4.243-4.243 4.243zM4 13h7v7H4v-7z"
                                        fill="currentColor"></path>
                                </svg>
                            </span>
                            <p class="label">Add Announcement</p>
                        </div>
                    </div>
                </div>

                <div class="dashboardheader__right dashboardheader__toparea flex-area margin-bottom-header">
                    <div class="dashboardheader__right--svg">
                        <span class="svg"></span>
                    </div>
                    <div class="dashboardheader__right--svg">
                        <span class="svg">
                            <svg>
                                <use xlink:href="@/assets/imgs/sprites.svg#icon-bell"></use>
                            </svg>
                        </span>
                    </div>

                    <div class="dashboardheader__name">
                        <div class="dashboardheader__right--svg">
                            <span class="svg">

                            </span>
                        </div>
                        <p class="name">{{ admin.username }}</p>
                        <div class="dashboardheader__right--svg">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-cheveron-down"></use>
                                </svg>
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="dashboardheader__middle flex-area margin-bottom-header">
                <div class="dashboardheader__clientsnum">
                    <p>Clients: 2699 items</p>
                </div>
            </div>

            <div class="dashboardheader__bottom flex-area margin-bottom-header">
                <div class="dashboardheader__bottomarea">
                    <span class="btn" @click="routeTo(`/admin/${admin._id}`)">Users</span>
                    <span class="btn" @click="routeTo('/viewleads')">Leads</span>
                    <span class="btn" @click="routeTo('/viewcontacts')">Contacts</span>
                    <span class="btn">Uk reassigns</span>
                    <span class="btn">Reassigns</span>
                    <span class="btn" @click="openPage('assets')">Assets</span>
                    <span class="btn" @click="openPage('announcements')">Announcements</span>
                </div>
            </div>

            <div class="dashboardheader__inputarea">
                <div class="dashboardheader__search">
                    <span class="svg">
                        <svg>
                            <use xlink:href="@/assets/imgs/sprites.svg#icon-search1"></use>
                        </svg>
                    </span>
                    <input placeholder="Search" />
                </div>
                <div class="dashboardheader__searchtoggle">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import urlMixin from '@/mixins/url.js';
import utilityMixin from '@/mixins/utility.js';

export default {
    data() {
        return {
            upload_popup: false
        }
    },
    mounted() {
        const adminId = this.$route.query.adminId;

        if (adminId) {
            this.getCurrentAdmin(adminId)
                .then(token => this.getClients(token))
                .catch(err => console.log(err));

            this.getAssets();
            this.getAnnouncements();
        }
    },
    methods: {
        open_csvupload(event) {
            event.stopPropagation()
            this.upload_popup ? this.upload_popup = false : this.upload_popup = true;
        }
    },
    mixins: [urlMixin, utilityMixin]
}
</script>

<style lang="scss" scoped>
.dashboardheader {
    position: relative;
    color: $white;
    background: $primary-color;
    z-index: 2;
    height: #{scaleValue(190)};

    &__logo {
        font-size: #{scaleValue(25)};
        margin-right: #{scaleValue(50)};
        cursor: pointer;
    }

    &__left {
        margin: 0 #{scaleValue(50)};
    }

    &__leftitem {
        font-size: #{scaleValue(15)};
        margin: 0 #{scaleValue(20)};
        display: flex;
        align-items: center;
        cursor: pointer;

        & p {

            &.label {
                margin: #{scaleValue(5)};
            }
        }
    }

    &__top {
        justify-content: space-between;
        font-size: #{scaleValue(14)};
    }

    &__name {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-left: #{scaleValue(20)};

        & p {

            &.name {
                display: inline-block;
                margin: 0 #{scaleValue(10)};
            }
        }
    }

    &__middle {
        font-size: #{scaleValue(12)};
    }

    &__bottomarea {
        position: relative;
        background: $white;
        color: $font-color;
        padding: #{scaleValue(10)};
        width: 100%;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: #{scaleValue(12)};
        height: #{scaleValue(40)};

        &::before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: rgba($primary-color, .1);
            z-index: 1;
        }

        & span {

            &.btn {
                cursor: pointer;
                text-transform: uppercase;
                display: inline-block;
                margin-right: #{scaleValue(30)};
                opacity: .6;
                position: relative;
                z-index: 2;
            }
        }

        & span {}
    }

    &__inputarea {
        display: flex;
    }

    &__search {
        background: rgba(0, 0, 0, .5);
        padding: #{scaleValue(5)} #{scaleValue(15)};
        display: flex;
        height: #{scaleValue(42)};

        border-radius: #{scaleValue(10)};
        margin-top: #{scaleValue(10)};

        & span {

            &.svg {
                display: flex;
                height: 100%;
                align-items: center;

                & svg {
                    height: #{scaleValue(13)};
                    width: #{scaleValue(13)};
                    fill: $white;
                }
            }
        }

        & input {
            display: inline-block;
            border: none;
            outline: none;
            height: 100%;
            width: #{scaleValue(500)};
            background: none;
            color: $white;
            padding-left: #{scaleValue(8)};

            font-size: #{scaleValue(14)};

            &::placeholder {
                color: $white;
                opacity: .9;
                font-size: #{scaleValue(14)};
            }
        }
    }
}
</style>