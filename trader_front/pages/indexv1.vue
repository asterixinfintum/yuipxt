<template>
  <div>
    <div class="landing">
      <div class="landing__header">
        <HeaderBox />
      </div>

      <div class="landing__container">
        <div class="landing__jumbotron">
          <div class="landing__jumbotrontop">
            <h2 class="landing__jumbotrontop--header" id="landing__jumbotrontop--header">
              <span>The complete Defi/Cefi</span>
              <span>trading experience</span>
            </h2>

            <div class="landing__jumbotrontop--sub">
              <p>
                Exceptional platforms, competitive spreads, minimal fees, and unwavering
                assistance.
              </p>
              <p>
                Discover why over a million traders globally trust us as their preferred
              </p>
              <p>trading partner.</p>
            </div>

            <div class="landing__jumbotrontop--btns">
              <button class="btn" @click="navigateToPage('register')">
                Open an account
              </button>
            </div>
          </div>

          <div class="landing__jumbotronassetclasses">
            <div class="landing__jumbotronassetclasses--content">
              <div class="landing__jumbotronassetclass">
                <h4>Crypto</h4>

                <p>Dive into digital with secure, real-time crypto trading.</p>

                <div class="landing__jumbotronassetclass--btnarea">
                  <button class="btn" @click="navigateToPage('introductory')">
                    CRYPTO TRADING
                  </button>
                  <span>&#8594;</span>
                </div>
              </div>

              <div class="landing__jumbotronassetclass">
                <h4>Stocks</h4>

                <p>
                  Access global stocks with confidence. Trade top companies effortlessly.
                </p>

                <div class="landing__jumbotronassetclass--btnarea">
                  <button class="btn" @click="navigateToPage('introductory')">
                    TOKENIZED STOCKS
                  </button>
                  <span>&#8594;</span>
                </div>
              </div>

              <div class="landing__jumbotronassetclass">
                <h4>Defi Staking</h4>

                <p>Maximize returns with secure DeFi staking. Grow your assets.</p>

                <div class="landing__jumbotronassetclass--btnarea">
                  <button class="btn" @click="navigateToPage('introductory')">
                    DEFI STAKING
                  </button>
                  <span>&#8594;</span>
                </div>
              </div>

              <div class="landing__jumbotronassetclass">
                <h4>Commodities</h4>

                <p>Trade commodities with fixed spreads and 10% margin.</p>

                <div class="landing__jumbotronassetclass--btnarea">
                  <button class="btn" @click="navigateToPage('introductory')">
                    COMMODITY TRADING
                  </button>
                  <span>&#8594;</span>
                </div>
              </div>

              <div class="landing__jumbotronassetclass">
                <h4>Margin Trades</h4>

                <p>Leverage with our robust margin options. Amplify profits wisely.</p>

                <div class="landing__jumbotronassetclass--btnarea">
                  <button class="btn" @click="navigateToPage('introductory')">
                    MARGIN TRADING
                  </button>
                  <span>&#8594;</span>
                </div>
              </div>
            </div>
          </div>

          <div class="landing__jumbotronbottom">
            <div class="landing__jumbotronbottom--left">
              <h3 class="landing__jumbotronbottom--left-header landing__copyheaderstyle">
                <span>Backing your trading endeavors since</span>
                <span>2001.</span>
              </h3>

              <div class="landing__jumbotronbottom--left-sub landing__copyfontstyle">
                <p>Markets pulse through our veins. With two</p>
                <p>decades under our belt, bvx has empowered</p>
                <p>traders to achieve their dreams, consistently</p>
                <p>raising the industry standard.</p>
              </div>

              <div class="landing__jumbotrontop--btns">
                <button class="btn" @click="navigateToPage('register')">
                  Open an account
                </button>
              </div>
            </div>

            <div class="landing__jumbotronbottom--right">
              <div class="landing__jumbotronbottom--right-grid">
                <div class="landing__jumbotronbottom--right-gridbox">
                  <div class="landing__jumbotronbottom--right-gridboxsvg">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      focusable="false"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="landing__jumbotronbottom--right-gridboxh4">
                    Dominate the trading landscape
                  </h4>
                  <div
                    class="landing__jumbotronbottom--right-gridboxcopy landing__copyfontstyle"
                  >
                    <p>
                      Explore diverse markets with Bvx, from Crypto to Germany 40 and
                      gold.
                    </p>
                  </div>
                  <div
                    class="landing__jumbotronbottom--right-gridboxbtn"
                    @click="navigateToPage('register')"
                  >
                    <button class="btn">TRADE MARKETS</button>
                    <span></span>
                  </div>
                </div>

                <div class="landing__jumbotronbottom--right-gridbox">
                  <div class="landing__jumbotronbottom--right-gridboxsvg">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      focusable="false"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="landing__jumbotronbottom--right-gridboxh4">
                    Experience trading on the benchmark in golden standards.
                  </h4>
                  <div
                    class="landing__jumbotronbottom--right-gridboxcopy landing__copyfontstyle"
                  >
                    <p>
                      Seek only the best in trading. bvx, the top Forex Platform of 2020
                      Shares Awards.
                    </p>
                  </div>
                  <div
                    class="landing__jumbotronbottom--right-gridboxbtn"
                    @click="navigateToPage('register')"
                  >
                    <button class="btn">TRADE MARKETS</button>
                    <span></span>
                  </div>
                </div>

                <div class="landing__jumbotronbottom--right-gridbox">
                  <div class="landing__jumbotronbottom--right-gridboxsvg">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      focusable="false"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="landing__jumbotronbottom--right-gridboxh4">
                    Ascend to the pinnacle of asset trading with Bvx.
                  </h4>
                  <div
                    class="landing__jumbotronbottom--right-gridboxcopy landing__copyfontstyle"
                  >
                    <p>
                      Lost in trading terms? Join bvx's free Trading Plan and boost your
                      skills.
                    </p>
                  </div>
                  <div
                    class="landing__jumbotronbottom--right-gridboxbtn"
                    @click="scrollToDiv('landing__perks-parent')"
                  >
                    <button class="btn">SEE PLANS</button>
                    <span></span>
                  </div>
                </div>

                <div class="landing__jumbotronbottom--right-gridbox">
                  <div class="landing__jumbotronbottom--right-gridboxsvg">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      aria-hidden="true"
                      focusable="false"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
                      ></path>
                    </svg>
                  </div>
                  <h4 class="landing__jumbotronbottom--right-gridboxh4">
                    Align with bvx, a trading provider built on unshakeable pillars.
                  </h4>
                  <div
                    class="landing__jumbotronbottom--right-gridboxcopy landing__copyfontstyle"
                  >
                    <p>
                      As part of Voltex Singapore with $10 billion in assets, trust Bvx
                      with your trading journey.
                    </p>
                  </div>
                  <div
                    class="landing__jumbotronbottom--right-gridboxbtn"
                    @click="navigateToPage('register')"
                  >
                    <button class="btn">JOIN</button>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="landing__tradingtypes">
          <h2>Control, power and speed. Our platforms give you every possible edge.</h2>
          <div class="landing__tradingtypesbody">
            <div class="landing__tradingtypesarea">
              <div class="landing__tradingtypesbox">
                <h4 class="landing__tradingtypesbox--h4">
                  Safety First: Uncompromised Security
                </h4>

                <p class="landing__tradingtypesbox--p">
                  Trust in bvx's robust security measures that prioritize your assets and
                  information. Our state-of-the-art protection ensures you trade with
                  peace of mind, every step of the way.
                </p>

                <!--<div class="landing__tradingtypesbox--btnarea">
                                    <button class="btn">LEARN MORE </button>
                                    <span>&#8594;</span>
                                </div>--->
              </div>

              <div class="landing__tradingtypesbox">
                <h4 class="landing__tradingtypesbox--h4">
                  Guided Growth: Agent-Backed Learning
                </h4>

                <p class="landing__tradingtypesbox--p">
                  Navigate the trading world with bvx's experienced agents at your side.
                  Our tailored tutorials and hands-on mentoring propel your skills,
                  turning novice moves into expert strategies.
                </p>

                <!--<div class="landing__tradingtypesbox--btnarea">
                                    <button class="btn">LEARN MORE </button>
                                    <span>&#8594;</span>
                                </div>--->
              </div>

              <div class="landing__tradingtypesbox">
                <h4 class="landing__tradingtypesbox--h4">
                  Amplify Your Portfolio: Rewarding Asset Returns
                </h4>

                <p class="landing__tradingtypesbox--p">
                  With bvx, your assets work harder for you. Enjoy unparalleled returns
                  and watch your investments flourish as you capitalize on our unique
                  reward programs.
                </p>

                <!--<div class="landing__tradingtypesbox--btnarea">
                                    <button class="btn">LEARN MORE </button>
                                    <span>&#8594;</span>
                                </div>--->
              </div>
            </div>

            <div class="landing__tradingtypesarea">
              <ForexTable />
            </div>
          </div>
        </div>

        <div class="landing__rewards">
          <h3 class="landing__rewards--h3">Defi Staking</h3>
          <h2 class="landing__rewards--h2">Earn crypto rewards on your assets</h2>

          <div class="landing__rewardsbody">
            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/61a900c6c0c19d4855dc0323_BTC.svg" />
              </figure>

              <h5>BTC</h5>

              <span>Yearly rewards up to</span>

              <span>6%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/60d21880724092061738067c_fox-Icon.svg" />
              </figure>

              <h5>FOX</h5>

              <span>Yearly rewards up to</span>

              <span>4%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/61b0dabab79d32a580afa34d_eth.svg" />
              </figure>

              <h5>ETH</h5>

              <span>Yearly rewards up to</span>

              <span>4%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/61b0da972b0526e4b219cd42_ltc.svg" />
              </figure>

              <h5>LTC</h5>

              <span>Yearly rewards up to</span>

              <span>18%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img
                  src="@/assets/imgs/632ca2c35d0556b7df05357b_avalanche-avax-logo.svg"
                />
              </figure>

              <h5>AVAX</h5>

              <span>Yearly rewards up to</span>

              <span>6%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/629e539eed9254aca6e47d59_cosmos-atom-logo.svg" />
              </figure>

              <h5>COSMOS</h5>

              <span>Yearly rewards up to</span>

              <span>6%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/632ca22eb77a6b0093b19d11_doge.svg" />
              </figure>

              <h5>DOGE</h5>

              <span>Yearly rewards up to</span>

              <span>7%</span>
            </div>

            <div class="landing__reward">
              <figure>
                <img src="@/assets/imgs/61b12434ca293848b210e4ad_bch.svg" />
              </figure>

              <h5>BCH</h5>

              <span>Yearly rewards up to</span>

              <span>4%</span>
            </div>
          </div>
        </div>

        <div class="landing__perks" id="landingperks">
          <div class="landing__perksarea">
            <h4>Master the Markets with Bvx</h4>
            <h3>Our agents amplify your market acumen for confident trading</h3>
            <p class="landing__perksarea--p">
              Starting from scratch? No worries. With bvx's seasoned trading agents by
              your side, watch your market know-how skyrocket to unparalleled heights.
            </p>
          </div>

          <div class="landing__perksarea bottomrow">
            <div class="landing__perk">
              <div class="landing__perk--section">
                <span class="landing__perk--section-header"
                  >Standard Prodigy Account:</span
                >
                <p class="landing__perk--section-copy">
                  Ideal for newcomers, this plan offers weekly market insights and an
                  introduction to trading basics, complemented by monthly sessions with a
                  trading agent for guidance.
                </p>
                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$1,000</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext">$10 per trade</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>Basic market access</li>
                      <li>Standard customer support</li>
                      <li>Access to basic trading tools and educational resources</li>
                    </ul>
                  </div>
                </div>
                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>

            <div class="landing__perk">
              <div class="landing__perk--section"></div>
              <div class="landing__perk--section">
                <span class="landing__perk--section-header">Professional Account:</span>
                <p class="landing__perk--section-copy">
                  For intermediate traders, this plan provides bi-weekly in-depth market
                  analyses, advanced strategy tutorials, and regular coaching sessions,
                  backed by priority email support.
                </p>

                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$5,000</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext">$8 per trade</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>All Standard Prodigy features</li>
                      <li>Extended market access</li>
                      <li>Enhanced trading tools</li>
                      <li>Priority customer support</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>

            <div class="landing__perk">
              <div class="landing__perk--section"></div>
              <div class="landing__perk--section">
                <span class="landing__perk--section-header">Elite Gold Account:</span>
                <p class="landing__perk--section-copy">
                  Advanced traders can benefit from weekly detailed market forecasts,
                  exclusive webinars, and consistent personalized coaching. 24/7 priority
                  support ensures they're always ahead.
                </p>

                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$10,000</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext">$5 per trade</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>All Professional Account features</li>
                      <li>Access to advanced market data and analytics</li>
                      <li>One-on-one coaching sessions</li>
                      <li>Reduced withdrawal fees</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>

            <div class="landing__perk">
              <div class="landing__perk--section"></div>
              <div class="landing__perk--section" id="landing__perks-parent">
                <span class="landing__perk--section-header">Pioneer Silver Account:</span>
                <p class="landing__perk--section-copy">
                  The ultimate offering for seasoned traders, with daily market insights,
                  direct expert access, unlimited sessions with top agents, and early
                  access to new tools and features.
                </p>

                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$25,000</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext">$3 per trade</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>All Elite Gold Account features</li>
                      <li>Access to exclusive investment opportunities</li>
                      <li>Personal account manager</li>
                      <li>Invitations to webinars and events</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>

            <div class="landing__perk">
              <div class="landing__perk--section"></div>
              <div class="landing__perk--section" id="landing__perks-parent">
                <span class="landing__perk--section-header"
                  >Premier Gold Membership:</span
                >
                <p class="landing__perk--section-copy">
                  The ultimate offering for seasoned traders, with daily market insights,
                  direct expert access, unlimited sessions with top agents, and early
                  access to new tools and features.
                </p>

                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$50,000</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext">$1 per trade</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>All Pioneer Silver Account features</li>
                      <li>Tailored investment advice</li>
                      <li>Higher withdrawal limits</li>
                      <li>Complimentary access to premium market research</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>

            <div class="landing__perk">
              <div class="landing__perk--section"></div>
              <div class="landing__perk--section" id="landing__perks-parent">
                <span class="landing__perk--section-header"
                  >Premier Platinum Membership:</span
                >
                <p class="landing__perk--section-copy">
                  The ultimate offering for seasoned traders, with daily market insights,
                  direct expert access, unlimited sessions with top agents, and early
                  access to new tools and features.
                </p>

                <div class="landing__perk--list">
                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Minimum Balance:</span>
                    <span class="landing__perk--listitemtext">$100,000+</span>
                  </div>

                  <div class="landing__perk--listitem">
                    <span class="landing__perk--listitemboldtext">Commission:</span>
                    <span class="landing__perk--listitemtext"
                      >Zero commission on trades</span
                    >
                  </div>

                  <div class="landing__perk--listitem">
                    <span
                      class="landing__perk--listitemboldtext landing__perk--listitemfeaturesheader"
                      >Features:</span
                    >
                    <ul class="landing__perk--listitemfeatures">
                      <li>All Premier Gold Membership features</li>
                      <li>Bespoke financial planning and portfolio management</li>
                      <li>Exclusive VIP customer support</li>
                      <li>Access to invite-only investment opportunities</li>
                    </ul>
                  </div>
                </div>

                <div
                  class="landing__jumbotrontop--btns"
                  @click="navigateToPage('register')"
                >
                  <button class="btn">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--<div class="landing__inthenews">
                    <h2 class="landing__rewards--h2">In the News</h2>

                    <div class="landing__inthenewsbody">
                        <div class="landing__inthenewscard">
                            <div class="landing__inthenewscard--header">
                                <span>January 6, 2023</span>
                                <span>Vetago</span>
                            </div>

                            <h2 class="landing__inthenewscard--copy">ShapeShift Plans a Multi-chain Roadmap</h2>

                            <div class="landing__inthenewscard--btn">
                                <button class="btn">Read More</button>
                            </div>
                        </div>

                        <div class="landing__inthenewscard">
                            <div class="landing__inthenewscard--header">
                                <span>January 6, 2023</span>
                                <span>Vetago</span>
                            </div>

                            <h2 class="landing__inthenewscard--copy">ShapeShift Plans a Multi-chain Roadmap</h2>

                            <div class="landing__inthenewscard--btn">
                                <button class="btn">Read More</button>
                            </div>
                        </div>

                        <div class="landing__inthenewscard">
                            <div class="landing__inthenewscard--header">
                                <span>January 6, 2023</span>
                                <span>Vetago</span>
                            </div>

                            <h2 class="landing__inthenewscard--copy">ShapeShift Plans a Multi-chain Roadmap</h2>

                            <div class="landing__inthenewscard--btn">
                                <button class="btn">Read More</button>
                            </div>
                        </div>

                    </div>
                </div>-->

        <div class="landing__disclaimers">
          <div class="landing__disclaimers--content">
            <p>
              BVX offerings are intricate tools that carry a high possibility of swift
              financial loss due to leverage. 77.1% of retail investor accounts suffer
              financial losses when engaging in trades with bvx. It is crucial to ponder
              whether you grasp the operation of the markets and if you are in a position
              to shoulder the substantial risk of losing your funds. Kindly make sure you
              have a comprehensive understanding of the risks entailed by consulting our
              detailed risk warning.
            </p>

            <p>
              Bvx is a trading identity of Voltex Singapore, and bvx.com/ie is a domain
              run by Voltex Singapore, a constituent of StoneX Group Inc. Voltex Singapore
              is a Cyprus Investment Firm (CIF) officially registered with the Department
              of Registrar of Companies and Official Receiver under the Registration
              Number HE409708, and endorsed and overseen by the Cyprus Securities &
              Exchange Commission (CySEC) with the license number 400/21. Voltex Singapore
              is affiliated with the Investor Compensation Fund (ICF) and has its official
              headquarters at 10 Marina Bay Street, #15-02, Central Tower, Singapore
              018983.
            </p>

            <p>
              Voltex Singapore might offer third-party content on this website, which
              might encompass details including but not limited to the financial market
              scenarios. This content is purely informational and should never be
              perceived as containing financial counsel, investment endorsements,
              investment analysis, or invitations for any financial instrument
              transactions. Any decisions regarding specific financial actions should be
              made by the client after their personal evaluation. Voltex Singapore does
              not guarantee the preciseness or completeness of the given details, nor any
              financial losses that might arise from any investment grounded on
              recommendations, projections, or other supplied details. Always consult
              independent advice to determine your aptness for speculation in associated
              markets and your capacity to undertake related risks. No obligation lies
              with us to refresh any given content. Views expressed might be personal to
              the contributor and might not mirror the opinions of Voltex Singapore.
            </p>

            <p>
              By leveraging passporting, Voltex Singapore can deliver its services and
              offerings across borders to the subsequent European Economic Area ("EEA")
              nations: Austria, Bulgaria, Croatia, Denmark, Estonia, Finland, France,
              Germany, Greece, Hungary, Ireland, Italy, Latvia, Liechtenstein, Lithuania,
              Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia,
              Slovenia, Spain, Sweden.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  mounted() {
    window.addEventListener("scroll", this.handleScrollLanding);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScrollLanding);
  },
  methods: {
    navigateToPage(page, id) {
      this.$router.push(`/${page}`);
    },
    scrollToDiv(mydivid) {
      const target = document.getElementById(`${mydivid}`);
      const currentScrollPosition = window.pageYOffset;
      const distanceToTarget = target.offsetTop - currentScrollPosition;

      window.scroll(0, distanceToTarget);
    },
    handleScrollLanding() {
      const headerPropTracker = document.getElementById("landing__jumbotrontop--header");
      const rect = headerPropTracker.getBoundingClientRect();
      const header = document.getElementById("header");
      //const headerSearch = document.getElementById("header__search");
      const loginBtn = document.getElementById("login-btn");

      if (rect.top <= 116.5) {
        header.classList.add("scrolled-far-enough");
        //headerSearch.classList.add("scrolled-far-enough");
        loginBtn.classList.add("scrolled-far-enough");
      } else {
        header.classList.remove("scrolled-far-enough");
        //headerSearch.classList.remove("scrolled-far-enough");
        loginBtn.classList.remove("scrolled-far-enough");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.landing {
  min-height: 100vh;
  background: $white;

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100vw;
  }

  &__jumbotron {
    color: $white;
    position: relative;
  }

  &__jumbotrontop {
    display: flex;
    flex-direction: column;
    height: #{scaleValue(630)};
    padding: 0 #{scaleValue(220)};
    padding-top: #{scaleValue(170)};
    background-image: linear-gradient(
        to bottom,
        rgba($landing-primary, 1),
        rgba($landing-primary, 0.8)
      ),
      url(/imgs/skyline.avif);
    background-size: cover;
    background-position: top;
    position: relative;

    @media only screen and (max-width: 414px) {
      height: #{scaleValue(3200)};
      padding: 0 #{scaleValue(60)};
      padding-top: #{scaleValue(500)};
    }

    &--header {
      font-size: #{scaleValue(60)};
      font-weight: 300;
      display: flex;
      flex-direction: column;

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(160)};
      }
    }

    &--sub {
      line-height: #{scaleValue(25)};
      font-size: #{scaleValue(16)};
      margin-top: #{scaleValue(17)};

      @media only screen and (max-width: 414px) {
        line-height: #{scaleValue(100)};
        font-size: #{scaleValue(66)};
        margin-top: #{scaleValue(100)};
      }
    }

    &--btns {
      @include flex-align;
      margin-top: #{scaleValue(17)};

      @media only screen and (max-width: 414px) {
        margin-top: #{scaleValue(200)};
      }

      & button {
        padding: #{scaleValue(12)} #{scaleValue(19)};
        font-size: #{scaleValue(13)};
        text-transform: uppercase;
        background: $landing-green;
        border-radius: 3rem;

        @media only screen and (max-width: 414px) {
          padding: #{scaleValue(60)} #{scaleValue(100)};
          font-size: #{scaleValue(50)};
          border-radius: 8rem;
        }
      }
    }
  }

  &__jumbotronassetclasses {
    padding: $basic-landing-area-padding;
    width: 100vw;
    background: transparent;
    position: absolute;
    top: #{scaleValue(540)};
    left: 0;

    display: flex;
    justify-content: center;
    z-index: 2;

    @media only screen and (max-width: 414px) {
      top: #{scaleValue(2300)};
      padding: #{scaleValue(19)};
    }

    &--content {
      border-radius: $box-radius;
      background: $white;
      width: 100%;
      height: #{scaleValue(200)};

      position: relative;
      padding: #{scaleValue(21)};
      display: flex;

      @media only screen and (max-width: 414px) {
        height: #{scaleValue(800)};
        display: grid;
        grid-gap: #{scaleValue(50)};
        grid-template-columns: repeat(5, #{scaleValue(1250)});
        overflow: hidden;
      }
    }
  }

  &__jumbotronassetclass {
    display: flex;
    flex-direction: column;
    color: $landing-primary;
    flex: 1;
    position: relative;

    @media only screen and (max-width: 414px) {
      flex-shrink: 0;
      border-radius: #{scaleValue(20)};

      padding: #{scaleValue(70)};
    }

    &--btnarea {
      position: absolute;
      bottom: 0;
      left: 0;
      cursor: pointer;

      @media only screen and (max-width: 414px) {
        bottom: #{scaleValue(70)};
        left: #{scaleValue(70)};
      }

      &:hover {
        & button {
          color: rgba($landing-primary, 0.8);
        }

        & span {
          display: inline-block;
          transition: 0.4s ease;
          transform: translateX(#{scaleValue(5)});
        }
      }
    }

    & button {
      color: $landing-primary;
      font-weight: 500;
      font-size: #{scaleValue(13)};
      transition: all 0.4s ease;

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(60)};
      }
    }

    & p {
      font-size: #{scaleValue(15)};
      line-height: #{scaleValue(22)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
        line-height: #{scaleValue(100)};
      }
    }

    & h4 {
      background: linear-gradient(to right, #12225c 2%, #6c3483 70%);
      background-size: 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
      text-transform: uppercase;
      font-size: #{scaleValue(21)};
      margin-bottom: #{scaleValue(21)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(100)};
      }
    }

    &:not(:last-child) {
      border-right: $border;
      border-color: $second-border-color;
      border-width: #{scaleValue(2)};
      padding-right: #{scaleValue(21)};
    }

    &:not(:first-child) {
      padding-left: #{scaleValue(21)};

      & .landing__jumbotronassetclass {
        &--btnarea {
          left: #{scaleValue(21)};
        }
      }
    }
  }

  &__jumbotronbottom {
    position: relative;
    min-height: #{scaleValue(200)};
    background: $landing-primary;
    padding: 0 #{scaleValue(220)};
    padding-top: #{scaleValue(190)};
    padding-bottom: #{scaleValue(80)};
    display: flex;
    justify-content: space-between;

    @media only screen and (max-width: 414px) {
      height: auto;
      flex-direction: column;
      padding: 0 #{scaleValue(60)};
    }

    &--left {
      margin-right: #{scaleValue(19)};

      @media only screen and (max-width: 414px) {
        width: auto;
        padding-top: #{scaleValue(190)};
      }
    }

    &--right-grid {
      display: grid;
      grid-template-columns: repeat(2, #{scaleValue(340)});
      grid-gap: #{scaleValue(19)};

      @media only screen and (max-width: 414px) {
        width: auto;
        padding-top: #{scaleValue(190)};
        padding-bottom: #{scaleValue(190)};
        grid-template-columns: repeat(1, #{scaleValue(1475)});
        grid-gap: #{scaleValue(100)};
      }
    }

    &--right-gridbox {
      border: $border;
      border-radius: $box-radius;
      border-color: $white;
      border-width: #{scaleValue(1)};
      position: relative;
      padding: #{scaleValue(21)};

      @media only screen and (max-width: 414px) {
        padding: #{scaleValue(280)} #{scaleValue(120)};
      }
    }

    &--right-gridboxsvg {
      margin-bottom: #{scaleValue(10)};

      @media only screen and (max-width: 414px) {
        margin-bottom: #{scaleValue(100)};
      }

      & svg {
        height: #{scaleValue(20)};
        width: #{scaleValue(20)};

        @media only screen and (max-width: 414px) {
          height: #{scaleValue(100)};
          width: #{scaleValue(100)};
        }
      }
    }

    &--right-gridboxh4 {
      font-size: #{scaleValue(18)};
      font-weight: 400;
      margin-bottom: #{scaleValue(24)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
        line-height: #{scaleValue(100)};
        margin-bottom: #{scaleValue(50)};
      }
    }

    &--right-gridboxcopy {
      min-height: #{scaleValue(106)};
    }

    &--right-gridboxbtn {
      position: absolute;
      bottom: #{scaleValue(21)};
      left: #{scaleValue(21)};
      display: flex;

      @media only screen and (max-width: 414px) {
        left: #{scaleValue(120)};
        bottom: #{scaleValue(80)};
      }

      & button {
        font-weight: 500;
        font-size: #{scaleValue(13)};

        @media only screen and (max-width: 414px) {
          font-size: #{scaleValue(50)};
        }
      }

      & span {
        &::after {
          border-style: solid;
          content: "";
          display: inline-block;
          vertical-align: baseline;
          position: relative;
          left: 8px;
          transition: all 0.2s ease-in-out;
          margin-right: -10px;

          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 0 6px 10px;
          border-color: transparent transparent transparent #fff;
        }
      }
    }
  }

  &__copyheaderstyle {
    font-size: #{scaleValue(38)};
    font-weight: 400;
    display: flex;
    flex-direction: column;

    @media only screen and (max-width: 414px) {
      font-size: #{scaleValue(100)};
      margin-bottom: #{scaleValue(100)};
    }
  }

  &__copyfontstyle {
    line-height: #{scaleValue(25)};
    font-size: #{scaleValue(16)};
    margin-top: #{scaleValue(17)};

    @media only screen and (max-width: 414px) {
      line-height: #{scaleValue(100)};
      font-size: #{scaleValue(65)};
    }
  }

  &__tradingtypes {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};

    @media only screen and (max-width: 414px) {
      padding: #{scaleValue(70)};
      padding-top: #{scaleValue(200)};
      padding-bottom: #{scaleValue(200)};
    }

    & h2 {
      @include h2-landing;
    }
  }

  &__tradingtypesbody {
    display: flex;
    justify-content: space-between;
    position: relative;

    @media only screen and (max-width: 414px) {
      flex-direction: column;
    }
  }

  &__tradingtypesbox {
    position: relative;
    display: flex;
    flex-direction: column;
    width: #{scaleValue(400)};
    padding-bottom: #{scaleValue(30)};
    color: $landing-primary;
    margin-bottom: #{scaleValue(30)};

    @media only screen and (max-width: 414px) {
      width: auto;
      margin-bottom: #{scaleValue(100)};
    }

    &:not(:last-child) {
      border-bottom: $border;
      border-color: $second-border-color;
      border-width: #{scaleValue(2)};
    }

    &--btnarea {
      position: absolute;
      bottom: #{scaleValue(20)};
      left: 0;
      cursor: pointer;

      &:hover {
        & button {
          color: rgba($landing-primary, 0.8);
        }

        & span {
          display: inline-block;
          transition: 0.4s ease;
          transform: translateX(#{scaleValue(5)});
        }
      }
    }

    & button {
      color: $landing-primary;
      font-weight: 500;
      font-size: #{scaleValue(13)};
      transition: all 0.4s ease;
      font-weight: 600;
    }

    &--p {
      font-size: #{scaleValue(16)};
      line-height: #{scaleValue(26)};
      color: $index-body;
      margin-bottom: #{scaleValue(30)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(65)};
        line-height: #{scaleValue(90)};
        margin-bottom: #{scaleValue(60)};
      }
    }

    &--h4 {
      color: $landing-primary;
      font-weight: 600;
      font-size: #{scaleValue(20)};
      margin-bottom: #{scaleValue(10)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
        line-height: #{scaleValue(90)};
        margin-bottom: #{scaleValue(60)};
      }
    }
  }

  &__rewards {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};
    padding-bottom: #{scaleValue(80)};

    background: linear-gradient(to right, #12225c 2%, #6c3483 70%);

    @media only screen and (max-width: 414px) {
      padding: #{scaleValue(70)};
      padding-top: #{scaleValue(200)};
      padding-bottom: #{scaleValue(200)};
    }

    &--h2 {
      @include h2-landing;
      color: $white;
    }

    &--h3 {
      color: $green;
      font-size: #{scaleValue(15)};
      font-weight: 600;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: #{scaleValue(10)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(90)};
      }
    }
  }

  &__rewardsbody {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: #{scaleValue(19)};

    @media only screen and (max-width: 414px) {
      grid-template-columns: repeat(1, #{scaleValue(1475)});
      grid-gap: #{scaleValue(70)};
    }
  }

  &__reward {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: $box-radius;
    background: $light-black;
    padding: #{scaleValue(21)};
    border: $border;
    border-color: $green;
    border-width: #{scaleValue(2)};

    @media only screen and (max-width: 414px) {
      padding: #{scaleValue(100)};
    }

    & figure {
      height: #{scaleValue(40)};
      width: #{scaleValue(40)};
      overflow: hidden;
      border-radius: 100%;
      margin-bottom: #{scaleValue(15)};

      @media only screen and (max-width: 414px) {
        height: #{scaleValue(140)};
        width: #{scaleValue(140)};
        margin-bottom: #{scaleValue(100)};
      }

      & img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    & h5 {
      text-transform: uppercase;
      font-weight: 500;
      font-size: #{scaleValue(16)};
      margin-bottom: #{scaleValue(7)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
        margin-bottom: #{scaleValue(70)};
      }
    }

    & span {
      display: inline-block;

      &:nth-child(3) {
        font-size: #{scaleValue(13)};
        color: $greyed-out;
        margin-bottom: #{scaleValue(17)};

        @media only screen and (max-width: 414px) {
          font-size: #{scaleValue(50)};
        }
      }

      &:nth-child(4) {
        font-size: #{scaleValue(30)};
        color: $green;
        font-weight: 200;

        @media only screen and (max-width: 414px) {
          font-size: #{scaleValue(60)};
        }
      }
    }
  }

  &__perks {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};
    padding-bottom: #{scaleValue(80)};

    display: flex;
    justify-content: space-between;
    background: linear-gradient(to right, #6c3483 2%, #12225c 70%);
    background: $landing-primary;

    flex-direction: column;

    @media only screen and (max-width: 414px) {
      padding: #{scaleValue(70)};
      padding-top: #{scaleValue(130)};
      padding-bottom: #{scaleValue(130)};
    }
  }

  &__perksarea {
    display: flex;
    flex-direction: column;

    &:nth-child(1) {
      width: #{scaleValue(500)};

      @media only screen and (max-width: 414px) {
        width: auto;
      }
    }

    &.bottomrow {
      flex-direction: row;
      margin-top: #{scaleValue(30)};
      justify-content: space-between;
      flex-wrap: wrap;

      @media only screen and (max-width: 414px) {
        flex-direction: column;
        padding-top: #{scaleValue(130)};
      }
    }

    & h4 {
      color: $green;
      font-size: #{scaleValue(15)};
      font-weight: 600;
      text-transform: uppercase;
      text-align: left;
      margin-bottom: #{scaleValue(10)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(65)};
        margin-bottom: #{scaleValue(40)};
      }
    }

    & h3 {
      @include h2-landing;
      color: $white;
      font-size: #{scaleValue(28)};
      font-weight: 600;
      text-align: left;
      margin: 0;
      margin-bottom: #{scaleValue(20)};
      width: auto;
    }

    &--p {
      opacity: 0.7;
      font-weight: 500;
      line-height: #{scaleValue(23)};
      font-size: #{scaleValue(15)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(68)};
        line-height: #{scaleValue(95)};
      }
    }

    & button {
      box-shadow: 1px 1px 8px rgba($landing-primary, 0.3);
    }
  }

  &__perk {
    border-radius: $box-radius;
    background: rgba($defipopup-body, 0.6);
    padding: #{scaleValue(31)};
    width: #{scaleValue(570)};
    flex-shrink: 0;

    margin-bottom: #{scaleValue(20)};

    @media only screen and (max-width: 414px) {
      width: auto;
      margin-bottom: #{scaleValue(100)};
      padding: #{scaleValue(120)};
    }

    &--section-header {
      display: inline-block;
      margin-bottom: #{scaleValue(8)};
      font-weight: 600;

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(90)};
      }
    }

    &--section-copy {
      line-height: #{scaleValue(21)};
      font-size: #{scaleValue(14)};
      opacity: 0.9;
      margin-top: #{scaleValue(18)};

      @media only screen and (max-width: 414px) {
        line-height: #{scaleValue(100)};
        font-size: #{scaleValue(70)};
        margin-top: #{scaleValue(100)};
        margin-bottom: #{scaleValue(100)};
      }
    }

    &--list {
      margin-top: #{scaleValue(18)};
      font-size: #{scaleValue(14)};

      @media only screen and (max-width: 414px) {
        line-height: #{scaleValue(100)};
        font-size: #{scaleValue(65)};
      }
    }

    &--listitem {
      margin-bottom: #{scaleValue(18)};
      font-size: #{scaleValue(14)};

      @media only screen and (max-width: 414px) {
        line-height: #{scaleValue(100)};
        font-size: #{scaleValue(65)};
      }
    }

    &--listitemfeaturesheader {
      display: block;
      margin-bottom: #{scaleValue(10)};
    }

    &--listitemfeatures {
      display: flex;
      flex-direction: column;
      line-height: #{scaleValue(30)};

      @media only screen and (max-width: 414px) {
        line-height: #{scaleValue(120)};
      }
    }

    &--listitemboldtext {
      font-weight: 600;
      font-size: #{scaleValue(15)};
      color: $green;

      @media only screen and (max-width: 414px) {
        font-weight: 600;
        font-size: #{scaleValue(60)};
      }
    }
  }

  &__inthenews {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};
    padding-bottom: #{scaleValue(80)};
    background: $light-black;
  }

  &__inthenewsbody {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: #{scaleValue(19)};
  }

  &__inthenewscard {
    border-radius: $box-radius;
    background: rgba($defipopup-body, 0.4);
    padding: #{scaleValue(31)};
    height: #{scaleValue(250)};
    position: relative;

    &--header {
      display: flex;
      justify-content: space-between;
      margin-bottom: #{scaleValue(20)};

      & span {
        display: inline-block;
        text-transform: uppercase;

        &:nth-child(1) {
          font-size: #{scaleValue(14)};
          font-weight: 500;
          opacity: 0.7;
        }

        &:nth-child(2) {
          font-size: #{scaleValue(13)};
          color: $green;
        }
      }
    }

    &--copy {
      font-weight: 600;
      font-size: #{scaleValue(17)};
      margin-bottom: #{scaleValue(20)};
      line-height: #{scaleValue(27)};
    }

    &--btn {
      width: 100%;
      position: absolute;
      bottom: #{scaleValue(31)};
      left: 0;
      padding: 0 #{scaleValue(31)};
    }

    & button {
      width: 100%;
      background: $landing-primary;
      padding: #{scaleValue(14)};
      font-size: #{scaleValue(16)};
      font-weight: 600;
      box-shadow: 1px 1px 8px rgba(18, 34, 92, 0.5);
    }
  }

  &__disclaimers {
    padding: $basic-landing-area-padding;

    background: $light-black;

    @media only screen and (max-width: 414px) {
      padding: 0 #{scaleValue(60)};
    }

    &--content {
      border-top: $border;
      padding-top: #{scaleValue(80)};
      padding-bottom: #{scaleValue(80)};

      @media only screen and (max-width: 414px) {
        padding-top: #{scaleValue(160)};
        padding-bottom: #{scaleValue(160)};
      }

      & p {
        font-size: #{scaleValue(13)};
        color: rgba($white, 0.7);
        opacity: 0.9;
        line-height: #{scaleValue(23)};
        margin-bottom: #{scaleValue(30)};

        @media only screen and (max-width: 414px) {
          font-size: #{scaleValue(50)};
          line-height: #{scaleValue(100)};
        }
      }
    }
  }
}
</style>
