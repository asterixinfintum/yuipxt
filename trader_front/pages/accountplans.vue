<template>
  <div>
    <div class="content">
      <HeaderBox />

      <div class="content__body">
        <div class="container">
          <SideNav />

          <div class="layout-stretch">
            <PageIndicator
              :page_name="'Account Plans'"
              :showdepositbtn="false"
              :showwithdrawbtn="false"
            />

            <div class="fiatandspot__main layout-padding">
              <div class="accounttypes">
                <div class="accounttypes__content">
                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Standard Prodigy Account
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        Ideal for newcomers, this plan offers weekly market insights and
                        an introduction to trading basics, complemented by monthly
                        sessions with a trading agent for guidance.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$1,000</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>$10 per trade</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>Basic market access</li>
                        <li>Standard customer support</li>
                        <li>Access to basic trading tools and educational resources</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Professional Account:
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        For intermediate traders, this plan provides bi-weekly in-depth
                        market analyses, advanced strategy tutorials, and regular coaching
                        sessions, backed by priority email support.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$5,000</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>$8 per trade</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>All Standard Prodigy features</li>
                        <li>Extended market access</li>
                        <li>Enhanced trading tools</li>
                        <li>Priority customer support</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Elite Gold Account:
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        Advanced traders can benefit from weekly detailed market
                        forecasts, exclusive webinars, and consistent personalized
                        coaching. 24/7 priority support ensures they're always ahead.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$10,000</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>$5 per trade</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>All Professional Account features</li>
                        <li>Access to advanced market data and analytics</li>
                        <li>One-on-one coaching sessions</li>
                        <li>Reduced withdrawal fees</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Pioneer Silver Account:
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        The ultimate offering for seasoned traders, with daily market
                        insights, direct expert access, unlimited sessions with top
                        agents, and early access to new tools and features.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$25,000</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>$3 per trade</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>All Elite Gold Account features</li>
                        <li>Access to exclusive investment opportunities</li>
                        <li>Personal account manager</li>
                        <li>Invitations to webinars and events</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Premier Gold Membership:
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        The ultimate offering for seasoned traders, with daily market
                        insights, direct expert access, unlimited sessions with top
                        agents, and early access to new tools and features.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$50,000</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>$1 per trade</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>All Pioneer Silver Account features</li>
                        <li>Tailored investment advice</li>
                        <li>Higher withdrawal limits</li>
                        <li>Complimentary access to premium market research</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="accounttypes__accounttype">
                    <div class="accounttypes__accounttypecontent">
                      <h2 class="accounttypes__accounttypecontent--h2">
                        Premier Platinum Membership:
                      </h2>
                      <p class="accounttypes__accounttypecontent--copy">
                        The ultimate offering for seasoned traders, with daily market
                        insights, direct expert access, unlimited sessions with top
                        agents, and early access to new tools and features.
                      </p>
                      <div class="accounttypes__accounttypecontent--prices">
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Minumum Balance:</label>
                          <span>$100,000+</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Commision:</label>
                          <span>Zero commission on trades</span>
                        </div>
                        <div class="accounttypes__accounttypecontent--price">
                          <label>Features:</label>
                          <span></span>
                        </div>
                      </div>

                      <ul class="accounttypes__accounttypecontent--listitemfeatures">
                        <li>All Premier Gold Membership features</li>
                        <li>Bespoke financial planning and portfolio management</li>
                        <li>Exclusive VIP customer support</li>
                        <li>Access to invite-only investment opportunities</li>
                      </ul>

                      <div class="accounttypes__accounttypecontent--btns">
                        <button class="btn" @click="$router.push(`/wallet/fiatandspot`)">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>
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
export default {};
</script>

<style lang="scss" scoped>
.accounttypes {
  display: flex;
  width: 100%;
  justify-content: center;

  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: #{scaleValue(16)};

    @media only screen and (max-width: 414px) {
      display: flex;
      flex-direction: column;
    }
  }

  &__accounttype {
    border-radius: $box-radius;
    background: rgba($defipopup-body, 0.6);
    padding: #{scaleValue(31)};
    width: #{scaleValue(570)};
    position: relative;

    @media only screen and (max-width: 414px) {
      width: 100%;
      padding: #{scaleValue(110)};
      margin-bottom: #{scaleValue(100)};
      padding-bottom: #{scaleValue(160)};
    }
  }

  &__accounttypecontent {
    &--h2 {
      margin-bottom: #{scaleValue(40)};
      font-size: #{scaleValue(18)};
      font-weight: 500;

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(70)};
        margin-bottom: #{scaleValue(120)};
      }
    }

    &--copy {
      margin-bottom: #{scaleValue(20)};

      @media only screen and (max-width: 414px) {
        margin-bottom: #{scaleValue(70)};
        font-size: #{scaleValue(60)};
      }
    }

    &--prices {
      margin-bottom: #{scaleValue(17)};

      @media only screen and (max-width: 414px) {
        margin-bottom: #{scaleValue(70)};
        font-size: #{scaleValue(60)};
      }
    }

    &--price {
      margin-bottom: #{scaleValue(17)};

      @media only screen and (max-width: 414px) {
        margin-bottom: #{scaleValue(70)};
        font-size: #{scaleValue(60)};
      }

      & label {
        color: $neon-green;
      }
    }

    &--listitemfeatures {
      & li {
        margin-bottom: #{scaleValue(17)};

        @media only screen and (max-width: 414px) {
          margin-bottom: #{scaleValue(70)};
          font-size: #{scaleValue(60)};
        }
      }

      margin-bottom: #{scaleValue(55)};

      @media only screen and (max-width: 414px) {
        margin-bottom: #{scaleValue(250)};
      }
    }

    &--btns {
      @include flex-align;
      margin-top: #{scaleValue(17)};
      margin-bottom: #{scaleValue(20)};
      position: absolute;
      bottom: 0;
      left: #{scaleValue(31)};

      @media only screen and (max-width: 414px) {
        margin-top: #{scaleValue(200)};
        padding-bottom: #{scaleValue(120)};
        left: #{scaleValue(120)};
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
}
</style>
