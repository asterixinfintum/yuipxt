<template>
  <div>
    <div class="sidenav">
      <div
        class="sidenav__item"
        @click="navigateToPage('overview')"
        :class="{ current: currentRoute === 'overview' }"
      >
        <div class="sidenav__item--svg">
          <span>
            <svg
              viewBox="0 0 24 24"
              focusable="false"
              class="chakra-icon css-onkibi"
              aria-hidden="true"
            >
              <g fill="currentColor" fill-rule="nonzero">
                <g id="circular-graph">
                  <path
                    d="M20.23,0H3.77C1.69,0,0,1.69,0,3.77V20.23c0,2.08,1.69,3.77,3.77,3.77H20.23c2.08,0,3.77-1.69,3.77-3.77V3.77c0-2.08-1.69-3.77-3.77-3.77ZM3.77,2.06H20.23c.95,0,1.71,.77,1.71,1.71v.76L13.45,13.23l-3.23-4.53c-.19-.26-.48-.44-.8-.47s-.65,.07-.88,.29L2.06,14.46V3.77c0-.95,.77-1.71,1.71-1.71ZM20.23,21.94H3.77c-.95,0-1.71-.77-1.71-1.71v-2.71s.04-.02,.05-.03l7.01-6.43,3.27,4.59c.19,.27,.5,.45,.84,.47,.33,.03,.66-.1,.9-.34l7.82-8.01v12.45c0,.95-.77,1.71-1.71,1.71Z"
                    id="Shape"
                  ></path>
                </g>
              </g>
            </svg>
          </span>
        </div>
        <div class="sidenav__item--text">Financial Overview</div>
      </div>

      <div
        class="sidenav__item"
        @click="navigateToPage('fiatandspot')"
        :class="{ current: currentRoute === 'fiatandspot' }"
      >
        <div class="sidenav__item--svg">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-199zucj"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15 3.5a5.502 5.502 0 00-5.302 4.032 7.502 7.502 0 016.77 6.77A5.502 5.502 0 0015 3.5zM14.5 15a5.5 5.5 0 10-11 0 5.5 5.5 0 0011 0zm-8 0L9 17.5l2.5-2.5L9 12.5 6.5 15zM9 4H4v5l5-5zm11 16h-5l5-5v5z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
        <div class="sidenav__item--text">Spot</div>
      </div>

      <div
        class="sidenav__item"
        @click="navigateToPage('margin')"
        :class="{ current: currentRoute === 'margin' }"
      >
        <div class="sidenav__item--svg">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-199zucj"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-5.031L5.969 7.5 7.5 9.031l1.531-1.53L7.5 5.968zM20 4h-8l3.125 3.125L4.061 18.19l1.768 1.768L16.893 8.893 20 12V4zm0 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
        <div class="sidenav__item--text">Margin Wallet</div>
      </div>

      <div
        class="sidenav__item"
        @click="navigateToPage('swaps')"
        :class="{ current: currentRoute === 'swap' }"
      >
        <div class="sidenav__item--svg">
          <span>
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
          </span>
        </div>
        <div class="sidenav__item--text">Swaps/Convertions</div>
      </div>

      <!-- <div class="sidenav__item"
                @click="navigateToPageWithParams('trade', originalList[0]._id)"
                :class="{ 'current': currentRoute === 'trade' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1pj0ttb"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 4v7h7V4H4zm9 7V4h7v7h-7zm3.5 9.743L12.257 16.5l4.243-4.243 4.243 4.243-4.243 4.243zM4 13h7v7H4v-7z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Trade</div>
            </div>-->

      <!--<div class="sidenav__item"
                @click="navigateToPage('defi')"
                :class="{ 'current': currentRoute === 'defi' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-19ss7aa"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.014 1a4.912 4.912 0 00-4.218 7.431 6.703 6.703 0 00-4.006 5.717H2v1.786h1.915a6.704 6.704 0 002.758 4.155l-1.648 1.648L6.287 23l2.07-2.07a6.694 6.694 0 002.118.342h5.304l1.591 1.591 1.263-1.262-1.34-1.34 4.35-4.35v-2.687h-1.934a6.126 6.126 0 00-1.398-2.915l2.435-2.435h-4.228A4.912 4.912 0 0012.014 1zM8.888 5.912a3.126 3.126 0 116.251 0 3.126 3.126 0 01-6.251 0zm1.786 0l1.34-1.34 1.34 1.34-1.34 1.34-1.34-1.34zm-.926 7.322h4.53v-1.786h-4.53v1.786z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Optimize Your Returns</div>
            </div>

            <div class="sidenav__item"
                @click="navigateToPage('staking')"
                :class="{ 'current': currentRoute === 'staking' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 3H8.5v6H4v7.5A3.5 3.5 0 007.5 20H16a4 4 0 004-4V3zM6.5 11.5h2v5a1 1 0 11-2 0v-5zm10.364 3.75H11.66v-7.5h5.203v1.7h-3.328v1.164h2.854v1.69h-2.854v1.246h3.328v1.7z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Today's Earnings</div>
            </div>

            <div class="sidenav__item"
                @click="navigateToPage('tradingbots')"
                :class="{ 'current': currentRoute === 'tradingbots' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-199zucj"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0002 9V4H15.0002L20.0002 9ZM4.00024 15V20H9.00024L4.00024 15ZM13.5387 13.5384C12.2804 14.7967 10.5589 15.3096 8.92307 15.0771C8.69052 13.4412 9.20343 11.7196 10.4618 10.4613C11.7201 9.20298 13.4415 8.69007 15.0774 8.92255C15.31 10.5585 14.7971 12.28 13.5387 13.5384ZM15.0774 8.92255C14.9174 7.79695 14.4045 6.71187 13.5387 5.84606C11.4145 3.72189 7.97057 3.72189 5.8464 5.84606C3.72223 7.97023 3.72223 11.4142 5.8464 13.5384C6.71226 14.4042 7.79741 14.9171 8.92307 15.0771C9.08307 16.2027 9.59598 17.2878 10.4618 18.1536C12.586 20.2778 16.0299 20.2778 18.1541 18.1536C20.2783 16.0294 20.2783 12.5855 18.1541 10.4613C17.2882 9.59543 16.2031 9.08252 15.0774 8.92255Z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Trading Bots</div>
            </div>

            <div class="sidenav__item"
                @click="navigateToPage('createbot')"
                :class="{ 'current': currentRoute === 'createbot' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-19ss7aa"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 4h6v2h-2v1h7v4.5h2v4h-2V20H4v-4.5H2v-4h2V7h7V6H9V4zm1 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-1 3.703h6L13.704 16.5h-3.4L9 15.203zM15.5 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Create Trading Bot</div>
            </div>

            <div class="sidenav__item"
                @click="navigateToPage('dapps')"
                :class="{ 'current': currentRoute === 'dapps' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg viewBox="0 0 300 185" focusable="false" class="chakra-icon css-onkibi" aria-hidden="true"><svg><path d="M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z" fill="currentColor"></path></svg></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">dApps</div>
            </div>-->

      <!--<div class="sidenav__item"
                @click="navigateToPage('tokenizedstocks')"
                :class="{ 'current': currentRoute === 'tokenizedstocks' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1pj0ttb"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-4l4 4-4 4-4-4 4-4z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">Tokenized Stocks</div>
            </div>-->

      <div class="sidenav__demarcation">
        <span class="sidenav__demarcation--line"></span>
      </div>

      <div
        class="sidenav__item"
        @click="navigateToPage('transactionhistory')"
        :class="{ current: currentRoute === 'transactionhistory' }"
      >
        <div class="sidenav__item--svg">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              class="css-19ss7aa"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.597 16.594A6.48 6.48 0 0112 18.498h-1.25v2.5H12a9 9 0 006.364-15.364 9 9 0 00-12.728 0l1.767 1.768a6.5 6.5 0 019.193 9.192zM13.25 8h-2.5v4.518l3.185 3.185 1.768-1.768-2.453-2.453V8zM5.627 9.568v1.2l-.092.006c-.767.062-1.371.29-1.783.662-.41.37-.639.891-.639 1.564 0 .684.24 1.223.676 1.642.438.421 1.08.726 1.889.925l.076.019v1.901l-.123-.029a3.94 3.94 0 01-.838-.305 2.512 2.512 0 01-.596-.4L3.14 17.935c.446.416 1.309.784 2.268.974l.08.016v1.277h1.578v-1.207l.086-.011c.796-.11 1.357-.448 1.718-.891a2.457 2.457 0 00.532-1.562c0-.669-.246-1.177-.668-1.568-.426-.394-1.037-.675-1.772-.874l-.074-.02v-1.802l.125.033c.406.106.816.31 1.099.558l1.035-1.136c-.43-.4-1.102-.697-1.875-.861l-.08-.017V9.568H5.628zm.19 4.272l-.137-.056c-.221-.09-.381-.185-.485-.303a.599.599 0 01-.149-.418c0-.133.028-.298.126-.448.1-.152.265-.279.522-.34l.123-.03v1.595zm1.057 3.678v-1.732l.147.08a.934.934 0 01.376.346.936.936 0 01.122.483.9.9 0 01-.096.429.744.744 0 01-.414.343l-.135.05z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
        <div class="sidenav__item--text">My Transaction History</div>
      </div>

      <!--<div class="sidenav__item"
            @click="navigateToPage('identification')"
                :class="{ 'current': currentRoute === 'verification' }">
                <div class="sidenav__item--svg">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-1pj0ttb"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3v18h14V7l-4-4H5zm3 6.5h8V12H8V9.5zm0 5h8V17H8v-2.5z" fill="currentColor"></path></svg>
                    </span>
                </div>
                <div class="sidenav__item--text">My Identification</div>
            </div>-->

      <div
        class="sidenav__item"
        @click="navigateToPage('settings')"
        :class="{ current: currentRoute === 'settings' }"
      >
        <div class="sidenav__item--svg">
          <span>
            <svg
              viewBox="0 0 14 14"
              focusable="false"
              class="chakra-icon css-onkibi"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M14,7.77 L14,6.17 L12.06,5.53 L11.61,4.44 L12.49,2.6 L11.36,1.47 L9.55,2.38 L8.46,1.93 L7.77,0.01 L6.17,0.01 L5.54,1.95 L4.43,2.4 L2.59,1.52 L1.46,2.65 L2.37,4.46 L1.92,5.55 L0,6.23 L0,7.82 L1.94,8.46 L2.39,9.55 L1.51,11.39 L2.64,12.52 L4.45,11.61 L5.54,12.06 L6.23,13.98 L7.82,13.98 L8.45,12.04 L9.56,11.59 L11.4,12.47 L12.53,11.34 L11.61,9.53 L12.08,8.44 L14,7.75 L14,7.77 Z M7,10 C5.34,10 4,8.66 4,7 C4,5.34 5.34,4 7,4 C8.66,4 10,5.34 10,7 C10,8.66 8.66,10 7,10 Z"
              ></path>
            </svg>
          </span>
        </div>
        <div class="sidenav__item--text">Settings</div>
      </div>
    </div>
  </div>
</template>

<script>
import generalutilities from "@/mixins/generalutilities.js";
import listMixin from "@/mixins/list";

export default {
  data() {
    return {
      current: "overview",
    };
  },
  mixins: [generalutilities, listMixin],
};
</script>

<style lang="scss">
.sidenav {
  border-right: $border;
  height: 100vh;
  width: #{scaleValue(230)};
  padding-top: #{scaleValue(20)};
  position: fixed;
  background: $black-background;
  top: 0;
  left: 0;

  padding-top: #{scaleValue(170)};

  @media only screen and (max-width: 414px) {
    display: none;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: #{scaleValue(10)} #{scaleValue(24)};
    cursor: pointer;
    position: relative;
    margin-bottom: #{scaleValue(14)};

    &--svg {
      margin-right: #{scaleValue(6)};

      @media only screen and (max-width: 414px) {
        margin-right: #{scaleValue(25)};
      }

      & span {
        display: flex;
        align-items: center;

        & svg {
          height: #{scaleValue(22)};
          width: #{scaleValue(22)};
          fill: $white;
          opacity: 0.4;

          @media only screen and (max-width: 414px) {
            height: #{scaleValue(60)};
            width: #{scaleValue(60)};
          }
        }
      }
    }

    &--text {
      display: flex;
      align-items: center;
      font-size: #{scaleValue(12.5)};
    }

    &.current {
      background: $current;
      color: $neon-green;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: #{scaleValue(5)};
        height: 100%;
        background: $primary-color;
      }
    }
  }

  &__demarcation {
    padding: #{scaleValue(10)} #{scaleValue(24)};

    &--line {
      display: inline-block;
      height: 1px;
      width: 100%;
      background: rgba($white, 0.3);
    }
  }
}
</style>
