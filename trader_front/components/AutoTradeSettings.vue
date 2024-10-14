<template>
    <div class="popup autotradesettings">
        <div class="popup__body autotradesettings">
            <span class="popup__close" @click="togglestrategiesState">
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

            <div class="popup__container popup__text autotradesettings">
                <h3 class="popup__text--h3 bot">Select strategies for this trade</h3>

                <div class="popup__content">
                    <div class="autotradesettings__options">
                        <div v-for="tradingStrategy in tradingStrategies">
                            <div class="autotradesettings__option main">
                                <label class="autotradesettings__option--label">{{ tradingStrategy.name }}</label>
                                <div class="toggle-switch off" @click="toggleStrategies(tradingStrategy.name)" :class="{
                                    on: strategies.includes(tradingStrategy.name)
                                }">
                                    <span class="toggle-switch-button" :class="{
                                        off: !strategies.includes(tradingStrategy.name),
                                        on: strategies.includes(tradingStrategy.name)
                                    }"></span>
                                </div>
                            </div>

                            <div v-if="strategies.includes(tradingStrategy.name)">
                                <div v-for="subStrategy in tradingStrategy.subStrategies">
                                    <SubStrategy :main="tradingStrategy.name" :sub="subStrategy.name"
                                        :subStrategies="subStrategies" :toggleSubStrategies="toggleSubStrategies"
                                        :options="subStrategy.options" :strategies="strategies" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="auth__inputarea spottradearea__buybtn">
                <button class="btn colored-btn padded-btn auth__btn" @click="automatictrade" v-if="!loading">Open Trade</button>
                <button class="btn colored-btn padded-btn dim auth__btn" v-if="loading">
                        <span class="loader-button"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import autoTradeSettingsMixin from '@/mixins/autotradesettings';
import tradingStrategiesMixin from '@/mixins/tradingstrategies';

export default {
    props: ['togglestrategiesState', 'autoTradeDetails', 'loading', 'automatictrade'],
    mixins: [autoTradeSettingsMixin, tradingStrategiesMixin]
}
</script>