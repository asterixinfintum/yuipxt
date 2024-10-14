<template>
    <div>
        <div class="autotradesettings__suboptions">
            <div class="autotradesettings__option sub">
                <label class="autotradesettings__option--label">Moving Average Crossovers</label>
                <div class="toggle-switch off" @click="toggleSubStrategies('Moving Average Crossovers')" :class="{
                    on: subStrategies.includes('Moving Average Crossovers')
                }">
                    <span class="toggle-switch-button" :class="{
                        off: !subStrategies.includes('Moving Average Crossovers'),
                        on: subStrategies.includes('Moving Average Crossovers')
                    }"></span>
                </div>
            </div>

            <div v-if="subStrategies.includes('Moving Average Crossovers')">
                <div class="autotradesettings__optioncontainer">
                    <div class="autotradesettings__option sub-option">
                        <label class="autotradesettings__option--label">Short-term moving average
                            period</label>
                        <div class="autotradesettings__option--inputarea">
                            <input type="number" v-model="shortTermMovingAveragePeriod" />
                        </div>
                    </div>

                    <div class="autotradesettings__slider">
                        <div class="autotradesettings__sliderbody">
                            <div class="autotradesettings__slidercontainer">
                                <div class="autotradesettings__slider">
                                    <div class="autotradesettings__slidertrack"
                                        :style="{ width: shortTermMovingAveragePeriodTrackWidth + '%' }">
                                    </div>
                                    <div class="autotradesettings__sliderthumb"
                                        :style="{ left: shortTermMovingAveragePeriodThumbPos }"></div>
                                </div>
                                <input type="range" min="0" max="100" v-model="shortTermMovingAveragePeriod"
                                    class="autotradesettings__sliderinput">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="autotradesettings__optioncontainer">
                    <div class="autotradesettings__option sub-option">
                        <label class="autotradesettings__option--label">Long-term moving average
                            period</label>
                        <div class="autotradesettings__option--inputarea">
                            <input type="number" v-model="longTermMovingAveragePeriod" />
                        </div>
                    </div>

                    <div class="autotradesettings__slider">
                        <div class="autotradesettings__sliderbody">
                            <div class="autotradesettings__slidercontainer">
                                <div class="autotradesettings__slider">
                                    <div class="autotradesettings__slidertrack"
                                        :style="{ width: longTermMovingAveragePeriodTrackWidth + '%' }">
                                    </div>
                                    <div class="autotradesettings__sliderthumb"
                                        :style="{ left: longTermMovingAveragePeriodThumbPos }"></div>
                                </div>
                                <input type="range" min="0" max="100" v-model="longTermMovingAveragePeriod"
                                    class="autotradesettings__sliderinput">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="autotradesettings__option sub">
                <label class="autotradesettings__option--label">Channel Breakouts</label>
                <div class="toggle-switch off" @click="toggleSubStrategies('Channel Breakouts')" :class="{
                    on: subStrategies.includes('Channel Breakouts')
                }">
                    <span class="toggle-switch-button" :class="{
                        off: !subStrategies.includes('Channel Breakouts'),
                        on: subStrategies.includes('Channel Breakouts')
                    }"></span>
                </div>
            </div>

            <div v-if="subStrategies.includes('Channel Breakouts')">
                <div class="autotradesettings__optioncontainer">
                    <div class="autotradesettings__option sub-option">
                        <label class="autotradesettings__option--label">Channel period</label>
                        <div class="autotradesettings__option--inputarea">
                            <input type="number" v-model="shortTermMovingAveragePeriod" />
                        </div>
                    </div>

                    <div class="autotradesettings__slider">
                        <div class="autotradesettings__sliderbody">
                            <div class="autotradesettings__slidercontainer">
                                <div class="autotradesettings__slider">
                                    <div class="autotradesettings__slidertrack"
                                        :style="{ width: shortTermMovingAveragePeriodTrackWidth + '%' }">
                                    </div>
                                    <div class="autotradesettings__sliderthumb"
                                        :style="{ left: shortTermMovingAveragePeriodThumbPos }"></div>
                                </div>
                                <input type="range" min="0" max="100" v-model="shortTermMovingAveragePeriod"
                                    class="autotradesettings__sliderinput">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="autotradesettings__optioncontainer">
                    <div class="autotradesettings__option sub-option">
                        <label class="autotradesettings__option--label">Distance from channel for breakout confirmation</label>
                        <div class="autotradesettings__option--inputarea">
                            <input type="number" v-model="longTermMovingAveragePeriod" />
                        </div>
                    </div>

                    <div class="autotradesettings__slider">
                        <div class="autotradesettings__sliderbody">
                            <div class="autotradesettings__slidercontainer">
                                <div class="autotradesettings__slider">
                                    <div class="autotradesettings__slidertrack"
                                        :style="{ width: longTermMovingAveragePeriodTrackWidth + '%' }">
                                    </div>
                                    <div class="autotradesettings__sliderthumb"
                                        :style="{ left: longTermMovingAveragePeriodThumbPos }"></div>
                                </div>
                                <input type="range" min="0" max="100" v-model="longTermMovingAveragePeriod"
                                    class="autotradesettings__sliderinput">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="autotradesettings__option sub">
                <label class="autotradesettings__option--label">Momentum Indicators</label>
                <div class="toggle-switch off">
                    <span class=" toggle-switch-button off"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'strategies',
        'subStrategies',
        'toggleSubStrategies',
        'shortTermMovingAveragePeriod',
        'shortTermMovingAveragePeriodTrackWidth',
        'shortTermMovingAveragePeriodThumbPos',
        'longTermMovingAveragePeriod',
        'longTermMovingAveragePeriodTrackWidth',
        'longTermMovingAveragePeriodThumbPos'
    ]
}
</script>