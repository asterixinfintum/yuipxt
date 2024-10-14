<template>
    <div class="itempage container">
        <DashboardHeader />
        <div class="itempage__body">
            <div class="itempage__bodyheader">
                <div class="itempage__headerarea">
                    <span class="svg" @click="editUser(client._id, admin_token, admin._id)">
                        <svg>
                            <use xlink:href="@/assets/imgs/sprites.svg#icon-edit-pencil"></use>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="itempage__content" v-if="client">
                <div class="itempage__contentleft">
                    <div class="itempage__section">
                        <label class="itempage__label">Email</label>
                        <span class="itempage__match">{{ client.email }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Phone Number</label>
                        <span class="itempage__match">{{ client.phonenumber }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Password</label>
                        <span class="itempage__match">{{ client.password }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Verified</label>
                        <span class="itempage__match">{{ client.verified }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Anon Id</label>
                        <span class="itempage__match">{{ client.anonId }}</span>
                    </div>


                    <!--Media styles and components here-->
                    <div v-for="(client_file, index) in client_files" class="itempage__media">
                        <div 
                            v-if="client_file.mimeType === 'image/jpeg'" class="itempage__media--image itempage__media--section">
                            <ImageItem :imgitem="client_file" :ind="index"/>
                        </div>
                        <div 
                            v-if="client_file.mimeType === 'video/webm'" class="itempage__media--video itempage__media--section">
                            <VideoItem :viditem="client_file" :ind="index"/>
                        </div>
                        <div 
                            v-if="client_file.mimeType !== 'video/webm' && client_file.mimeType !== 'image/jpeg'" class="itempage__media--doclink">
                            <DocumentItem :docitem="client_file" ind="index"/>
                        </div>
                    </div>




                    <div class="itempage__section addnote">
                        <label class="itempage__label">Add Note</label>
                        <textarea class="itempage__textarea" id="note" name="note"></textarea>
                        <button>Add Note</button>
                    </div>
                </div>

                <div class="itempage__contentleft" v-if="client.role">
                    <div class="itempage__section">
                        <label class="itempage__label">User Name</label>
                        <span class="itempage__match">{{ client.username }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Role</label>
                        <span class="itempage__match">{{ client.role }}</span>
                    </div>
                    <div class="itempage__section">
                        <label class="itempage__label">Email</label>
                        <span class="itempage__match">{{ client.email }}</span>
                    </div>

                    <div class="itempage__section addnote">
                        <label class="itempage__label">Add Note</label>
                        <textarea class="itempage__textarea" id="note" name="note"></textarea>
                        <button>Add Note</button>
                    </div>
                </div>

                <div class="itempage__contentright">
                    <h3 class="itempage__contentright--h3">Actions</h3>
                    <div class="itempage__actions">
                        <span class="itempage__btnarea">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-phone1"></use>
                                </svg>
                            </span>
                            <button>Copy Number</button>
                        </span>
                        <span class="itempage__btnarea" @click="openwithSubject('addannouncement', client._id)">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-edit-pencil"></use>
                                </svg>
                            </span>
                            <button>Assign Announcement</button>
                        </span>
                        <span class="itempage__btnarea" @click="openwithSubject('addnotification', client._id)">
                            <span class="svg">
                                <svg>
                                     <use xlink:href="@/assets/imgs/sprites.svg#icon-edit-pencil"></use>
                                </svg>
                            </span>
                            <button>Add Notification</button>
                        </span>
                        <span class="itempage__btnarea">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-at-symbol"></use>
                                </svg>
                            </span>
                            <button>Copy Email</button>
                        </span>
                        <span class="itempage__btnarea">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-newspaper1"></use>
                                </svg>
                            </span>
                            <button>View Notes</button>
                        </span>
                        <span class="itempage__btnarea">
                            <span class="svg">
                                <svg>
                                    <use xlink:href="@/assets/imgs/sprites.svg#icon-activity"></use>
                                </svg>
                            </span>
                            <button class="itempage__btnarea--btn">View Activity</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import utilityMixin from '@/mixins/utility.js';

export default {
    mixins: [utilityMixin],
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
    }
}
</script>

<style lang="scss" scoped>
.itempage {
    @include container;

    &__content {
        @include content;
        padding: #{scaleValue(30)};
    }

    & h1 {
        @include h1;  
        margin: #{scaleValue(30)} 0;
    }

    & h2 {
        font-weight: 500;
        font-size: #{scaleValue(18)};
    }

    &__bodyheader {
        display: flex;
        justify-content: space-between;
    }

    &__headerarea {
        padding: #{scaleValue(18)} 0;

        & svg {
            fill: $font-color;
            cursor: pointer;
        }
    }
    
    &__content {
        display: flex;
    }

    &__contentleft {
        width: #{scaleValue(1000)};
        margin-right: #{scaleValue(40)};
    }

    &__section {
        border-bottom: 1px solid rgba($font-color, .2);
        display: flex;
        align-items: center;
        padding: #{scaleValue(18)} 0;

        &:nth-child(1) {
            border-top: 1px solid rgba($font-color, .2);
        }

        &.addnote {
            flex-direction: column;
            align-items: flex-start;

            & button {
                @include btn-primary;
                padding: #{scaleValue(16)} #{scaleValue(24)};
                margin-top: #{scaleValue(18)};
            }
        }
    }

    &__textarea {
        margin-top: #{scaleValue(20)};
        border: 1px solid rgba($font-color, .2);
        min-height: #{scaleValue(200)};
        width: 100%;
        outline: none;
        padding: #{scaleValue(20)};
        border-radius: #{scaleValue(15)};

        &:focus {
            outline: 1px solid rgba($primary-color, .7);
        }
    }

    &__label {
        font-size: #{scaleValue(18)};
        font-weight: 500;
        display: inline-block;
        width: #{scaleValue(500)};
        color: rgba($font-color, .5);
    }

    &__match {
        font-size: #{scaleValue(16)};
        font-weight: 400;
        display: inline-block;
        width: #{scaleValue(400)};
        color: rgba($font-color, .9);
    }

    &__contentright {
        border-left: 1px solid rgba($font-color, .2);
        padding-left: #{scaleValue(40)};

        &--h3 {
            font-weight: 500;
            font-size: #{scaleValue(18)};
            margin-bottom: #{scaleValue(50)};
        }
    }

    &__actions {
        display: flex;
        flex-direction: column;
    }

    &__btnarea {
        margin-bottom: #{scaleValue(40)};
        display: flex;
        align-items: center;
        cursor: pointer;

        & svg {
            fill: rgba($font-color, .4);
            height: #{scaleValue(10)};
            width: #{scaleValue(10)};
        }

        & button {
            outline: none;
            background: none;
            border: none;
            margin-left: #{scaleValue(10)};
            font-size: #{scaleValue(13)};
            font-weight: 700;
            cursor: pointer;
            color: $primary-color;
        }
    }

    &__media {
        display: flex;

        &--section {
            width: #{scaleValue(600)};
            height: #{scaleValue(600)};
            flex-shrink: 0;
        }

        &--doclink {
            margin:  #{scaleValue(10)} 0;

        }

        &--video {}
    }
}
</style>