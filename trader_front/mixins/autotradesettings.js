import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            strategies: [],
            subStrategies: [],
            shortTermMovingAveragePeriod: 0,
            longTermMovingAveragePeriod: 0,
            channelPeriod: 0,
            distanceFromChannelForBreakoutConfirmation: 0
        }
    },
    methods: {
        ...mapActions('order', ['removeStrategy']),
        toggleStrategies(strategy) {
            if (this.strategies.includes(strategy)) {
                const strategies = [...this.strategies];
                const strategiesFilter = strategies.filter(strat => strat !== strategy);
                this.strategies = [...strategiesFilter];

                const { autotradestrategies, removeStrategy } = this;
                const autotradestrategiesCopy = [...autotradestrategies];
                const filter = autotradestrategiesCopy.filter(item => item.strategy !== strategy);

                removeStrategy(filter);
            } else {
                const strategies = this.strategies;
                strategies.push(strategy);
                this.strategies = strategies;
            }
        },
        toggleSubStrategies(substrategy) {
            if (this.subStrategies.includes(substrategy)) {
                const subStrategies = this.subStrategies;
                subStrategies.pop(substrategy);
                this.subStrategies = subStrategies;
            } else {
                const subStrategies = this.subStrategies;
                subStrategies.push(substrategy);
                this.subStrategies = subStrategies;
            }
        }
    },
    computed: {
        ...mapState({
            autotradestrategies: state => state.order.autotradestrategies
        }),
        shortTermMovingAveragePeriodTrackWidth() {
            const { shortTermMovingAveragePeriod } = this;
            return (shortTermMovingAveragePeriod / 100) * 100;
        },
        shortTermMovingAveragePeriodThumbPos() {
            return this.shortTermMovingAveragePeriod;
        },
        longTermMovingAveragePeriodTrackWidth() {
            const { longTermMovingAveragePeriod } = this;
            return (longTermMovingAveragePeriod / 100) * 100;
        },
        longTermMovingAveragePeriodThumbPos() {
            return this.longTermMovingAveragePeriod;
        },
        channelPeriodWidth() {
            const { channelPeriod } = this;
            return (channelPeriod / 100) * 100

        },
        channelPeriodThumbPos() {
            return this.channelPeriod
        },
        distanceFromChannelForBreakoutConfirmationWidth() {
            const { distanceFromChannelForBreakoutConfirmation } = this;
            return (distanceFromChannelForBreakoutConfirmation / 100) * 100; 
        },
        distanceFromChannelForBreakoutConfirmationThumbPos() {
            return this.distanceFromChannelForBreakoutConfirmation;
        }
    }
}