export default {
    data() {
        return {
            shortTermMovingAveragePeriod: null,
            longTermMovingAveragePeriod: null,
            channelPeriod: null,
            distanceFromChannelForBreakoutConfirmation: 0,
            lookBackPeriod: null,
            overboughtOversoldLevels: 0,
            movingAveragePeriod: null,
            numberOfStandardDeviations: 0,
            formationPeriodForCoIntegration: null,
            exitThresholdForMeanReversion: 0,
            thresholdForArbitrageOpportunity: 0,
            lookBackPeriodForOrderBookHistory: null,
            imbalanceThresholdForTradeEntry: 0,
            bidAskSpreadTarget: null,
            inventoryRiskParameters: 0,
            peRatioThreshold: 0,
            debtToEquityRatioThreshold: 0,
            yearOverYearRevenueGrowthThreshold: 0,
            epsGrowthThreshold: 0,
            lookBackPeriod: null,
            priceDistanceFromLevel: 0,
            indicatorSpecificParameters: {
                fastPeriod: 0,
                slowPeriod: 0,
                signalPeriod: 0
            },
            longTermFactors: {
                PE_Ratio: 0,
                Debt_Ratio: 0
            },
            macroEconomicIndicators: {
                GDP_Growth: 0,
                Unemployment_Rate: 0
            },
            keywordSentimentIdentification: 'Positive',
            impactfulNewsEventsList: '',
            formationPeriod: 0,
            optionStrikePrices: null,
            optionExpirationDates: null,
            assetAllocationPercentages: null,
            rebalancingFrequencyAndThresholds: null
        }
    }
} 