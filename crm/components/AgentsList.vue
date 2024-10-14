<template>
    <div class="dashboard">
      <div class="dashboard__list">
        <div class="dashboard__listitem dashboard__listheader" :style="agents_header_grid_style">
            <div class="dashboard__listitem--section dashboard__listheader--section align-text-to-right" v-for="(item, index) in agentsHeader">{{ item }}</div>
        </div>

        <div class="dashboard__listitem tableitem" :style="agents_grid_style" v-for="(agent, index) in agents" @click.stop="routeTo({
             path: '/itempage', 
             query: { agent_id: agent._id } 
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
                {{ agent.username }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ agent.role }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ agent.email }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ agent.createdAt ? extractDateFromString(agent.createdAt) : '' }}
            </div>
            <div class="dashboard__listitem--section borderless align-text-to-right">
                {{ agent.createdAt ? extractDateFromString(agent.createdAt) : '' }}
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import listMixin from '@/mixins/list.js';
  import urlMixin from '@/mixins/url.js';

  export default {
    props: ['agents'],
    data() {
        return {
            agentsHeader: [
                '',
                'User Name',
                'Role',
                'Email',
                'Created At',
                'Created By'
            ],
        }
    },
    mixins: [urlMixin, listMixin],
    computed: {
        agents_grid_number() {
            return this.agentsHeader.length;
        },
        agents_grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.agents_grid_number}, 1fr)`,
            }
        },
        agents_header_grid_style() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.agents_grid_number}, 1fr)`,
            }
        }
    }
  }
  </script>