<template>
  <div>
    <div class="trader">
      <div class="trader__content">
        <TraderHeader />

        <div class="trader__container">
          <div class="trader__container--content">
            <div class="trader__leftcontainer">
              <div class="trader__pairheader" v-if="currentpair">
                <div class="trader__pairheader--pair">
                  <div class="trader__pairheader--pairdetails">
                    <span>{{ currentpair.pair }}</span>
                    <!--<span>Asset details</span>-->
                  </div>

                  <div class="trader__pairheader--paircategory">
                    {{ currentpair.lefttype }}/{{ currentpair.righttype }}
                  </div>
                </div>

                <div class="trader__pairheader--area">
                  <div class="trader__pairheader--righter">
                    <span class="pairvalue" v-if="pairprice">{{
                      pairprice.toFixed(4)
                    }}</span>
                    <span class="assetprice">${{ baseassetpriceUSD }}</span>
                  </div>

                  <!--<div class="trader__pairheader--righter">
                    <span class="label">24h Change</span>
                    <span class="value">-0.00087 -1.74%</span>
                  </div>-->

                  <div class="trader__pairheader--righter">
                    <span class="label">24h High</span>
                    <span class="value">{{ baseassethigh }}</span>
                  </div>

                  <div class="trader__pairheader--righter">
                    <span class="label">24h Low</span>
                    <span class="value">{{ baseassetlow }}</span>
                  </div>

                  <div class="trader__pairheader--righter">
                    <span class="label">24h Volume({{ currentpair.left }})</span>
                    <span class="value">{{ baseassetvol }}</span>
                  </div>

                  <div class="trader__pairheader--righter">
                    <span class="label">24h Volume({{ currentpair.right }})</span>
                    <span class="value">{{ quoteassetvol }}</span>
                  </div>
                </div>
              </div>

              <div class="trader__leftarea">
                <div class="trader__orders">
                  <div class="trader__orders--menu"></div>
                  <div class="trader__orders--header" v-if="currentpair">
                    <span>Price({{ currentpair.right }})</span>
                    <span>Amount({{ currentpair.left }})</span>
                    <span>Total</span>
                  </div>
                  <div class="trader__orders--orderslist">
                    <div class="trader__orders--order sell" v-for="order in sells">
                      <span class="price">{{ order.price }}</span>
                      <span class="amount">{{ order.amount }}</span>
                      <span class="tomeortotal">{{ order.total }}</span>

                      <div
                        class="trader__orders--colorcode"
                        :style="{
                          background: '#f6465d',
                          width: `${order.hierarchyPercentage}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="trader__orders--figures" v-if="currentpair">
                    <span class="assetunit" v-if="pairprice">{{
                      pairprice.toFixed(4)
                    }}</span>
                    <span></span>
                    <span class="usd">${{ baseassetpriceUSD }}</span>
                  </div>
                  <div class="trader__orders--orderslist">
                    <div class="trader__orders--order buy" v-for="order in buys">
                      <span class="price">{{ order.price }}</span>
                      <span class="amount">{{ order.amount }}</span>
                      <span class="tomeortotal">{{ order.total }}</span>

                      <div
                        class="trader__orders--colorcode"
                        :style="{
                          background: '#0ecb81',
                          width: `${order.hierarchyPercentage}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="trader__tradearea">
                  <div class="trader__graph" v-if="currentpair">
                    <TradingViewGraph :currentpair="currentpair" />
                  </div>

                  <div class="trader__ordercreator">
                    <div class="trader__submitting" v-if="submittingtrade">
                      <div class="slideup__submitting">
                        <div class="slideup__submitting--loading">
                          <span class="arrow left">
                            <svg
                              viewBox="0 0 24 24"
                              focusable="false"
                              class="chakra-icon css-onkibi"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                              ></path>
                            </svg>
                          </span>
                          <span class="arrow right">
                            <svg
                              viewBox="0 0 24 24"
                              focusable="false"
                              class="chakra-icon css-onkibi"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                              ></path>
                            </svg>
                          </span>
                        </div>

                        <div class="slideup__submitting--header">
                          <h3>Submitting trade</h3>
                        </div>

                        <div class="slideup__submitting--details">
                          <p>Creating trade for {{ currentpair.pair }}</p>
                        </div>
                      </div>
                    </div>

                    <div class="trader__submitting" v-if="submittedtrade">
                      <div class="slideup__submitting">
                        <div class="slideup__submitting--header">
                          <div class="slideup__confirm--header">
                            <span class="back" @click="() => (submittedtrade = false)">
                              <svg
                                viewBox="0 0 24 24"
                                focusable="false"
                                class="chakra-icon css-onkibi"
                                aria-hidden="true"
                              >
                                <path
                                  fill="currentColor"
                                  d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                                ></path>
                              </svg>
                            </span>
                            <h3 class="h3"></h3>
                            <span></span>
                          </div>
                          <h3>Trade order executed</h3>
                        </div>
                      </div>
                    </div>

                    <div class="trader__ordercreator--tradetypes">
                      <span
                        :class="{ current: tradetype === 'spot' }"
                        @click="toggletradetype('spot')"
                        >Spot</span
                      >
                      <span
                        :class="{ current: tradetype === 'margin' }"
                        @click="toggletradetype('margin')"
                        >Margin</span
                      >
                      <span
                        :class="{ current: tradetype === 'automatic' }"
                        @click="toggletradetype('automatic')"
                        >Automatic (AI)</span
                      >
                    </div>

                    <div
                      class="trader__ordercreator--ordertypes"
                      v-if="tradetype !== 'automatic'"
                    >
                      <div
                        class="trader__ordercreator--ordertype"
                        :class="{ current: ordertype === 'Limit' }"
                        @click.stop="toggleordertype('Limit')"
                      >
                        <label>Limit</label>
                      </div>
                      <div
                        class="trader__ordercreator--ordertype"
                        :class="{ current: ordertype === 'Market' }"
                        @click.stop="toggleordertype('Market')"
                      >
                        <label>Market</label>
                      </div>
                      <div
                        class="trader__ordercreator--ordertype"
                        :class="{ current: ordertype === 'Stop-limit' }"
                        @click.stop="toggleordertype('Stop-limit')"
                      >
                        <label>Stop-limit</label>
                        <span class="teacher">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            class="css-1sf5jdr"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M12 21a9 9 0 100-18 9 9 0 000 18zM10.75 8.5V6h2.5v2.5h-2.5zm0 9.5v-7h2.5v7h-2.5z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <div class="trader__ordercreator--teacher">
                          to buy or sell an asset once the asset reaches a specified price
                        </div>
                      </div>
                    </div>

                    <div
                      class="trader__ordercreator--forms"
                      v-if="tradetype === 'automatic'"
                    >
                      <div class="trader__ordercreator--form">
                        <div class="trader__ordercreator--blc">
                          <span class="Avbl">Avbl</span>
                          <span class="asset"
                            >{{ baseassetblc }} {{ baseassetinitials }}</span
                          >
                        </div>

                        <div class="trader__ordercreator--input">
                          <span class="label">Total</span>
                          <input
                            class="trade-input"
                            type="number"
                            v-model="totalautomatic"
                          />
                          <span class="assetlabel">{{ baseassetinitials }}</span>
                        </div>

                        <div class="trader__ordercreator--range">
                          <input
                            type="range"
                            id="myRange"
                            min="0"
                            max="100"
                            v-model.number="automaticrange"
                          />
                        </div>

                        <button
                          class="trader__ordercreator--button colored-btn"
                          :class="{ dim: !allowautomaticordercreation }"
                          @click="createorder('automatic')"
                        >
                          Open Automatic Trade with {{ baseassetinitials }}
                        </button>

                        <div class="trader__ordercreator--disclaimer">
                          <div class="trader__ordercreator--disclaimertext">
                            <p>
                              TradeX Quant is an innovative AI trading platform aimed at
                              enhancing your market analysis and decision-making process.
                              Please be aware that all investments carry inherent risks
                              and the value of your investments can go up as well as down.
                              We do not assume liability for any losses incurred due to
                              market fluctuations or investment decisions made based on
                              the software's analytics. We strongly recommend consulting
                              with a financial advisor to tailor your investment strategy
                              to your individual risk
                            </p>
                          </div>
                        </div>

                        <div class="trader__ordercreator--disclaimer understand">
                          <div class="trader__ordercreator--checkbox">
                            <input type="checkbox" v-model="automatictradetermsagreed" />
                          </div>
                          <div class="trader__ordercreator--disclaimertext">
                            <p>I understand</p>
                          </div>
                        </div>
                      </div>

                      <div class="trader__ordercreator--form">
                        <h4 class="trader__ordercreator--h4">
                          <span></span>
                          <span>Parameters</span>
                          <span></span>
                        </h4>

                        <div class="trader__ordercreator--disclaimertext">
                          <p>
                            Parameter options are automatically generated based on
                            technical analysis of the symbol price
                          </p>
                        </div>

                        <div class="trader__ordercreator--parameters">
                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Time Period:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('3D') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Time Period',
                                    option: '3D',
                                  })
                                "
                                >3D</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('7D') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Time Period',
                                    option: '7D',
                                  })
                                "
                                >7D</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('30D') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Time Period',
                                    option: '30D',
                                  })
                                "
                                >30D</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('180D') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Time Period',
                                    option: '180D',
                                  })
                                "
                                >180D</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Risk Tolerance:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('Conservative') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Risk Tolerance',
                                    option: 'Conservative',
                                  })
                                "
                                >Conservative</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Moderate') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Risk Tolerance',
                                    option: 'Moderate',
                                  })
                                "
                                >Moderate</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Aggressive') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Risk Tolerance',
                                    option: 'Aggressive',
                                  })
                                "
                                >Aggressive</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Investment Goals:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('Short-Term Gains') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Investment Goals',
                                    option: 'Short-Term Gains',
                                  })
                                "
                                >Short-Term Gains</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Long-Term Wealth') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Investment Goals',
                                    option: 'Long-Term Wealth',
                                  })
                                "
                                >Long-Term Wealth</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Income Stream') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Investment Goals',
                                    option: 'Income Stream',
                                  })
                                "
                                >Income</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Financial Health:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('Income') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Financial Health',
                                    option: 'Income',
                                  })
                                "
                                >Income</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Savings') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Financial Health',
                                    option: 'Savings',
                                  })
                                "
                                >Savings</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Debt') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Financial Health',
                                    option: 'Debt',
                                  })
                                "
                                >Debt</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Data Analysis:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('Real-Time') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Data Analysis',
                                    option: 'Real-Time',
                                  })
                                "
                                >Real-Time</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Historical') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Data Analysis',
                                    option: 'Historical',
                                  })
                                "
                                >Historical</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Trend Analysis:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('Daily') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Trend Analysis',
                                    option: 'Daily',
                                  })
                                "
                                >Daily</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Weekly') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Trend Analysis',
                                    option: 'Weekly',
                                  })
                                "
                                >Weekly</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Monthly') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Trend Analysis',
                                    option: 'Monthly',
                                  })
                                "
                                >Monthly</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Yearly') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Trend Analysis',
                                    option: 'Yearly',
                                  })
                                "
                                >Yearly</span
                              >
                            </div>
                          </div>

                          <div class="trader__ordercreator--parameter">
                            <div class="trader__ordercreator--parameterlabel">
                              <label>Sentiment Analysis:</label>
                            </div>

                            <div class="trader__ordercreator--parameteroptions">
                              <span
                                :class="{ chosen: parameterchosen('News') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Sentiment Analysis',
                                    option: 'News',
                                  })
                                "
                                >News</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Social Media') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Sentiment Analysis',
                                    option: 'Social Media',
                                  })
                                "
                                >Social Media</span
                              >
                              <span
                                :class="{ chosen: parameterchosen('Financial Reports') }"
                                @click="
                                  selectAutoTradeParameter({
                                    label: 'Sentiment Analysis',
                                    option: 'Financial Reports',
                                  })
                                "
                                >Financial Reports</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="trader__ordercreator--forms"
                      v-if="tradetype !== 'automatic'"
                    >
                      <div class="trader__ordercreator--form">
                        <div class="trader__ordercreator--blc">
                          <span class="Avbl">Avbl</span>
                          <span class="asset"
                            >{{ quoteassetblc }} {{ quoteassetinitials }}</span
                          >
                        </div>

                        <div>
                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype === 'Stop-limit'"
                          >
                            <span class="label">Stop</span>
                            <input class="trade-input" type="number" v-model="buystop" />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            :class="{ disabled: ordertype === 'Market' }"
                          >
                            <span class="label">{{
                              ordertype === "Stop-limit" ? "Limit" : "Price"
                            }}</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="buyprice"
                              v-if="ordertype !== 'Market'"
                            />
                            <input
                              class="trade-input disabled"
                              type="text"
                              disabled
                              v-model="marketlabel"
                              v-if="ordertype === 'Market'"
                            />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype !== 'Market'"
                          >
                            <span class="label">Amount</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="buyamount"
                            />
                            <span class="assetlabel">{{ baseassetinitials }}</span>
                          </div>

                          <div class="trader__ordercreator--range">
                            <input
                              type="range"
                              id="myRange"
                              min="0"
                              max="100"
                              v-model.number="buyrange"
                            />
                          </div>

                          <div class="trader__ordercreator--input">
                            <span class="label">Total</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="totalbuy"
                              @input="handleBuyInput"
                              @focus="handleBuyTotalFocus"
                              @blur="handleBuyTotalBlur"
                            />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div class="trader__ordercreator--buydetails">
                            <div class="trader__ordercreator--buydetail">
                              <label>Max Buy</label>
                              <span
                                >0
                                <span class="assetlabel">{{
                                  baseassetinitials
                                }}</span></span
                              >
                            </div>
                            <div class="trader__ordercreator--buydetail">
                              <label>Est.Fee</label>
                              <span
                                >{{
                                  parseFloat(baseassetblc) > 0
                                    ? parseFloat(baseassetblc) * 0.005
                                    : 0
                                }}
                                {{ baseassetinitials }}</span
                              >
                            </div>
                          </div>

                          <button
                            class="trader__ordercreator--button buy"
                            :class="{ dim: !allowbuyordercreation }"
                            @click="createorder('buy')"
                          >
                            Buy {{ baseassetinitials }}
                          </button>
                        </div>
                      </div>

                      <div class="trader__ordercreator--form">
                        <div class="trader__ordercreator--blc">
                          <span class="Avbl">Avbl</span>
                          <span class="asset"
                            >{{ baseassetblc }} {{ baseassetinitials }}
                          </span>
                        </div>

                        <div>
                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype === 'Stop-limit'"
                          >
                            <span class="label">Stop</span>
                            <input class="trade-input" type="number" v-model="sellstop" />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            :class="{ disabled: ordertype === 'Market' }"
                          >
                            <span class="label">{{
                              ordertype === "Stop-limit" ? "Limit" : "Price"
                            }}</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="sellprice"
                              v-if="ordertype !== 'Market'"
                            />
                            <input
                              class="trade-input disabled"
                              type="text"
                              disabled
                              v-model="marketlabel"
                              v-if="ordertype === 'Market'"
                            />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype !== 'Market'"
                          >
                            <span class="label">Amount</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="sellamount"
                            />
                            <span class="assetlabel">{{ baseassetinitials }}</span>
                          </div>

                          <div class="trader__ordercreator--range">
                            <input
                              type="range"
                              id="myRange"
                              min="0"
                              max="100"
                              v-model.number="sellrange"
                            />
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype === 'Market'"
                          >
                            <span class="label">Amount</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="sellamount"
                            />
                            <span class="assetlabel">{{ baseassetinitials }}</span>
                          </div>

                          <div
                            class="trader__ordercreator--input"
                            v-if="ordertype !== 'Market'"
                          >
                            <span class="label">Total</span>
                            <input
                              class="trade-input"
                              type="number"
                              v-model="totalsell"
                              @input="handleSellInput"
                              @focus="handleSellTotalFocus"
                              @blur="handleSellTotalBlur"
                            />
                            <span class="assetlabel">{{ quoteassetinitials }}</span>
                          </div>

                          <div class="trader__ordercreator--buydetails">
                            <div class="trader__ordercreator--buydetail">
                              <label>Max Sell</label>
                              <span
                                >0
                                <span class="assetlabel">{{
                                  quoteassetinitials
                                }}</span></span
                              >
                            </div>
                            <div class="trader__ordercreator--buydetail">
                              <label>Est.Fee</label>
                              <span
                                >{{
                                  parseFloat(quoteassetblc) > 0
                                    ? parseFloat(quoteassetblc) * 0.005
                                    : 0
                                }}
                                {{ quoteassetinitials }}</span
                              >
                            </div>
                          </div>

                          <button
                            class="trader__ordercreator--button sell"
                            :class="{ dim: !allowsellordercreation }"
                            @click="createorder('sell')"
                          >
                            Sell {{ baseassetinitials }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="trader__rightcontainer">
              <div class="trader__rightcontainer--pairslist">
                <div class="trader__rightcontainer--pairssearch">
                  <span class="magnifglass">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      class="chakra-icon css-onkibi"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"
                      ></path>
                    </svg>
                  </span>
                  <span class="input">
                    <input placeholder="Search" v-model="searchitem" />
                  </span>
                </div>
                <div class="trader__rightcontainer--baseassetsmenu">
                  <span
                    class="bookmarks"
                    :class="{ current: baseassetsmenu === 'bookmarks' }"
                    @click="togglebaseassetsmenu('bookmarks')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="css-cz890n"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.173 3.007L12.768 3l2.41 5.11 5.326.831.496 1.495-3.89 4.013.895 5.636-1.298.915-4.735-2.648L7.236 21l-1.296-.923.946-5.632L3 10.436l.496-1.495 5.322-.83 2.355-5.104z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <span
                    :class="{ current: baseassetsmenu === 'commodity' }"
                    @click="togglebaseassetsmenu('commodity')"
                    >commodities</span
                  >
                  <span
                    :class="{ current: baseassetsmenu === 'stock' }"
                    @click="togglebaseassetsmenu('stock')"
                    >stocks</span
                  >
                  <span
                    :class="{ current: baseassetsmenu === 'crypto' }"
                    @click="togglebaseassetsmenu('crypto')"
                    >crypto</span
                  >
                  <span
                    :class="{ current: baseassetsmenu === 'fiat' }"
                    @click="togglebaseassetsmenu('fiat')"
                    >fiat</span
                  >
                </div>

                <div class="trader__rightcontainer--pairs">
                  <div class="trader__orders--header">
                    <span>Pair</span>
                    <span>Price</span>
                    <span>Change</span>
                  </div>

                  <div
                    class="trader__orders--order"
                    v-for="pair in pairsarray"
                    @click="setpair(pair)"
                  >
                    <span class="price uppercase">
                      <label class="svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          class="css-cz890n"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.173 3.007L12.768 3l2.41 5.11 5.326.831.496 1.495-3.89 4.013.895 5.636-1.298.915-4.735-2.648L7.236 21l-1.296-.923.946-5.632L3 10.436l.496-1.495 5.322-.83 2.355-5.104z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </label>
                      <label
                        ><p>{{ pair.left }}</p>
                        /{{ pair.right }}</label
                      >
                    </span>
                    <span class="amount">{{ pair.price }}</span>
                    <span class="tomeortotal" :style="{ color: pair.change.color }">{{
                      pair.change.percentage
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="trader__rightcontainer--trades">
                <div class="trader__rightcontainer--tradesheader">
                  <span
                    :class="{ current: tradesheader === 'Market Trades' }"
                    @click="toggletradesheader('Market Trades')"
                    >Market Trades</span
                  >
                  <span
                    :class="{ current: tradesheader === 'My Trades' }"
                    @click="toggletradesheader('My Trades')"
                    >My Trades</span
                  >
                </div>

                <div class="trader__rightcontainer--tradeslist">
                  <div class="trader__orders--header" v-if="currentpair">
                    <span>Price({{ currentpair.right }})</span>
                    <span>Amount({{ currentpair.left }})</span>
                    <span>Time</span>
                  </div>
                  <div class="trader__orders--orderslist">
                    <div
                      class="trader__orders--order"
                      :class="marketorder.side === 'buy' ? 'buy' : 'sell'"
                      v-for="marketorder in marketorders"
                    >
                      <span class="price">{{ marketorder.price }}</span>
                      <span class="amount">{{ marketorder.amount }}</span>
                      <span class="tomeortotal">04:28:19</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="trader__usersorders">
          <div class="trader__usersorders--content">
            <div class="trader__usersorders--ordertypemenu">
              <span
                :class="{ current: ordertypemenu === 'Open Orders' }"
                @click="toggleordertypemenu('Open Orders')"
                >Open Orders</span
              >
              <span
                :class="{ current: ordertypemenu === 'Order History' }"
                @click="toggleordertypemenu('Order History')"
                >Order History</span
              >
              <span
                :class="{ current: ordertypemenu === 'Trade History' }"
                @click="toggleordertypemenu('Trade History')"
                >Trade History</span
              >
              <span
                :class="{ current: ordertypemenu === 'Automatic Trades' }"
                @click="toggleordertypemenu('Automatic Trades')"
                >Automatic Trades</span
              >
              <span
                :class="{ current: ordertypemenu === 'Market Trades' }"
                @click="toggleordertypemenu('Market Trades')"
                >Market Trades</span
              >
            </div>

            <div
              class="trader__usersorders--header"
              v-if="ordertypemenu === 'Open Orders'"
            >
              <span>Date</span>
              <span>Pair</span>
              <span>Type</span>
              <span>Side</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Filled</span>
              <span>Total</span>
              <span>Trigger Conditions</span>
              <span class="cancelall right-text-align">Cancel All</span>
            </div>

            <div v-if="ordertypemenu === 'Open Orders'">
              <div v-for="visibleorder in visibleorders">
                <TradeOrderItem
                  :order="visibleorder"
                  :ordertypemenu="ordertypemenu"
                  :gettradeorders="gettradeorders"
                />
              </div>
            </div>

            <div
              class="trader__usersorders--header"
              v-if="ordertypemenu === 'Order History'"
            >
              <span>Date</span>
              <span>Pair</span>
              <span>Type</span>
              <span>Side</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Executed</span>
              <span>Total</span>
              <span>Trigger Conditions</span>
              <span class="cancelall right-text-align">Status</span>
            </div>

            <div v-if="ordertypemenu === 'Order History'">
              <div v-for="visibleorder in visibleorders">
                <TradeOrderItem
                  :order="visibleorder"
                  :ordertypemenu="ordertypemenu"
                  :gettradeorders="gettradeorders"
                />
              </div>
            </div>

            <div
              class="trader__usersorders--header"
              v-if="ordertypemenu === 'Trade History'"
            >
              <span>Date</span>
              <span>Pair</span>
              <span>Type</span>
              <span>Side</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Executed</span>
              <span>Total</span>
              <span>Trigger Conditions</span>
              <span class="cancelall right-text-align">Total USD</span>
            </div>

            <div
              class="trader__usersorders--header automatic-eight"
              v-if="ordertypemenu === 'Automatic Trades'"
            >
              <span>Date</span>
              <span>Pair</span>
              <span>Amount</span>
              <span>Total Investment</span>
              <span>Profit</span>
              <span>Loss</span>
              <span>Time Period</span>
              <span class="cancelall right-text-align">Action</span>
            </div>

            <div v-if="ordertypemenu === 'Automatic Trades'">
              <div v-for="visibleorder in visibleorders">
                <TradeOrderItem
                  :order="visibleorder"
                  :ordertypemenu="ordertypemenu"
                  :gettradeorders="gettradeorders"
                />
              </div>
            </div>

            <div
              class="trader__usersorders--header automatic"
              v-if="ordertypemenu === 'Market Trades'"
            >
              <span>Date</span>
              <span>Pair</span>
              <span>Type</span>
              <span>Side</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>

            <div v-if="ordertypemenu === 'Market Trades'">
              <div v-for="visibleorder in visibleorders">
                <TradeOrderItem
                  :order="visibleorder"
                  :ordertypemenu="ordertypemenu"
                  :gettradeorders="gettradeorders"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import BASE_VARS from "@/store/base_vars";

import socket from "@/plugins/socket.js";

const { BASE_URL } = BASE_VARS;

export default {
  data() {
    return {
      primaryapi: BASE_URL,
      baseassetsmenu: "commodity",
      tradetype: "spot",
      ordertype: "Limit",
      ordertypemenu: "Open Orders",
      tradesheader: "Market Trades",
      baseassetblc: "0.0000",
      quoteassetblc: "0.0000",
      pairs: [],
      currentpair: null,
      quoteassetinitials: "",
      quoteasset: null,
      pairprice: 0,
      baseassetpriceUSD: 0,
      buyorders: [],
      sellorders: [],
      marketorders: [],
      searchitem: "",
      baseassetprice: "",
      baseassetvol: "",
      quoteassetvol: "",
      baseassethigh: "",
      baseassetlow: "",
      selectedAutoTradeParams: [],
      buystop: 0,
      sellstop: 0,
      price: 0,
      buyamount: 0,
      sellamount: 0,
      buyprice: 0,
      sellprice: 0,
      totalbuy: 0,
      totalsell: 0,
      buytotalfocused: false,
      selltotalfocused: false,
      marketlabel: "Market",
      totalautomatic: 0,
      tradeorders: [],
      submittingtrade: false,
      submittedtrade: false,
      buyrange: 0,
      sellrange: 0,
      automaticrange: 0,
      automatictradetermsagreed: false,
    };
  },
  mounted() {
    document.querySelectorAll(".trade-input").forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentNode.classList.add("focus");
      });

      input.addEventListener("blur", function () {
        this.parentNode.classList.remove("focus");
      });
    });

    const userid = this.$route.query.userid;

    if (userid) {
      this.getuserwallets(userid);

      if (this.wallet) {
        this.getbaseassetblc();
      }
    }

    this.getinitialpair();
    this.getpairs();

    setInterval(() => {
      if (this.pairprice) {
        this.getpairorders(this.pairprice);
        this.getmarkettrades(this.pairprice);
      }
    }, 5000);

    socket.on("updateuserdetail", (data) => {
      let user = this.$route.query.userid;
      if (user) {
        if (user === data.userid) {
          this.getbaseassetblc();
          this.getquoteassetblc();

          this.gettradeorders();
        }
      }
    });

    socket.on("updateclientprices", () => {
      this.getbaseassetblc();
      this.getquoteassetblc();
      this.getpairs();
    });
  },
  computed: {
    allowautomaticordercreation() {
      const baseassetblc = this.baseassetblc;
      const totalautomatic = this.totalautomatic;

      if (!this.automatictradetermsagreed) {
        return false;
      }

      if (baseassetblc === "0.0000") {
        return false;
      }

      if (typeof baseassetblc !== "number") {
        return false;
      }

      if (baseassetblc <= totalautomatic) {
        return false;
      }

      if (this.selectedAutoTradeParams.length !== 7) {
        return false;
      }

      if (totalautomatic) {
        return true;
      }

      return false;
    },
    allowbuyordercreation() {
      if (this.tradetype === "spot" || this.tradetype === "margin") {
        const quoteassetblc = this.quoteassetblc;
        const totalbuy = this.totalbuy;

        if (quoteassetblc === "0.0000") {
          return false;
        }

        if (typeof quoteassetblc !== "number") {
          return false;
        }

        if (quoteassetblc <= totalbuy) {
          return false;
        }

        if (this.ordertype === "Limit") {
          const buyprice = this.buyprice;
          const buyamount = this.buyamount;

          if (buyprice && buyamount && totalbuy) {
            return true;
          }
        }

        if (this.ordertype === "Market") {
          const totalbuy = this.totalbuy;

          if (totalbuy) {
            return true;
          }
        }

        if (this.ordertype === "Stop-limit") {
          const buyprice = this.buyprice;
          const buyamount = this.buyamount;
          const buystop = this.buystop;

          if (buyprice && buyamount && totalbuy && buystop) {
            return true;
          }
        }
      }

      return false;
    },
    allowsellordercreation() {
      if (this.tradetype === "spot" || this.tradetype === "margin") {
        const baseassetblc = this.baseassetblc;
        const sellamount = this.sellamount;
        const totalsell = this.totalsell;

        if (baseassetblc === "0.0000") {
          return false;
        }

        if (typeof baseassetblc !== "number") {
          return false;
        }

        if (baseassetblc <= totalsell) {
          return false;
        }

        if (this.ordertype === "Limit") {
          const sellprice = this.sellprice;

          if (sellprice && sellamount && totalsell) {
            return true;
          }
        }

        if (this.ordertype === "Market") {
          if (totalsell) {
            return true;
          }
        }

        if (this.ordertype === "Stop-limit") {
          const sellprice = this.sellprice;
          const sellstop = this.sellstop;

          if (sellprice && sellamount && totalsell && sellstop) {
            return true;
          }
        }
      }

      return false;
    },
    wallet() {
      if (this.trdetype === "spot" || this.trdetype === "automatic") {
        return this.spotwallet;
      } else {
        return this.marginwallet;
      }
    },
    trdetype() {
      return this.$route.query.tradetype;
    },
    baseasset() {
      return this.$route.query.assetid;
    },
    baseassetinitials() {
      return this.$route.query.assetinitials;
    },
    ...mapState({
      marginwallet: (state) => state.userwallet.marginwallet,
      spotwallet: (state) => state.userwallet.spotwallet,
    }),
    sells() {
      let sellorders = this.sellorders;

      let maxAmount = Math.max(...sellorders.map((item) => item.amount));
      let minAmount = Math.min(...sellorders.map((item) => item.amount));

      sellorders = sellorders.map((item) => {
        let hierarchyPercentage =
          ((item.amount - minAmount) / (maxAmount - minAmount)) * 100;

        return {
          ...item,
          hierarchyPercentage: hierarchyPercentage.toFixed(2),
        };
      });

      return sellorders;
    },
    buys() {
      let buyorders = this.buyorders;

      let maxAmount = Math.max(...buyorders.map((item) => item.amount));
      let minAmount = Math.min(...buyorders.map((item) => item.amount));

      buyorders = buyorders.map((item) => {
        let hierarchyPercentage =
          ((item.amount - minAmount) / (maxAmount - minAmount)) * 100;

        return {
          ...item,
          hierarchyPercentage: hierarchyPercentage.toFixed(2),
        };
      });

      return buyorders;
    },
    pairsarray() {
      const pairs = this.pairs;

      if (this.searchitem.length) {
        const searchitem = this.searchitem;
        return pairs.filter((pair) =>
          pair.pair.toLowerCase().trim().includes(searchitem.toLowerCase().trim())
        );
      } else {
        return this.pairs;
      }
    },
    visibleorders() {
      const { tradeorders, ordertypemenu } = this;

      if (ordertypemenu === "Open Orders") {
        const orders = tradeorders.filter(
          (ord) =>
            ord.state === "open" &&
            ord.orderdetails &&
            !ord.orderdetails.automatic &&
            ord.ordertype !== "Market"
        );

        return orders;
      }

      if (ordertypemenu === "Order History") {
        const orders = tradeorders.filter(
          (ord) =>
            ord.orderdetails && !ord.orderdetails.automatic && ord.ordertype !== "Market"
        );

        return orders;
      }

      if (ordertypemenu === "Automatic Trades") {
        const orders = tradeorders.filter(
          (ord) => ord.orderdetails && ord.orderdetails.automatic
        );

        return orders;
      }

      if (ordertypemenu === "Market Trades") {
        const orders = tradeorders.filter((ord) => ord.ordertype === "Market");

        return orders;
      }

      return [];
    },
  },
  watch: {
    automaticrange(newVal, oldVal) {
      const balance = parseFloat(this.baseassetblc);

      if (balance > 0) {
        const percent = newVal / 100;
        this.totalautomatic = balance * percent;
      } else {
        return;
      }
    },
    buyrange(newVal, oldVal) {
      const balance = parseFloat(this.quoteassetblc);
      if (balance > 0) {
        const percent = newVal / 100;
        this.totalbuy = balance * percent;
        this.buyamount = this.totalbuy / this.buyprice;
      } else {
        return;
      }
    },
    sellrange(newVal, oldVal) {
      const balance = parseFloat(this.baseassetblc);

      if (balance > 0) {
        const percent = newVal / 100;
        this.totalsell = balance * percent;
        this.sellamount = this.totalsell / this.sellprice;
      } else {
        return;
      }
    },
    trdetype() {
      this.resetinputs();
    },
    buyamount() {
      if (!this.buytotalfocused) {
        this.totalbuy = this.buyprice * this.buyamount;

        return;
      }
    },
    buyprice() {
      if (!this.buytotalfocused) {
        this.totalbuy = this.buyprice * this.buyamount;

        return;
      }
    },
    sellamount() {
      if (!this.selltotalfocused) {
        this.totalsell = this.sellprice * this.sellamount;

        return;
      }
    },
    sellprice() {
      if (!this.selltotalfocused) {
        this.totalsell = this.sellprice * this.sellamount;

        return;
      }
    },
    wallet(newval, oldval) {
      if (newval) {
        this.getbaseassetblc();
        this.getquoteassetblc();

        this.gettradeorders();
      }
    },
    currentpair() {
      if (this.currentpair) {
        this.getheaderdetails(this.$route.query.assetid, this.currentpair.price);
      }

      this.buyprice = this.currentpair ? this.currentpair.price : "";
      this.sellprice = this.currentpair ? this.currentpair.price : "";
    },
    quoteassetinitials() {
      this.getquoteasset();
    },
    quoteasset() {
      this.getquoteassetblc();
      this.getheaderdetails(this.$route.query.assetid, this.currentpair.price);
    },
  },
  methods: {
    resetinputs() {
      this.buystop = 0;
      this.sellstop = 0;
      this.buyamount = 0;
      this.sellamount = 0;
      this.totalautomatic = 0;
      this.totalbuy = 0;
      this.totalsell = 0;
    },
    handleBuyTotalFocus() {
      this.buytotalfocused = true;
    },
    handleBuyTotalBlur() {
      this.buytotalfocused = false;
    },
    handleBuyInput() {
      if (this.buytotalfocused) {
        this.buyamount = this.totalbuy / this.buyprice;
      }
    },
    handleSellTotalFocus() {
      this.selltotalfocused = true;
    },
    handleSellTotalBlur() {
      this.selltotalfocused = false;
    },
    handleSellInput() {
      if (this.selltotalfocused) {
        this.sellamount = this.totalsell / this.sellprice;
      }
    },
    async createorder(side) {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        let wallet = this.wallet._id;
        let tradepair = this.currentpair.pair;
        let ordertype = this.ordertype;
        let user = this.$route.query.userid;

        let orderdetails;
        let tradeorder = {
          wallet,
          tradepair,
          ordertype,
          user,
        };

        if (this.ordertype === "Market") {
          const orderdetails = {
            assetfrom:
              side === "buy" ? this.currentpair.rightid : this.currentpair.leftid,
            assetto: side === "buy" ? this.currentpair.leftid : this.currentpair.rightid,
            amountfrom: side === "buy" ? this.totalbuy : this.sellamount,
            amountto: side === "buy" ? this.buyamount : this.totalsell,
            side,
            price: this.currentpair.price,
          };

          tradeorder.orderdetails = orderdetails;
          tradeorder.filled = 100;
        }

        if (this.ordertype === "Limit") {
          orderdetails = {
            limit: side === "buy" ? this.buyprice : this.sellprice,
            amount: side === "buy" ? this.buyamount : this.sellamount,
            total: side === "buy" ? this.totalbuy : this.totalsell,
            side,
          };

          tradeorder.orderdetails = orderdetails;
        }

        if (this.ordertype === "Stop-limit") {
          orderdetails = {
            stop: side === "buy" ? this.buystop : this.sellstop,
            limit: side === "buy" ? this.buyprice : this.sellprice,
            amount: side === "buy" ? this.buyamount : this.sellamount,
            total: side === "buy" ? this.totalbuy : this.totalsell,
            side,
          };

          tradeorder.orderdetails = orderdetails;
        }

        if (this.tradetype === "automatic") {
          orderdetails = {
            assetbalancededucted: this.currentpair.leftid,
            automatic: true,
            selectedAutoTradeParams: this.selectedAutoTradeParams,
            total: this.totalautomatic,
          };

          tradeorder.ordertype = "automatic";
          tradeorder.orderdetails = orderdetails;
        }

        if (token) {
          this.submittingtrade = true;

          const response = await fetch(
            `${BASE_URL}/trader/createorder?walletid=${this.wallet._id}&ordertype=${this.ordertype}&tradetype=${this.tradetype}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tradeorder),
            }
          );

          if (response.ok) {
            //submittedtrade: false,
            this.submittingtrade = false;
            this.submittedtrade = true;
            const data = await response.json();
            //console.log(data);
            this.getbaseassetblc();
            this.getquoteassetblc();

            this.gettradeorders();
            return data;
          } else {
            this.submittingtrade = false;
            const errorData = await response.json();
            console.error("Server responded with an error:", errorData);
            throw new Error(`Error ${response.status}: ${errorData.message}`);
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async gettradeorders() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(
            `${BASE_URL}/trader/gettradeorders?wallet=${this.wallet._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            //console.log(data, "yo");
            this.tradeorders = data.tradeorders;
            return data;
          } else {
            const errorData = await response.json();
            console.error("Server responded with an error:", errorData);
            throw new Error(`Error ${response.status}: ${errorData.message}`);
          }
        }
      } catch (error) {
        throw error;
      }
    },
    parameterchosen(parameter) {
      // Check if any object in selectedAutoTradeParams has an option attribute equal to the parameter
      return this.selectedAutoTradeParams.some((obj) => obj.option === parameter);
    },
    selectAutoTradeParameter(parameter) {
      // Get the current state of selected auto-trade parameters
      let selectedAutoTradeParams = this.selectedAutoTradeParams;

      // Find the index of the object with the same label, if it exists
      const existingParamIndex = selectedAutoTradeParams.findIndex(
        (p) => p.label === parameter.label
      );

      if (existingParamIndex !== -1) {
        // If an object with the same label exists, remove it
        selectedAutoTradeParams.splice(existingParamIndex, 1);
      }

      // Add the new parameter (this will add in both cases: if it was removed or if it's new)
      selectedAutoTradeParams.push(parameter);

      // Update the component's state with the new array
      this.selectedAutoTradeParams = selectedAutoTradeParams;
    },
    ...mapActions("userwallet", ["getuserwallets"]),
    async getheaderdetails(assetid, pairprice) {
      try {
        const response = await fetch(
          `${BASE_URL}/trader/headerdetails?assetid=${assetid}&pairprice=${pairprice}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        const {
          baseassetprice,
          baseassetvol,
          quoteassetvol,
          baseassethigh,
          baseassetlow,
        } = result;

        this.baseassetprice = baseassetprice;
        this.baseassetvol = baseassetvol;
        this.quoteassetvol = quoteassetvol;
        this.baseassethigh = baseassethigh;
        this.baseassetlow = baseassetlow;
      } catch (error) {
        console.error(error);
      }
    },
    routepage(route) {
      if (route === "spot" || route === "margin" || route === "automatic") {
        this.$router.push({
          path: "/trader", // The name of the route to navigate to
          query: { ...this.$route.query, tradetype: route }, // Merging existing query parameters with the new or updated parameter
        });

        return;
      }

      this.$router.push({
        path: "/trader",
        query: { ...this.$route.query, tradetype: route },
      });
    },
    async getpairprice({ baseasset, quoteasset }) {
      try {
        const response = await fetch(
          `${BASE_URL}/trader/getpairprice?baseassetid=${baseasset}&quoteassetid=${quoteasset}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Error! status: ${response1.status}`);
        }

        const result = await response.json();

        this.pairprice = result.pairprice;
        this.baseassetpriceUSD = result.baseassetpriceUSD;

        this.getpairorders(this.pairprice);
        this.getmarkettrades(this.pairprice);
      } catch (error) {
        console.error(error);
      }
    },
    async setpair(pair) {
      let baseasset = pair.left;
      let quoteasset = pair.right;

      try {
        const response1 = await fetch(
          `${BASE_URL}/trader/getassetbyinitials?assetinitials=${baseasset}`,
          {
            method: "GET",
          }
        );

        if (!response1.ok) {
          throw new Error(`Error! status: ${response1.status}`);
        }

        const result1 = await response1.json();

        const response2 = await fetch(
          `${BASE_URL}/trader/getassetbyinitials?assetinitials=${quoteasset}`,
          {
            method: "GET",
          }
        );

        if (!response2.ok) {
          throw new Error(`Error! status: ${response2.status}`);
        }

        const result2 = await response2.json();

        this.$router.push({
          path: "/trader", // The name of the route to navigate to
          query: {
            tradetype: this.$route.query.tradetype,
            assetid: result1.asset._id,
            assettype: result1.asset.assetType,
            assetinitials: result1.asset.symbol,
            assetname: result1.asset.name,
            userid: this.$route.query.userid,
          },
        });

        this.quoteasset = result2.asset._id;
        this.quoteassetinitials = result2.asset.symbol;

        this.currentpair = pair;
        this.getpairprice({
          baseasset: result1.asset._id,
          quoteasset: result2.asset._id,
        });
      } catch (error) {
        console.error(error);
      }
    },
    getpairorders(pairprice) {
      try {
        if (pairprice) {
          fetch(`${BASE_URL}/trader/pairorders?pairprice=${pairprice}`, {
            method: "GET",
          })
            .then((response) => response.json())
            .then((data) => {
              const { buyorders, sellorders } = data;
              this.buyorders = buyorders;
              this.sellorders = sellorders;
            });
        }
      } catch (error) {
        console.error(error);
      }
    },
    getmarkettrades(pairprice) {
      if (pairprice) {
        fetch(`${BASE_URL}/trader/markettrades?pairprice=${pairprice}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            const { marketorders } = data;
            this.marketorders = marketorders;
          });
      }
    },
    getinitialpair() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");
        const { baseassetinitials } = this;

        fetch(
          `${BASE_URL}/trader/initialpair?baseassetinitials=${this.baseassetinitials}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            this.currentpair = data.initialpair;
            this.quoteassetinitials = this.currentpair.right;

            this.setpair(data.initialpair);
          });
      } catch (error) {
        console.error(error);
      }
    },
    getpairs() {
      try {
        fetch(`${BASE_URL}/trader/pairs?assetmenu=${this.baseassetsmenu}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            this.pairs = data.pairs;
          });
      } catch (error) {
        console.error(error);
      }
    },
    getbaseassetblc() {
      const token = localStorage.getItem("873__jh6bdjktoken");

      if (!token) {
        return;
      }

      try {
        fetch(
          `${BASE_URL}/userwallet/assetbalance?walletid=${this.wallet._id}&assetid=${this.baseasset}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const { assetbalance } = data;
            this.baseassetblc = assetbalance === 0 ? "0.0000" : assetbalance;
          });
      } catch (error) {
        console.error(error);
      }
    },
    getquoteassetblc() {
      const token = localStorage.getItem("873__jh6bdjktoken");

      if (!token) {
        return;
      }

      try {
        fetch(
          `${BASE_URL}/userwallet/assetbalance?walletid=${this.wallet._id}&assetid=${this.quoteasset}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const { assetbalance } = data;
            //console.log(data, 'check here')
            this.quoteassetblc = assetbalance === 0 ? "0.0000" : assetbalance;
          });
      } catch (error) {
        console.error(error);
      }
    },
    getquoteasset() {
      try {
        fetch(
          `${BASE_URL}/trader/getassetbyinitials?assetinitials=${this.quoteassetinitials}`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.asset) {
              this.quoteasset = data.asset._id;
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    toggleordertypemenu(ordertypemenu) {
      this.ordertypemenu = ordertypemenu;
    },
    toggleordertype(ordertype) {
      this.resetinputs();
      this.ordertype = ordertype;
    },
    toggletradetype(tradetype) {
      this.tradetype = tradetype;

      this.routepage(tradetype);
    },
    togglebaseassetsmenu(baseassetsmenu) {
      this.baseassetsmenu = baseassetsmenu;
      this.getpairs();
    },
    togglecurrentsearch(currentsearch) {
      this.currentsearch = currentsearch;
    },
    toggletradesheader(tradesheader) {
      this.tradesheader = tradesheader;
    },
  },
};
</script>

<style lang="scss" scoped>
$background: rgb(22, 26, 30);
$header-background: #181a20;
$neon-blue: #00ffff;
$bitcoin-orange: #f7931a;
$black: #000000;
$white: #fff;
$neon-pink: #ff6ec7;
$border-transparent: 1px solid transparent;
$border: 1px solid rgb(43, 49, 58);
$red: rgb(246, 70, 93);
$green: rgb(14, 203, 129);
$order-creator-background: rgb(22, 26, 30);
$input-background: rgba(43, 47, 54, 0.9);
$gold-b: rgb(240, 185, 11);
$red: rgb(246, 70, 93);

@keyframes expandAndContract {
  0%,
  100% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1); // Original size
  }
}

.trader {
  background: rgba($background, 0.7);

  &__container {
    padding: 0 #{scaleValue(70)};

    &--content {
      display: flex;
      border-left: $border;
      border-right: $border;
    }
  }

  &__usersorders {
    padding: 0 #{scaleValue(70)};

    &--content {
      border-left: $border;
      border-right: $border;
      border-top: $border;
      min-height: #{scaleValue(500)};
      padding: #{scaleValue(10)};
    }

    &--ordertypemenu {
      font-size: #{scaleValue(12)};
      color: rgba($white, 0.4);
      padding: #{scaleValue(13)} 0;
      border-bottom: $border;
      display: flex;
      align-items: center;

      & span {
        margin-right: #{scaleValue(30)};
        cursor: pointer;

        &.current {
          color: $neon-blue;
        }
      }
    }

    &--header {
      color: rgb(132, 142, 156);
      font-size: #{scaleValue(11)};
      padding: #{scaleValue(13)} 0;

      display: grid;
      grid-template-columns: repeat(10, 1fr);
      border-bottom: $border;

      & span {
        &:last-child {
          //text-align: right;
        }

        &.right-text-align {
          text-align: right;
        }
      }

      &.automatic {
        grid-template-columns: repeat(7, 1fr);
      }

      &.automatic-eight {
        grid-template-columns: repeat(8, 1fr);
      }
    }
  }

  &__leftcontainer {
    width: #{scaleValue(1118)};

    &--body {
      display: flex;
    }
  }

  &__leftarea {
    display: flex;
  }

  &__pairheader {
    display: flex;
    padding: #{scaleValue(10)} #{scaleValue(20)};
    border-bottom: $border;
    font-size: #{scaleValue(13)};

    &--paircategory {
      color: rgba($bitcoin-orange, 0.8);
      background: rgba($bitcoin-orange, 0.1);
      border-radius: #{scaleValue(7)};
      display: inline-block;
      padding: #{scaleValue(5)} #{scaleValue(15)};
      text-align: center;
    }

    &--pair {
      padding-right: #{scaleValue(30)};
      border-right: $border;
    }

    &--pairdetails {
      display: flex;
      align-items: center;
      margin-bottom: #{scaleValue(8)};

      & span {
        display: inline-block;

        &:nth-child(1) {
          font-weight: 600;
          font-size: #{scaleValue(17)};
          margin-right: #{scaleValue(10)};
        }

        &:nth-child(2) {
          cursor: pointer;
          text-decoration: underline;
          color: rgba($neon-blue, 0.3);
        }
      }
    }

    &--area {
      display: flex;
      align-items: center;
      padding-left: #{scaleValue(30)};

      &.pair {
        align-items: flex-start;
      }
    }

    &--righter {
      display: flex;
      flex-direction: column;
      margin-right: #{scaleValue(30)};
      line-height: #{scaleValue(20)};

      & span {
        &:nth-child(1) {
          font-size: #{scaleValue(10.5)};
          color: rgba($white, 0.6);
        }

        &:nth-child(2) {
          font-size: #{scaleValue(11.5)};
        }

        &.pairvalue {
          font-size: #{scaleValue(14.5)};
        }
      }
    }
  }

  &__tradearea {
    width: 100%;
  }

  &__graph {
    height: #{scaleValue(530)};
    //background: red;
  }

  &__ordercreator {
    position: relative;
    with: 100%;
    background: $order-creator-background;

    &--ordertypes {
      display: flex;
      align-items: center;
      border-bottom: $border;
      padding: #{scaleValue(11.5)};
    }

    &--tradetypes {
      display: flex;
      align-items: center;
      border-bottom: $border;
      background: rgba($black, 0.4);

      & span {
        display: inline-block;
        cursor: pointer;
        font-size: #{scaleValue(13)};
        color: rgba($white, 0.6);
        padding: #{scaleValue(15)} #{scaleValue(30)};
        border-right: $border-transparent;
        border-left: $border-transparent;

        &.current {
          background: $order-creator-background;
          border-right: $border;
          border-left: $border;
          color: $white;
        }
      }
    }

    &--ordertype {
      position: relative;
      margin-right: #{scaleValue(35)};
      display: flex;
      align-items: center;
      color: rgba($white, 0.6);

      & label {
        cursor: pointer;
        font-size: #{scaleValue(12)};
      }

      &.current {
        color: $neon-blue;
      }

      & span {
        &.teacher {
          margin-left: #{scaleValue(6)};
          cursor: pointer;

          & svg {
            height: #{scaleValue(11.5)};
            width: #{scaleValue(11.5)};
            fill: rgba($white, 0.6);
          }

          &:hover {
            & + .trader__ordercreator--teacher {
              display: block;
            }
          }
        }
      }
    }

    &--teacher {
      position: absolute;
      top: #{scaleValue(15)};
      left: 0;
      background: rgb(132, 142, 156);
      border-radius: #{scaleValue(6)};
      padding: #{scaleValue(10)};
      font-size: #{scaleValue(14)};
      width: #{scaleValue(200)};
      color: $white;
      display: none;

      &:hover {
        display: block;
      }
    }

    &--forms {
      margin-top: #{scaleValue(20)};
      display: flex;
      justify-content: space-between;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: #{scaleValue(20)};
      padding: #{scaleValue(10)};
    }

    &--form {
      //background: red;
      //background: blue;
    }

    &--h4 {
      font-size: #{scaleValue(14)};
      font-weight: 300;
      margin-bottom: #{scaleValue(7)};
    }

    &--blc {
      display: flex;
      align-items: center;
      margin-bottom: #{scaleValue(10)};

      & span {
        &.Avbl {
          font-size: #{scaleValue(12)};
          color: rgba($white, 0.4);
          margin-right: #{scaleValue(9)};
        }

        &.asset {
          font-size: #{scaleValue(12)};
          text-transform: uppercase;
        }
      }
    }

    &--input {
      background: $input-background;
      position: relative;
      width: 100%;
      height: #{scaleValue(40)};
      border-radius: #{scaleValue(3)};
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 #{scaleValue(14)};
      margin-bottom: #{scaleValue(20)};
      border: $border;

      &:hover {
        border: 1px solid $gold-b;

        &.disabled {
          border: $border;
        }
      }

      &.focus {
        border: 1px solid $gold-b;

        &.disabled {
          border: $border;
        }
      }

      & span {
        height: 100%;
        position: relative;
        font-size: #{scaleValue(13)};
        display: flex;
        align-items: center;

        &.label {
          left: 0;
          color: rgba($white, 0.5);
        }

        &.assetlabel {
          right: 0;
          text-transform: uppercase;
        }
      }

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"]::-moz-focus-inner {
        border: 0;
      }

      input[type="number"]::-ms-clear,
      input[type="number"]::-ms-reveal {
        display: none;
      }

      & input {
        -webkit-appearance: none; /* for Chrome, Safari */
        -moz-appearance: none; /* for Firefox */
        appearance: none;

        background: transparent;
        border: none;
        outline: none;
        flex-grow: 1;
        height: 100%;
        padding: 0 #{scaleValue(15)};
        color: rgba($white, 0.7);
        font-size: #{scaleValue(14)};
        text-align: right;
      }
    }

    &--buydetails {
      margin-bottom: #{scaleValue(20)};
    }

    &--buydetail {
      display: flex;
      align-items: center;
      line-height: #{scaleValue(19)};

      & label {
        color: rgba($white, 0.4);
        font-size: #{scaleValue(11)};
        margin-right: #{scaleValue(12)};
      }

      & span {
        font-size: #{scaleValue(11)};
      }
    }

    &--range {
      transform: translateY(#{scaleValue(-13)});

      input[type="range"] {
        -webkit-appearance: none; /* Override default appearance */
        width: 100%; /* Full-width */
        height: #{scaleValue(4)}; /* Specified height */
        background: $input-background; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (cross-browser) */
        -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
        transition: opacity 0.2s;
      }

      input[type="range"]:hover {
        opacity: 1; /* Fully opaque on hover */
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: #{scaleValue(10)}; /* Width of the thumb */
        height: #{scaleValue(10)}; /* Height of the thumb */
        background: $neon-blue; /* Green background */
        cursor: pointer; /* Cursor on hover */
        border-radius: 100%;
      }

      input[type="range"]::-moz-range-thumb {
        width: #{scaleValue(10)}; /* Width of the thumb */
        height: #{scaleValue(10)}; /* Height of the thumb */
        background: $neon-blue; /* Green background */
        cursor: pointer; /* Cursor on hover */
      }
    }

    &--button {
      width: 100%;
      color: $white;
      text-align: center;
      height: #{scaleValue(40)};
      border: none;
      outline: none;
      font-weight: 500;
      border-radius: #{scaleValue(3)};
      cursor: pointer;

      &.buy {
        background: $green;
      }

      &.sell {
        background: $red;
      }

      &.automatic {
        font-size: #{scaleValue(25)};
      }
    }

    &--checkbox {
      margin-right: #{scaleValue(10)};
    }

    &--disclaimer {
      display: flex;
      margin-top: #{scaleValue(20)};

      &.understand {
        align-items: center;
      }
    }

    &--disclaimertext {
      font-size: #{scaleValue(10)};
      line-height: #{scaleValue(15)};
      color: rgba($neon-blue, 0.4);
    }

    &--parameters {
      margin-top: #{scaleValue(15)};
    }

    &--parameter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: #{scaleValue(10)};

      margin-bottom: #{scaleValue(12)};
    }

    &--parameterlabel {
      color: rgba($white, 0.6);
      text-decoration: underline;
    }

    &--parameteroptions {
      & span {
        display: inline-block;
        margin-left: #{scaleValue(9)};
        cursor: pointer;
        color: rgb(132, 142, 156);

        background: rgba($faded-black, 0.2);
        padding: #{scaleValue(4)};

        &.chosen {
          color: rgba($white, 0.7);
          background: rgba($faded-black, 0.7);
        }
      }
    }
  }

  &__orders {
    padding: #{scaleValue(10)};
    border-right: $border;
    flex-basis: 40%;
    min-height: #{scaleValue(1000)};

    &--header {
      font-size: #{scaleValue(11)};
      color: rgba($white, 0.5);
      display: grid;
      grid-template-columns: #{scaleValue(120)} 1fr 1fr;
      padding: #{scaleValue(11.5)} 0;

      & span {
        &:nth-child(2) {
          text-align: right;
        }

        &:nth-child(3) {
          text-align: right;
        }
      }
    }

    &--orderslist {
      height: #{scaleValue(464)};
      overflow-x: hidden;
      overflow-y: scroll;
    }

    &--order {
      display: flex;
      align-items: center;
      font-size: #{scaleValue(10.8)};
      padding: #{scaleValue(4.5)} 0;
      display: grid;
      transition: all 0.5s ease;
      cursor: pointer;
      grid-template-columns: #{scaleValue(120)} 1fr 1fr;
      position: relative;

      &:hover {
        background: rgba(94, 102, 115, 0.4);
      }

      & span {
        color: rgba($white, 0.7);

        &:nth-child(2) {
          text-align: right;
        }

        &:nth-child(3) {
          text-align: right;
        }

        &.uppercase {
          text-transform: uppercase;
          display: flex;
          align-items: center;
        }
        & label {
          display: flex;

          &.svg {
            cursor: pointer;
            margin-right: #{scaleValue(9)};

            & svg {
              height: #{scaleValue(15)};
              width: #{scaleValue(15)};
            }
          }
        }
      }

      &.sell {
        & span {
          &:nth-child(1) {
            color: $red;
          }
        }
      }

      &.buy {
        & span {
          &:nth-child(1) {
            color: $green;
          }
        }
      }
    }

    &--colorcode {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      opacity: 0.08;

      //transition: all 0.3s ease;

      animation: expandAndContract 0.3s ease-in-out;

      transform-origin: right;
    }

    &--figures {
      display: flex;
      align-items: center;
      padding: #{scaleValue(15.5)} 0;

      & span {
        display: inline-block;

        &.assetunit {
          font-size: #{scaleValue(20.5)};
          margin-right: #{scaleValue(11.5)};
        }

        &.usd {
          font-size: #{scaleValue(12.5)};
          color: rgba($white, 0.5);
        }
      }
    }
  }

  &__rightcontainer {
    border-left: $border;
    padding: #{scaleValue(10)};
    flex-grow: 1;

    &--tradesheader {
      font-size: #{scaleValue(13)};
      margin-bottom: #{scaleValue(15)};

      & span {
        display: inline-block;
        cursor: pointer;
        margin-right: #{scaleValue(15)};
        color: rgba($white, 0.5);

        &.current {
          color: $neon-blue;
        }
      }
    }

    &--pairssearch {
      background: rgba($black, 0.1);
      display: flex;
      align-items: center;
      border-radius: #{scaleValue(10)};
      padding: 0 #{scaleValue(10)};

      & span {
        &.magnifglass {
          transform: translateY(#{scaleValue(2)});

          & svg {
            height: #{scaleValue(13)};
            width: #{scaleValue(13)};
            fill: rgba($white, 0.6);
          }
        }

        &.input {
          flex-grow: 1;

          & input {
            border: none;
            outline: none;
            width: 100%;
            height: #{scaleValue(30)};
            background: transparent;
            color: $white;
            font-size: #{scaleValue(13)};
            padding-left: #{scaleValue(10)};
          }
        }
      }
    }

    &--baseassetsmenu {
      font-size: #{scaleValue(11)};
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      padding: #{scaleValue(15)} 0;

      & span {
        display: inline-block;
        cursor: pointer;
        color: rgba($white, 0.5);
        padding: #{scaleValue(5)} #{scaleValue(8)};
        border-radius: #{scaleValue(10)};
        transition: all 0.5s ease;

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
        }

        &.current {
          background: rgba($black, 0.3);
          color: rgba($white, 0.7);
        }
      }
    }

    &--pairslist,
    &--trades {
      border-bottom: $border;
      margin-bottom: #{scaleValue(15)};
      height: #{scaleValue(500)};
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }

  &__submitting {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(#141a25, 0.6);
    z-index: 1;
  }

  &__submitted {
  }
}
</style>
