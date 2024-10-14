<template>
    <div class="dashboard">
      <div class="dashboard__list">
        <div class="dashboard__listitem dashboard__listheader" :style="header_grid_style">
            <div class="dashboard__listitem--section dashboard__listheader--section align-text-to-right" v-for="(item, index) in header">{{ item }}</div>
        </div>

        <div class="dashboard__listitem tableitem" :style="grid_style" v-for="(item, index) in items" @click.stop="routeTo({
             path: '/itempage', 
             query: { lead_id: item._id } 
             })">
            <div class="dashboard__listitem--section borderless icons">
                <div class="dashboard__listitem--checkbox">
                    <input type="checkbox"/>
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
            <!--<div class="dashboard__listitem--section borderless align-text-to-right" v-for="(ci, index) in render_client(client_item)">{{ ci }}</div>-->
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.firstName }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.lastName }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.email }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.phone }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.status ? item.status : '' }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.owner ? item.owner.username : '' }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.status ? item.status : '' }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ item.createdAt ? extractDateFromString(item.createdAt) : '' }}
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import utilityMixin from '@/mixins/utility.js';
  import urlMixin from '@/mixins/url.js';

  export default {
    props: ['items'],
    mixins: [urlMixin],
    data() {
      return {
        
      }
    },
    methods: {
        extractDateFromString(dateTimeString) {
            const date = new Date(dateTimeString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            return formattedDate;
        },
        render_client(client) {
            const client_arr = []
            for (const key in client) {
                if (client.hasOwnProperty(key)) {
                    client_arr.push(client[`${key}`]);

                    if (client_arr.length === Object.keys(client).length) {
                        return client_arr;
                    }
                }
            }
        }
    },
    computed: {
        header() {
            return [
                '',
                'First Name',
                'Last Name',
                'Email',
                'Phone',
                'Status',
                'Created By',
                'Assigned to',
                'Created Date'
            ]
        },
        grid_number() {
            return this.header.length;
        },
        grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.grid_number}, 1fr)`,
            }
        },
        header_grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.grid_number}, 1fr)`,
            }
        }
    }
  }
  </script>

<style lang="scss" scoped>
.dashboard {

    &__list {
        @include content;
        overflow-x: scroll;
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    }
    
    &__listitem {
        grid-gap:  0;
        padding: #{scaleValue(16)} #{scaleValue(10)};
        font-size: #{scaleValue(13)};
        font-weight: 500;
        transition: all .3s ease;

        &.tableitem {
            cursor: pointer;

            &:hover {
                background: rgba(0, 0, 0, 0.1);
            }
        }

        &:nth-child(odd) {
            background: rgba($primary-color, .1);

            &.tableitem {
                cursor: pointer;
            }
        }

        &--section {
            border-right: 1px solid rgba($font-color, .2);
            padding-right: #{scaleValue(10)};
            text-transform: lowercase;

            &.icons {
                display: flex;
            }

            &:last-child {
                border: none
            }
        }

        &--checkbox {
            display: flex;
            align-items: center;
            margin-right: #{scaleValue(16)};
            cursor: pointer;
        }

        &--svg {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: #{scaleValue(16)};

            & svg {
                fill: rgba($dark-graphite, .5);
                height: #{scaleValue(13)};
                width: #{scaleValue(13)};
                display: inline-block;
                transform: translateY(#{scaleValue(.5)});
            }

            &.clicked {
                color: $metallic-gold;
            }
        }
    }

    &__listheader {
        background: rgba(74, 78, 77, .1) !important;
        font-weight: 600;
        font-size: #{scaleValue(10.5)};
        padding: #{scaleValue(18)} #{scaleValue(10)};

        &--section {
            text-transform: uppercase;
            opacity: .8;
        }
    }
}
</style>
  