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
  import listMixin from '@/mixins/list.js';
  import urlMixin from '@/mixins/url.js';

  export default {
    mixins: [urlMixin, listMixin],
  }
  </script>