export default {
    data() {
        return {
            "Moving Average Crossovers": {
                "Short-term moving average period": "50 days",
                "Long-term moving average period": "200 days"
            },
            "Channel Breakouts": {
                "Channel period": "20 days",
                "Distance from channel for breakout confirmation": "1.5% of price"
            },
            "Momentum Indicators": {
                "Look-back period": "14 days",
                "Overbought/oversold levels": "70%"
            },
            "Mean Reversion": {
                "Bollinger Bands": {
                    "Moving average period": "20 days",
                    "Number of standard deviations": 2
                },
                "Oscillators": {
                    "Overbought/oversold levels": "80%"
                }
            },
            "Arbitrage": {
                "Statistical Arbitrage": {
                    "Formation period for co-integration": "60 days",
                    "Exit threshold for mean reversion": "2% of price"
                },
                "Triangular Arbitrage": {
                    "Threshold for arbitrage opportunity": "0.5% difference in price"
                }
            },

            "High Frequency Trading (HFT)": {
                "Order Book Imbalance": {
                    "Look-back period for order book history": "10 minutes",
                    "Imbalance threshold for trade entry": "3% difference"
                }
            },

            "Market Making": {
                "Bid-ask spread target": "$0.1",
                "Inventory risk parameters": "5% of total assets"
            },

            "Fundamental Strategies": {
                "Value Investing": {
                    "P/E ratio threshold": "15 times",
                    "Debt-to-equity ratio threshold": "0.5 times"
                },
                "Growth Investing": {
                    "Year-over-year revenue growth threshold": "10%",
                    "EPS growth threshold": "$1.5"
                }
            },

            "Swing Trading": {
                "Support and Resistance Levels": {
                    "Look-back period": "30 days",
                    "Price distance from level": "$0.2"
                },
                "Technical Indicators": {
                    "Indicator specific parameters": {
                        fastPeriod: {
                            value: 12,
                            type: "integer",
                            description: "Shorter moving average period. Typically used to represent the last 12 days. Reacts quickly to recent price changes."
                        },
                        slowPeriod: {
                            value: 26,
                            type: "integer",
                            description: "Longer moving average period. Typically used to represent the last 26 days. Provides a smoother line."
                        },
                        signalPeriod: {
                            value: 9,
                            type: "integer",
                            description: "An EMA of the MACD line itself, plotted alongside the MACD line to act as a signal for buy/sell decisions."
                        }
                    }
                }
            },


            "Position Trading": {
                "Combination of long-term fundamental factors": {
                    PE_Ratio: {
                        value: 20,
                        type: "float",
                        unit: "times",
                        description: "Price-to-Earnings Ratio. Represents the valuation of a company. A higher P/E might suggest overvaluation while a lower P/E might indicate undervaluation."
                    },
                    Debt_Ratio: {
                        value: 0.4,
                        type: "float",
                        unit: "times",
                        description: "Debt Ratio. Indicates the proportion of a company's debt compared to its total assets. A lower ratio is generally preferable, indicating lower risk."
                    }
                },
                "Macro-economic indicators and trends": {
                    GDP_Growth: {
                        value: 3,
                        type: "percentage",
                        description: "Gross Domestic Product Growth. Represents the rate at which a country's economy is growing or shrinking."
                    },
                    Unemployment_Rate: {
                        value: 4,
                        type: "percentage",
                        description: "Unemployment Rate. Indicates the percentage of the workforce that is unemployed but seeking employment."
                    }
                }
            },


            "News-based Trading": {
                "Event-Driven Strategies": {
                    "Algorithmic identification of keywords or sentiment analysis": "positive",
                    "Pre-defined list of impactful news events": ["earnings report", "central bank announcement"]
                }
            },


            "Pairs Trading": {
                "Stock Pairs": {
                    "Formation period for co-integration": "30 days",
                    "Entry and exit z-score thresholds": "1 standard deviation"
                }
            },

            
            "Options and Derivatives Trading": {
                "Straddles, Strangles, Iron Condors, etc.": {
                    "Option strike prices": "$100",
                    "Option expiration dates": "2024-01-01"
                }
            },
            "Portfolio-based Strategies": {
                "Asset allocation percentages": "60% in stocks",
                "Rebalancing frequency and thresholds": "quarterly"
            }
        }

    }
}