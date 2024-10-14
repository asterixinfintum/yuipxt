<template>
    <div>
        <div class="createbot">
            <div class="content">
                <HeaderBox />

                <div class="content__body">
                    <div class="container">
                        <SideNav />

                        <div class="layout-stretch">
                            <div class="tradingbots__main layout-padding">

                                <div class="balancearea row">
                                    <div class="balancearea__section main">
                                        <div class="balancearea__primarylabel">
                                            <h3 class="balancearea__primarylabel--h3">USDT Balance</h3>
                                            <span class="balancearea__primarylabel--eyesvg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    class="eye css-16vuvx8">
                                                    <path d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="currentColor">
                                                    </path>
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M6.555 6.31L1 12l5.555 5.69a7.572 7.572 0 0010.89 0L23 12l-5.555-5.69a7.572 7.572 0 00-10.89 0zM17 12a5 5 0 11-10 0 5 5 0 0110 0z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                        </div>

                                        <div class="balancearea__primarybalance">
                                            <p class="balancearea__primarybalance--btcvalue">{{ usdtBalance ? usdtBalance.balanceInBTC : 0 }} BTC</p>
                                            <span class="balancearea__primarybalance--equals">≈</span>
                                            <p class="balancearea__primarybalance--usdvalue">${{ usdtBalance ? usdtBalance.balanceInDollars : 0 }}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <h1 class="auth__h1">Create <span :style="{ textTransform: 'capitalize' }">{{ name }}</span>
                                    Bot</h1>


                                <div class="createbot__stage">
                                    <div class="auth__inputarea">
                                        <label class="auth__inputarea--label">
                                            <p>Choose a name for this Bot</p>
                                            <p>*</p>
                                        </label>
                                        <span class="auth__inputarea--input">
                                            <input v-model="name" ref="name"
                                                placeholder="example: trade bot for btc 10k strategy"
                                                class="createbot__input" :class="{ error: nameerror }" />
                                        </span>
                                        <div class="margin-bottom"></div>
                                        <label class="auth__inputarea--label">
                                            <p>Add Trading Capital (usdt)</p>
                                            <p>*</p>
                                        </label>
                                        <span class="auth__inputarea--input">
                                            <input v-model="capital" ref="capital" type="number" placeholder="example: 100"
                                                class="createbot__input" :class="{ error: capitalerror }" />
                                        </span>
                                    </div>

                                    <div class="auth__inputarea">
                                        <button class="btn colored-btn padded-btn auth__btn"
                                            @click="showStrategies">Next</button>
                                    </div>
                                </div>

                                <div class="createbot__stage" v-if="strategiesVisible && !subtypeOptions.length">
                                    <label class="auth__inputarea--label" v-if="type !== 'Smart Control'">
                                        <p>Select a strategy for this Bot</p>
                                        <p>*</p>
                                    </label>

                                    <h5 class="createbot__subtypes--h5">Unlock unparalleled profits with our cutting-edge
                                        trading bot: designed to outpace the market, even while you sleep. Profit smarter,
                                        not harder!</h5>


                                    <div class="createbot__types">
                                        <div v-for="strategy in tradingStrategies" :key="strategy.name"
                                            class="createbot__type" :class="{
                                                selected: type === strategy.name,
                                                notselected: type !== strategy.name && type.length
                                            }">


                                            <label v-if="strategy.subtypes && strategy.subtypes.length"
                                                class="createbot__type--label" @click="selectType(strategy.name)">
                                                {{ strategy.name }}
                                            </label>

                                            <label v-else class="createbot__type--label" @click="selectType(strategy.name)">
                                                {{ strategy.name }}
                                            </label>

                                            <div class="createbot__subtypes"
                                                v-if="type === strategy.name && strategy.name !== 'Smart Control'">
                                                <h4 class="createbot__subtypes--h4">Select strategy type in {{ type }}:</h4>
                                                <div v-for="subStrategy in strategy.subStrategies" :key="subStrategy.name"
                                                    class="createbot__subtype"
                                                    @click="selectSubtype(subStrategy.name, subStrategy.options)"
                                                    :class="{ selected: subtype === subStrategy.name }">
                                                    {{ subStrategy.name }}
                                                </div>
                                            </div>

                                            <div class="createbot__subtypes"
                                                v-if="type === strategy.name && strategy.name === 'Smart Control'">
                                                <h4 class="createbot__subtypes--h4">The strategies and configurations are
                                                    selected and configured for you automatically to maximize profit and
                                                    minimize loss. Best for newbies and intermidiate market participants
                                                </h4>
                                            </div>

                                        </div>
                                    </div>

                                    <button class="btn padded-btn auth__btn greyed-btn" @click="backToNameInput"
                                        v-if="!type.length && !subtype.length">Back</button>

                                    <div class="auth__inputarea">
                                        <button class="btn padded-btn auth__btn greyed-btn" v-if="type.length"
                                            @click="unselectType">Back</button>
                                        <div class="margin-bottom"></div>
                                        <button class="btn padded-btn auth__btn colored-btn"
                                            v-if="type.length && type === 'Smart Control'" @click="triggerCreateBot">Create
                                            Trading Bot</button>
                                        <button class="btn padded-btn auth__btn colored-btn dim" v-if="type.length && loading"><span class="loader-button"></span></button>
                                    </div>
                                </div>


                                <div class="createbot__stage" v-if="subtypeOptions.length && subtype.length">

                                    <h3 class="createbot__subtypes--h3">{{ type }} Settings</h3>
                                    <h4 class="createbot__subtypes--h4 subtypeoptions">{{ subtype }} for {{ type }}</h4>

                                    <div class="createbot__subtypeoptions">

                                        <div v-if="type === 'Trend Following'">

                                            <div v-if="subtype === 'Moving Average Crossovers'">
                                                <h5 class="createbot__subtypes--h5">Short-term moving average period: (days)
                                                </h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="shortTermMovingAveragePeriod" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Long-term moving average period: (days)
                                                </h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="longTermMovingAveragePeriod" />
                                                </div>
                                            </div>

                                            <div v-if="subtype === 'Channel Breakouts'">
                                                <h5 class="createbot__subtypes--h5">Channel period: (days)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="channelPeriod" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Distance from channel for breakout
                                                    confirmation: (% of price)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="0.3" max="100" step="0.1"
                                                            v-model="distanceFromChannelForBreakoutConfirmation" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ distanceFromChannelForBreakoutConfirmation }}%</p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div v-if="subtype === 'Momentum Indicators'">
                                                <h5 class="createbot__subtypes--h5">Look-back period: (days)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="lookBackPeriod" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Overbought/oversold levels: (% of price)
                                                </h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="0.3" max="100" step="0.1"
                                                            v-model="overboughtOversoldLevels" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ overboughtOversoldLevels }}%</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div v-if="type === 'Mean Reversion'">

                                            <div v-if="subtype === 'Bollinger Bands'">
                                                <h5 class="createbot__subtypes--h5">Moving average period: (days)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="movingAveragePeriod" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Number of standard deviations: (% of
                                                    price)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="numberOfStandardDeviations" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ numberOfStandardDeviations }}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div v-if="subtype === 'Oscillators'">
                                                <h5 class="createbot__subtypes--h5">Overbought/oversold levels</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="overboughtOversoldLevels" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ overboughtOversoldLevels }}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'Arbitrage'">

                                            <div v-if="subtype === 'Statistical Arbitrage'">
                                                <h5 class="createbot__subtypes--h5">Formation period for co-integration:
                                                    (days)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="formationPeriodForCoIntegration" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Exit threshold for mean reversion: (% of
                                                    price)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="exitThresholdForMeanReversion" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ exitThresholdForMeanReversion }}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="subtype === 'Triangular Arbitrage'">
                                                <h5 class="createbot__subtypes--h5">Threshold for arbitrage opportunity (%
                                                    difference in price)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="thresholdForArbitrageOpportunity" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ thresholdForArbitrageOpportunity }}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'High Frequency Trading (HFT)'">

                                            <div v-if="subtype === 'Order Book Imbalance'">
                                                <h5 class="createbot__subtypes--h5">Look-back period for order book history
                                                    (minutes)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="formationPeriodForCoIntegration" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Imbalance threshold for trade entry (%
                                                    difference)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="imbalanceThresholdForTradeEntry" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ imbalanceThresholdForTradeEntry }}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'Market Making'">
                                            <div v-if="subtype === 'General Parameters'">
                                                <h5 class="createbot__subtypes--h5">Bid-ask spread target ($)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="bidAskSpreadTarget" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Inventory risk parameters (% of total
                                                    assets)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="inventoryRiskParameters" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ inventoryRiskParameters }}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="type === 'Fundamental Strategies'">

                                            <div v-if="subtype === 'Value Investing'">
                                                <h5 class="createbot__subtypes--h5">P/E ratio threshold</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100" v-model="peRatioThreshold"
                                                            step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ peRatioThreshold }} times</p>
                                                    </div>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Debt-to-equity ratio threshold</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="debtToEquityRatioThreshold" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ debtToEquityRatioThreshold }} times</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="subtype === 'Growth Investing'">
                                                <h5 class="createbot__subtypes--h5">Year-over-year revenue growth threshold
                                                    (%)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="yearOverYearRevenueGrowthThreshold" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ yearOverYearRevenueGrowthThreshold }} times</p>
                                                    </div>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">EPS growth threshold ($)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100" v-model="epsGrowthThreshold"
                                                            step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ epsGrowthThreshold }} times</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'Swing Trading'">

                                            <div v-if="subtype === 'Support and Resistance Levels'">
                                                <h5 class="createbot__subtypes--h5">Look-back period (days)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="lookBackPeriod" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Price distance from level ($)</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="priceDistanceFromLevel" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>${{ priceDistanceFromLevel }}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div v-if="subtype === 'Technical Indicators'">
                                                <h5 class="createbot__subtypes--h5">Indicator specific parameters</h5>

                                                <h5 class="createbot__subtypes--h5">Shorter moving average period. Typically
                                                    used to represent the last 12 days. Reacts quickly to recent price
                                                    changes</h5>

                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="indicatorSpecificParameters.fastPeriod" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>Fast Period: {{ indicatorSpecificParameters.fastPeriod }}</p>
                                                    </div>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Longer moving average period. Typically
                                                    used to represent the last 26 days. Provides a smoother line.</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="indicatorSpecificParameters.slowPeriod" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>SlowPeriod: {{ indicatorSpecificParameters.slowPeriod }}</p>
                                                    </div>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">An EMA of the MACD line itself, plotted
                                                    alongside the MACD line to act as a signal for buy/sell decisions.</h5>

                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="indicatorSpecificParameters.signalPeriod" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>Signal Period: {{ indicatorSpecificParameters.signalPeriod }}</p>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                        <div v-if="type === 'Position Trading'">
                                            <div v-if="subtype === 'General Parameters'">
                                                <h5 class="createbot__subtypes--h5">Long-term factors</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="longTermFactors.PE_Ratio" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ longTermFactors.PE_Ratio }} times</p>
                                                    </div>
                                                </div>

                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="longTermFactors.Debt_Ratio" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ longTermFactors.Debt_Ratio }} times</p>
                                                    </div>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Macro-economic indicators and trends
                                                </h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="macroEconomicIndicators.GDP_Growth" step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ macroEconomicIndicators.GDP_Growth }}%</p>
                                                    </div>
                                                </div>

                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100"
                                                            v-model="macroEconomicIndicators.Unemployment_Rate"
                                                            step="0.1" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ macroEconomicIndicators.Unemployment_Rate }}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="type === 'News-based Trading'">

                                            <div v-if="subtype === 'Event-Driven'">
                                                <h5 class="createbot__subtypes--h5">Algorithmic identification of keywords
                                                    or sentiment analysis: (Positive, Negative)</h5>
                                                <div class="createbot__textinput auth__inputarea--input">
                                                    <input type="text" v-model="keywordSentimentIdentification" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Pre-defined list of impactful news
                                                    events": ("earnings report", "central bank announcement")</h5>
                                                <div class="createbot__textarea">
                                                    <textarea rows="4" cols="50" placeholder="List events here..."
                                                        v-model="impactfulNewsEventsList"></textarea>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'Pairs Trading'">

                                            <div v-if="subtype === 'Stock Pairs'">
                                                <h5 class="createbot__subtypes--h5">Formation period for co-integration</h5>
                                                <div class="createbot__sliderinput">
                                                    <div class="createbot__sliderinput--inputarea">
                                                        <input type="range" min="1" max="100" v-model="formationPeriod" />
                                                    </div>
                                                    <div class="createbot__sliderinput--valuearea">
                                                        <p>{{ formationPeriod }} days</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div v-if="type === 'Options and Derivatives Trading'">
                                            <div v-if="subtype === 'Options Strategies'">
                                                <h5 class="createbot__subtypes--h5">Straddles, Strangles, Iron Condors, etc.
                                                </h5>

                                                <h5 class="createbot__subtypes--h5">Option strike prices. ($)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" v-model="optionStrikePrices" />
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Option expiration date (2024-01-01)</h5>
                                                <div
                                                    class="createbot__textinput auth__inputarea--input createbot__inputarea">
                                                    <input type="number" placeholder="2024-01-01"
                                                        v-model="optionExpirationDates" />
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="type === 'Portfolio-based Strategies'">

                                            <div v-if="subtype === 'Portfolio Composition'">

                                                <h5 class="createbot__subtypes--h5">Asset allocation percentages": "eg 60%
                                                    in stocks. 10% in crypto etc ($)</h5>
                                                <div class="createbot__textarea">
                                                    <textarea rows="4" cols="50"
                                                        placeholder="Asset allocation percentages list instructions here..."
                                                        v-model="assetAllocationPercentages"></textarea>
                                                </div>

                                                <h5 class="createbot__subtypes--h5">Rebalancing frequency and thresholds
                                                    (Daily, Monthly, Quarterly, Semi-annually, Annually, Biennially,
                                                    Percentage Deviation, Absolute Deviation, Hybrid, Opportunistic
                                                    Rebalancing, Never/Static)
                                                </h5>
                                                <div class="createbot__textinput auth__inputarea--input">
                                                    <input type="text" v-model="rebalancingFrequencyAndThresholds"
                                                        placeholder="Rebalancing frequency" />
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div class="auth__inputarea">
                                        <button class="btn padded-btn auth__btn greyed-btn" v-if="type.length"
                                            @click="unSelectSubtype">Back</button>
                                    </div>

                                    <button class="btn padded-btn auth__btn colored-btn" v-if="type.length && !loading"
                                        @click="triggerCreateBot">Create Trading Bot</button>

                                    <button class="btn padded-btn auth__btn colored-btn dim" v-if="type.length && loading"><span class="loader-button"></span></button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import createbotMixin from '@/mixins/createbot';
import walletMixin from '@/mixins/wallet';
import listMixin from '@/mixins/list';

export default {
    mixins: [createbotMixin, walletMixin, listMixin],
    data() {
        return {
            wallettype: "bot trading"
        }
    }
}
</script>
