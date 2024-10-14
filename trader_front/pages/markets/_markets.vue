<template>
  <div>
    <div>
      <TraderHeader />

      <div class="markets">
        <div class="markets__content">
          <div class="markets__content--h1">
            <h1>
              <span class="white-header">Markets Overview</span>
              <span class="grey-header">Trading Data</span>
            </h1>
          </div>

          <div class="markets__topgrid">
            <div class="markets__topgriditem">
              <h3>Top Commodities</h3>
              <div class="markets__topgriditem--list">
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
              </div>
            </div>

            <div class="markets__topgriditem">
              <h3>Top Stocks</h3>
              <div class="markets__topgriditem--list">
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
                <div class="markets__topgriditem--listitem">
                  <div class="markets__topgriditem--listitemname">
                    <figure>
                      <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                    </figure>
                    <span class="coin">BTC</span>
                  </div>
                  <div class="markets__topgriditem--listitemprice">$301.50</div>
                  <div class="markets__topgriditem--listitempricechange">$301.50</div>
                </div>
              </div>
            </div>
          </div>

          <div class="markets__content--categories">
            <span>Crypto</span>
            <span>Stock</span>
            <span>Commodities</span>
          </div>

          <div class="markets__content--search" ref="search">
            <span class="svgmagnifglass">
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
              <input placeholder="Find an asset" ref="searchinput" />
            </span>
          </div>

          <div class="markets__list">
            <div class="markets__list--header markets__list--grid">
              <div class="markets__list--itemasset markets__list--itemarea">
                <span>Name</span>
              </div>
              <div class="markets__list--itemprice markets__list--itemarea">
                <span>Price</span>
              </div>
              <div class="markets__list--itemchange markets__list--itemarea">
                <span>Change</span>
              </div>
              <div class="markets__list--itemvolume markets__list--itemarea">
                <span>24h Volume</span>
              </div>
              <div class="markets__list--itemarea">
                <span>Actions</span>
              </div>
            </div>

            <div class="markets__list--items">
              <div class="markets__list--item markets__list--grid">
                <div class="markets__list--itemasset markets__list--itemarea">
                  <figure>
                    <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                  </figure>
                  <span class="coin">BTC</span>
                  <span class="name">Bitcoin</span>
                </div>
                <div class="markets__list--itemprice markets__list--itemarea">
                  <span>$46,071.00</span>
                </div>
                <div class="markets__list--itemchange markets__list--itemarea">
                  <span>-1.67</span>
                </div>
                <div class="markets__list--itemvolume markets__list--itemarea">
                  <span>$56.99B</span>
                </div>
                <div class="markets__list--itemactions markets__list--itemarea">
                  <span>Trade</span>
                  <span>Swap/Transfer</span>
                </div>
              </div>

              <div class="markets__list--item markets__list--grid">
                <div class="markets__list--itemasset markets__list--itemarea">
                  <figure>
                    <img src="https://assets.coincap.io/assets/icons/256/eth.png" />
                  </figure>
                  <span class="coin">BTC</span>
                  <span class="name">Bitcoin</span>
                </div>
                <div class="markets__list--itemprice markets__list--itemarea">
                  <span>$46,071.00</span>
                </div>
                <div class="markets__list--itemchange markets__list--itemarea">
                  <span>-1.67</span>
                </div>
                <div class="markets__list--itemvolume markets__list--itemarea">
                  <span>$56.99B</span>
                </div>
                <div class="markets__list--itemactions markets__list--itemarea">
                  <span>Trade</span>
                  <span>Swap/Transfer</span>
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
export default {
  mounted() {
    this.$refs.searchinput.addEventListener("focus", () => {
      this.$refs.search.classList.add("focus");
    });

    this.$refs.searchinput.addEventListener("blur", () => {
      this.$refs.search.classList.remove("focus");
    });
  },
};
</script>

<style lang="scss" scoped>
.markets {
  padding: #{scaleValue(40)} #{scaleValue(150)};

  &__content {
    &--h1 {
      display: flex;
      align-items: center;
      margin-bottom: #{scaleValue(30)};

      & h1 {
        font-weight: 500;

        & span {
          font-size: #{scaleValue(25)};

          &.white-header {
            margin-right: #{scaleValue(15)};
          }

          &.grey-header {
            font-size: #{scaleValue(18)};
            color: rgba($white, 0.5);
          }
        }
      }
    }

    &--categories {
      display: flex;
      align-items: center;

      & span {
        margin-right: #{scaleValue(30)};
        color: rgba($white, 0.6);
        font-size: #{scaleValue(12)};
        cursor: pointer;

        &.current {
          color: $neon-blue;
        }
      }
    }

    &--search {
      display: flex;
      background: rgba($black, 0.3);
      align-items: center;
      margin-top: #{scaleValue(30)};
      padding: 0 #{scaleValue(30)};
      overflow: hidden;
      border-radius: #{scaleValue(10)};
      border: 1px solid transparent;
      transition: all 0.5s ease;

      &:hover {
        border: 1px solid $neon-blue;
      }

      &.focus {
        border: 1px solid $neon-blue;
      }

      & span {
        height: 100%;

        &.input {
          flex-grow: 1;
        }

        &.svgmagnifglass {
          display: flex;
          align-items: center;
          margin-right: #{scaleValue(10)};
        }

        & input {
          height: #{scaleValue(45)};
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: $white;
          font-size: #{scaleValue(15)};
        }

        & svg {
          height: #{scaleValue(15)};
          width: #{scaleValue(15)};
          fill: rgba($white, 0.5);
          color: rgba($white, 0.5);
        }
      }
    }
  }

  &__topgrid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: #{scaleValue(20)};
    margin-bottom: #{scaleValue(40)};
  }

  &__topgriditem {
    border: 1px solid rgba($white, 0.08);
    border-radius: #{scaleValue(9)};
    padding: #{scaleValue(17)};

    & h3 {
      font-size: #{scaleValue(13)};
      margin-bottom: #{scaleValue(20)};
      color: rgba($white, 0.6);
    }

    &--listitem {
      margin-bottom: #{scaleValue(20)};
      display: flex;
      justify-content: space-between;

      &:last-child {
        margin: 0;
      }
    }

    &--listitemname {
      display: flex;
      align-items: center;
      font-size: #{scaleValue(13.5)};
      color: rgba($white, .7); 

      & figure {
        height: #{scaleValue(20)};
        width: #{scaleValue(20)};
        overflow: hidden;
        border-radius: 100%;
        margin-right: #{scaleValue(8)};

        & img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }

    &--listitempricechange {
      font-size: #{scaleValue(13)};
    }

    &--listitemprice {
      font-size: #{scaleValue(13)};
      color: rgba($white, .5); 
    }

    &--listitem {
      display: flex;
      align-items: center;
    }
  }

  &__list {
    margin-top: #{scaleValue(60)};

    &--grid {
      display: grid;
      align-items: center;
      grid-template-columns: #{scaleValue(280)} repeat(4, 1fr);
    }

    &--header {
      margin-bottom: #{scaleValue(30)};
      font-size: #{scaleValue(11)};
      color: rgba($white, 0.5);
    }

    &--item {
      font-size: #{scaleValue(12.5)};
      padding: #{scaleValue(20)} 0;
    }

    &--itemarea {
      display: flex;
      align-items: center;
      text-align: right;
      justify-content: flex-end;
    }

    &--itemasset {
      justify-content: flex-start;

      & figure {
        height: #{scaleValue(25)};
        width: #{scaleValue(25)};
        border-radius: 100%;
        overflow: hidden;
        margin-right: #{scaleValue(10)};

        & img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }

      & span {
        &.coin {
          margin-right: #{scaleValue(5)};
        }

        &.name {
          color: rgba($white, 0.5);
          font-size: #{scaleValue(12)};
        }
      }
    }

    &--itemactions {
      color: $neon-pink;

      & span {
        margin-left: #{scaleValue(20)};
      }
    }
  }
}
</style>
