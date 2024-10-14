<template>
    <div class="popup" v-if="popupopen">
        <div class="popup__body">
            <span class="popup__close" @click="popupAction">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah">
                    <path
                        d="M6.697 4.575L4.575 6.697 9.88 12l-5.304 5.303 2.122 2.122L12 14.12l5.303 5.304 2.122-2.122L14.12 12l5.304-5.303-2.122-2.122L12 9.88 6.697 4.575z"
                        fill="currentColor"></path>
                </svg>
            </span>
            <div class="popup__warningsvg">
                <span class="popup__warningsvg--svg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-19ss7aa">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M9 4h6v2h-2v1h7v4.5h2v4h-2V20H4v-4.5H2v-4h2V7h7V6H9V4zm1 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-1 3.703h6L13.704 16.5h-3.4L9 15.203zM15.5 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                            fill="currentColor"></path>
                    </svg>
                </span>
            </div>

            <div class="popup__text">
                <h3 class="popup__text--h3">Ever felt lost in the maze of market strategies?</h3>

                <p class="popup__text--p" :class="{
                    current: currentPane === 1,
                    previous: currentPane > 1
                }">Navigating the financial markets can be daunting, especially if you're a beginner or at an
                    intermediate level. It's easy to feel overwhelmed by the plethora of strategies and configurations
                    available</p>

                <p class="popup__text--p" :class="{
                    current: currentPane === 2,
                    previous: currentPane > 2
                }">Imagine having a system that AUTOMATICALLY selects and tailors the best strategies for you,
                    ensuring you're always positioned for success.</p>

                <p class="popup__text--p" :class="{
                    current: currentPane === 3
                }">Dive into the future of investing, where maximizing profits and minimizing losses becomes
                    effortless. Perfect for newbies and intermediate market enthusiasts alike. Your journey to smarter
                    investing starts here. Dive in now!</p>
            </div>

            <div class="popup__action">
                <div class="popup__panenav">
                    <span class="arrow" @click="previouspane"> {{ '<-' }} </span>
                            <span class="space"></span>
                            <span class="arrow" @click="nextpane"> {{ '->' }} </span>
                </div>
                <button class="popup__action--btn btn colored-btn padded-btn" @click="popupAction(action)">Create Trading
                    Bot</button>
            </div>
        </div>
    </div>
</template>

<script>
import generalutilities from '@/mixins/generalutilities.js';

export default {
    mixins: [generalutilities],
    props: ['text', 'action'],
    data() {
        return {
            currentPane: 1
        }
    },
    methods: {
        nextpane() {
            const { currentPane } = this;

            if (currentPane < 3) {
                let incr = currentPane;
                incr += 1;
                this.currentPane = incr;
            }
        },
        previouspane() {
            const { currentPane } = this;

            if (currentPane > 1) {
                let decr = currentPane;
                decr -= 1;
                this.currentPane = decr;
            }
        }
    }
}
</script>
