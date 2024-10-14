<template>
    <div class="assetheader">
        <div class="assetheader__top">
            <div class="assetheader__toparea">
                <div class="assetheader__labelarea">
                    <p>{{ }}</p>
                    <!-- <label>
                        <svg focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                            viewBox="0 0 1024 1024" data-icon="StarFilled"
                            class="sc-aXZVg ktFCMi mx-icon iconfont icondefault" data-v-f823e94e="">
                            <path
                                d="M908.096 353.088l-253.888-36.864-113.536-230.08a32.128 32.128 0 0 0-57.408 0L369.792 316.16l-253.888 36.864a32 32 0 0 0-17.728 54.656l183.68 179.072-43.392 252.864a32 32 0 0 0 46.4 33.728L512 753.984l227.072 119.424a32 32 0 0 0 46.4-33.728l-43.392-252.864 183.68-179.072a31.936 31.936 0 0 0-17.664-54.656z"
                                data-v-f823e94e=""></path>
                        </svg>
                    </label>-->
                </div>
                <span class="opacity-low">{{ asset.displayName }}</span>
            </div>
            <div class="assetheader__toparea">
                <div class="assetheader__toparea--percent blue">
                    <span v-if="currentpair.assettype !== 'commodity'">{{ asset.price }}</span>
                    <span v-if="currentpair.assettype === 'commodity'">{{ asset.price }}</span>
                    <!--<span class="nomargin">+2.43%</span>-->
                </div>
                <span class="opacity-low" v-if="currentpair.assettype !== 'commodity'">${{ asset.price }}</span>
                <span class="opacity-low" v-if="currentpair.assettype === 'commodity'">${{ asset.price }}</span>
            </div>
            <div class="assetheader__toparea" v-if="currentpair.assettype !== 'commodity'">
                <span class="opacity-low green">24h High</span>
                <span class="green">${{ asset.price }}</span>
            </div>
            <div class="assetheader__toparea" v-if="currentpair.assettype !== 'commodity'">
                <span class="opacity-low red">24h Low</span>
                <span class="red">${{ asset.price }}</span>
            </div>
            <div class="assetheader__toparea" v-if="currentpair.assettype !== 'commodity'">
                <span class="opacity-low">Daily change</span>
                <span>{{ percentageChange( currentpair.values[1].high, currentpair.values[0].high) }}</span>
            </div>
        </div>
        <div class="assetheader__bottom">
            <span class="assetheader__bottom--nav current">Chart</span>
            <!--<span class="assetheader__bottom--nav">Asset info</span>-->
        </div>
    </div>
</template>

<script>
export default {
    props: ['asset', 'currentpair'],
    methods: {
        percentageChange(oldValue, newValue) {
            if (oldValue === 0) {
                throw new Error("Old value cannot be zero when calculating percentage change.");
            }
            let change = newValue - oldValue;
            let percentage = (change / oldValue) * 100;
            return percentage;
        }
    }
}
</script>

<style lang="scss" scoped>
.assetheader {

    &__top {
        @include flex-align;
        border-bottom: $border;
        padding-left: #{scaleValue(11)};
        padding-bottom: #{scaleValue(11)};
    }

    &__toparea {
        display: flex;
        flex-direction: column;
        margin-right: #{scaleValue(18)};
        font-size: #{scaleValue(13)};

        & span {
            display: inline-block;

            &:nth-child(2) {
                font-size: #{scaleValue(11)};
                margin-top: #{scaleValue(7)};
            }

            &.nomargin {
                margin: 0;
            }
        }
    }

    &__labelarea {
        @include flex-align;

        & label {
            display: inline-block;
            margin-left: #{scaleValue(5)};

            & svg {
                height: #{scaleValue(11)};
                width: #{scaleValue(11)};
                transform: translateY(2px);
            }
        }
    }

    &__bottom {
        @include flex-align;
        border-bottom: $border;
        padding: #{scaleValue(11)} 0;
        padding-left: #{scaleValue(11)};

        &--nav {
            display: inline-block;
            margin-right: #{scaleValue(25)};
            cursor: pointer;
            font-size: #{scaleValue(13)};

            &.current {
                color: $primary-color;
                font-weight: 600;
            }
        }
    }
}

.opacity-low {
    opacity: .5;
    font-weight: 400;
    font-size: #{scaleValue(11)};
}

.green {
    color: $green;
}

.red {
    color: $red;
}

.blue {
    color: $primary-color
}
</style>