<template>
  <div>
    
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import socket from "@/plugins/socket.js";

export default {
  data() {
    return {
      announcements: [`BVX Token (BVXT) ICO launches Soon!`],
    };
  },
  watch: {
    client(newval, oldval) {
      if (newval) {
        socket.emit("clientloggedin", { clientid: newval._id });
      }
    },
  },
  computed: {
    ...mapState({
      client: (state) => state.auth.client,
    }),
  },
  mounted() {
    if (this.client) {
      this.getuserwallets(this.client._id);

      socket.emit("clientloggedin", { clientid: this.client._id });
    }

    window.addEventListener("scroll", this.handleScrollLanding);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScrollLanding);
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
  },
};
</script>

<style lang="scss">
$landing-textcolor: #141d22;

@mixin greenbtnlanding {
  padding: #{scaleValue(15)} #{scaleValue(19)};
  font-size: #{scaleValue(13)};
  text-transform: uppercase;
  background: $landing-green;
  border-radius: 3rem;
  font-weight: 600;
  color: $landing-textcolor;

  &.left {
    margin-right: #{scaleValue(19)};
  }

  &.right {
    background: transparent;
    color: $landing-green;
    border: 1px solid $landing-green;
  }

  @media only screen and (max-width: 414px) {
    padding: #{scaleValue(60)} #{scaleValue(100)};
    font-size: #{scaleValue(50)};
    border-radius: 8rem;
  }
}

.landingpage {
  &__content {
    &--desktopheader {
      @media only screen and (max-width: 412px) {
        display: none;
      }
    }

    &--mobileheader {
      display: none;

      @media only screen and (max-width: 412px) {
        display: block;
      }
    }
  }

  &__jumbotron {
    color: $white;
    height: #{scaleValue(800)};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: #{scaleValue(130)};

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

    @media only screen and (max-width: 412px) {
      height: #{scaleValue(2900)};
      padding-top: #{scaleValue(500)};
    }

    &--area {
      & h1 {
        font-weight: 500;
        font-size: #{scaleValue(50)};
        line-height: #{scaleValue(70)};
        display: flex;
        flex-direction: column;
        text-align: center;

        @media only screen and (max-width: 412px) {
          font-size: #{scaleValue(130)};
          line-height: #{scaleValue(200)};
          font-weight: 400;
        }
      }

      & h2 {
        font-weight: 400;
        font-size: #{scaleValue(18)};
        line-height: #{scaleValue(28)};
        width: #{scaleValue(700)};
        margin-top: #{scaleValue(20)};
        text-align: center;

        @media only screen and (max-width: 412px) {
          font-size: #{scaleValue(60)};
          line-height: #{scaleValue(90)};
          width: #{scaleValue(1500)};
          margin-top: #{scaleValue(55)};
        }
      }

      & button {
        @include greenbtnlanding;

        border-radius: 0.5rem;

        @media only screen and (max-width: 412px) {
          margin-top: #{scaleValue(100)};
        }
      }

      &.buttons {
        margin-top: #{scaleValue(60)};

        @media only screen and (max-width: 412px) {
          display: flex;
          flex-direction: column;
        }
      }
    }

    &--facts {
      display: flex;
      align-items: center;
      margin-top: #{scaleValue(130)};
      padding: #{scaleValue(10)} #{scaleValue(30)};
      color: $landing-textcolor;
      background: $green;
      border-radius: #{scaleValue(20)};
      border: 1px solid $green;

      @media only screen and (max-width: 412px) {
        margin-top: #{scaleValue(400)};
        flex-direction: column;
        align-items: start;
        width: #{scaleValue(1500)};
      }
    }

    &--fact {
      display: flex;
      align-items: center;
      font-size: #{scaleValue(13)};
      margin-right: #{scaleValue(50)};
      font-weight: 600;

      @media only screen and (max-width: 412px) {
        font-size: #{scaleValue(60)};
        font-weight: 400;
        line-height: #{scaleValue(150)};
      }

      &:last-child {
        margin: 0;
      }

      & span {
        display: flex;
        align-items: center;

        &.image {
          margin-right: #{scaleValue(10)};

          @media only screen and (max-width: 412px) {
            width: #{scaleValue(20)};
            height: #{scaleValue(20)};
            margin-right: #{scaleValue(100)};
          }
        }
      }
    }
  }

  &__icoannou {
    margin-top: #{scaleValue(30)};
    width: 100vw;
    min-height: #{scaleValue(30)};

    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 412px) {
      width: 90vw;
      margin-top: #{scaleValue(150)};
    }

    &--content {
      border-radius: 3rem;
      width: #{scaleValue(800)};
      overflow: hidden;

      @media only screen and (max-width: 412px) {
        width: 90vw;
      }
    }
  }

  &__features {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(100)};
    padding-bottom: #{scaleValue(100)};

    background: linear-gradient(
      to bottom,
      rgba($landing-primary, 1),
      rgba($landing-primary, 0.8)
    );

    &--header {
      text-align: center;
      font-size: #{scaleValue(20)};
      margin-bottom: #{scaleValue(50)};

      @media only screen and (max-width: 412px) {
        margin-bottom: #{scaleValue(200)};
        font-size: #{scaleValue(70)};
      }

      & h2 {
        font-weight: 500;
      }
    }

    &--grid {
      display: flex;
      justify-content: center;

      @media only screen and (max-width: 412px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    &--photoarea {
      height: #{scaleValue(500)};
      width: #{scaleValue(700)};
      margin: 0 #{scaleValue(30)};

      @media only screen and (max-width: 412px) {
        height: #{scaleValue(800)};
        width: #{scaleValue(900)};
        margin-top: #{scaleValue(200)};
      }

      & img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
    &--feature {
      text-align: center;
      width: #{scaleValue(350)};
      margin-top: #{scaleValue(60)};

      @media only screen and (max-width: 412px) {
        width: #{scaleValue(1000)};
        margin-top: #{scaleValue(200)};
      }

      & label {
        padding: #{scaleValue(8)};
        border-radius: 3rem;
        background: $greyed-out;
        display: inline-block;
        font-size: #{scaleValue(10)};
        margin-bottom: #{scaleValue(16)};

        @media only screen and (max-width: 412px) {
          font-size: #{scaleValue(60)};
          padding: #{scaleValue(30)} #{scaleValue(60)};
          margin-bottom: #{scaleValue(90)};
          border-radius: 5rem;
        }
      }

      & h3 {
        font-size: #{scaleValue(18)};
        margin-bottom: #{scaleValue(16)};
        font-weight: 400;

        @media only screen and (max-width: 412px) {
          font-size: #{scaleValue(90)};
          margin-bottom: #{scaleValue(70)};
        }
      }

      & p {
        color: rgba($white, 0.5);
        font-size: #{scaleValue(15)};

        @media only screen and (max-width: 412px) {
          font-size: #{scaleValue(50)};
        }
      }
    }
  }

  &__tradingtypes {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};

    background: linear-gradient(
      to bottom,
      rgba($landing-primary, 1),
      rgba($landing-primary, 0.8)
    );

    @media only screen and (max-width: 414px) {
      padding: #{scaleValue(70)};
      padding-top: #{scaleValue(200)};
      padding-bottom: #{scaleValue(200)};
    }

    & h2 {
      @include h2-landing;
      color: $white;
      font-weight: 500;
      margin-bottom: #{scaleValue(100)};
    }
  }

  &__tradingtypesarea {
    &--mast {
      & figure {
        height: #{scaleValue(500)};
        width: #{scaleValue(700)};

        & img {
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
      }
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
    color: rgba($white, 0.9);
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
      color: rgba($white, 0.9);
      font-weight: 500;
      font-size: #{scaleValue(13)};
      transition: all 0.4s ease;
      font-weight: 600;
    }

    &--p {
      font-size: #{scaleValue(16)};
      line-height: #{scaleValue(26)};
      color: rgba($white, 0.9);
      margin-bottom: #{scaleValue(30)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(65)};
        line-height: #{scaleValue(90)};
        margin-bottom: #{scaleValue(60)};
      }
    }

    &--h4 {
      color: $landing-green;
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

  &__stats {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(100)};
    padding-bottom: #{scaleValue(100)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background: linear-gradient(
      to bottom,
      rgba($landing-primary, 1),
      rgba($landing-primary, 0.8)
    );

    &--para {
      font-size: #{scaleValue(15)};
      width: #{scaleValue(500)};
      line-height: #{scaleValue(26)};
      text-align: center;
      margin-top: #{scaleValue(20)};

      @media only screen and (max-width: 414px) {
        font-size: #{scaleValue(50)};
        line-height: #{scaleValue(70)};
        width: #{scaleValue(1400)};
      }
    }

    &--grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: #{scaleValue(40)};

      @media only screen and (max-width: 414px) {
        grid-template-columns: repeat(1, 1fr);
        width: 100%;
      }
    }

    &--item {
      display: flex;
      flex-direction: column;
      padding-left: #{scaleValue(20)};
      padding-right: #{scaleValue(70)};
      border-left: $border;
      padding-bottom: #{scaleValue(20)};
      padding-bottom: #{scaleValue(30)};

      @media only screen and (max-width: 414px) {
        padding-left: #{scaleValue(70)};
        padding-bottom: #{scaleValue(180)};
      }

      & label {
        font-size: #{scaleValue(30)};
        font-weight: 500;
        margin-bottom: #{scaleValue(20)};

        @media only screen and (max-width: 414px) {
          font-size: #{scaleValue(100)};
          margin-bottom: #{scaleValue(50)};
        }
      }

      & span {
        font-size: #{scaleValue(15)};

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

      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 1rem;

      @media only screen and (max-width: 414px) {
        padding-top: #{scaleValue(130)};

        grid-template-columns: repeat(1, 1fr);
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

  &__rewards {
    padding: $basic-landing-area-padding;
    padding-top: #{scaleValue(80)};
    padding-bottom: #{scaleValue(80)};

    background: linear-gradient(to right, #12225c 2%, #6c3483 70%);

    background: linear-gradient(
      to bottom,
      rgba($landing-primary, 1),
      rgba($landing-primary, 0.8)
    );

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

  &__perk {
    border-radius: $box-radius;
    background: rgba($defipopup-body, 0.6);
    padding: #{scaleValue(31)};
    flex-shrink: 0;

    position: relative;
    padding-bottom: #{scaleValue(100)};

    & button {
      position: absolute;
      bottom: #{scaleValue(30)};

      @include greenbtnlanding;

      @media only screen and (max-width: 414px) {
        bottom: #{scaleValue(70)};
      }
    }

    @media only screen and (max-width: 414px) {
      width: auto;
      margin-bottom: #{scaleValue(100)};
      padding: #{scaleValue(120)};

      padding-bottom: #{scaleValue(300)};
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
