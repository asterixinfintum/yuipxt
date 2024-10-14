export default {
    data() {
        return {
            tradingStrategies: [
                {
                    name: "Trend Following",
                    subStrategies: [
                        {
                            name: "Moving Average Crossovers",
                            options: [
                                "Short-term moving average period",
                                "Long-term moving average period"
                            ]
                        },
                        {
                            name: "Channel Breakouts",
                            options: ["Channel period", "Distance from channel for breakout confirmation"]
                        },
                        {
                            name: "Momentum Indicators",
                            options: ["Look-back period", "Overbought/oversold levels"]
                        }
                    ]
                },
                {
                    name: "Mean Reversion",
                    subStrategies: [
                        {
                            name: "Bollinger Bands",
                            options: ["Moving average period", "Number of standard deviations"]
                        },
                        {
                            name: "Oscillators",
                            options: ["Overbought/oversold levels"]
                        }
                    ]
                },
                {
                    name: "Arbitrage",
                    subStrategies: [
                        {
                            name: "Statistical Arbitrage",
                            options: ["Formation period for co-integration", "Exit threshold for mean reversion"]
                        },
                        {
                            name: "Triangular Arbitrage",
                            options: ["Threshold for arbitrage opportunity"]
                        }
                    ]
                },

                {
                    name: "High Frequency Trading (HFT)",
                    subStrategies: [
                        {
                            name: "Order Book Imbalance",
                            options: ["Look-back period for order book history", "Imbalance threshold for trade entry"]
                        }
                    ]
                },

                {
                    name: "Market Making",
                    subStrategies: [
                        {
                            name: "General Parameters",
                            options: ["Bid-ask spread target", "Inventory risk parameters"]
                        }
                    ]
                },

                {
                    name: "Fundamental Strategies",
                    subStrategies: [
                        {
                            name: "Value Investing",
                            options: ["P/E ratio threshold", "Debt-to-equity ratio threshold"]
                        },
                        {
                            name: "Growth Investing",
                            options: ["Year-over-year revenue growth threshold", "EPS growth threshold"]
                        }
                    ]
                },


                {
                    name: "Swing Trading",
                    subStrategies: [
                        {
                            name: "Support and Resistance Levels",
                            options: ["Look-back period", "Price distance from level"]
                        },
                        {
                            name: "Technical Indicators",
                            options: ["Indicator specific parameters"]
                        }
                    ]
                },
                {
                    name: "Position Trading",
                    subStrategies: [
                        {
                            name: "General Parameters",
                            options: ["Long-term factors", "Macro-economic indicators"]
                        }
                    ]
                },
                {
                    name: "News-based Trading",
                    subStrategies: [
                        {
                            name: "Event-Driven",
                            options: ["Keyword/sentiment identification", "Impactful news events list"]
                        }
                    ]
                },


                {
                    name: "Pairs Trading",
                    subStrategies: [
                        {
                            name: "Stock Pairs",
                            options: ["Formation period", "Entry and exit z-score thresholds"]
                        }
                    ]
                },
                {
                    name: "Options and Derivatives Trading",
                    subStrategies: [
                        {
                            name: "Options Strategies",
                            options: ["Option strike prices", "Option expiration dates"]
                        }
                    ]
                },
                {
                    name: "Portfolio-based Strategies",
                    subStrategies: [
                        {
                            name: "Portfolio Composition",
                            options: ["Asset allocation percentages", "Rebalancing frequency and thresholds"]
                        }
                    ]
                }
            ]
        }
    }
}