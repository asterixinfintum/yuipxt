<template>
  <div>
    <div class="admincontainer assetscontainer">
      <AdminHeader />

      <h2>
        <span>{{ baseasset ? baseasset.name : "" }} Trading Pairs</span>
        <span class="assettype">{{ baseasset ? baseasset.assetType : "" }}</span>
      </h2>

      <div class="assetscontainer__searcharea">
        <input placeholder="Search" v-model="search" />
      </div>

      <div class="assetscontainer__header">
        <div
          class="assetscontainer__headeritm"
          @click="setpairsview('all')"
          :class="{ current: pairsview === 'all' }"
        >
          All
        </div>
        <div
          class="assetscontainer__headeritm"
          @click="setpairsview('crypto')"
          :class="{ current: pairsview === 'crypto' }"
        >
          Crypto
        </div>
        <div
          class="assetscontainer__headeritm"
          @click="setpairsview('stock')"
          :class="{ current: pairsview === 'stock' }"
        >
          Stocks
        </div>
        <div
          class="assetscontainer__headeritm"
          @click="setpairsview('commodity')"
          :class="{ current: pairsview === 'commodity' }"
        >
          Commodities
        </div>

        <div
          class="assetscontainer__headeritm"
          @click="setpairsview('fiat')"
          :class="{ current: pairsview === 'fiat' }"
        >
          Fiat
        </div>
      </div>

      <div class="assetscontainer__header">
        <div class="assetscontainer__checkboxarea">
          <span>Listed</span>
          <span><input v-model="listed" type="checkbox" /></span>
        </div>

        <div class="assetscontainer__checkboxarea">
          <span>Delisted</span>
          <span><input v-model="delisted" type="checkbox" /></span>
        </div>
      </div>

      <div class="assetscontainer__list">
        <div class="assetscontainer__listbody">
          <div
            class="assetscontainer__listbodyitem"
            v-for="{ _id, pair, price, quoteAssetType, listed, inview } in currentList"
          >
            <div class="assetscontainer__listbodyitem--top">
              <div class="assetscontainer__listbodyitem--name">
                {{ pair }}
              </div>
              <div class="assetscontainer__listbodyitem--coin">${{ price }}</div>
            </div>

            <div class="assetscontainer__listbodyitem--bottom">
              <div class="assetscontainer__listbodyitem--price">
                <span class="green-usdt">Price:</span> {{ price }}
              </div>
              <div class="assetscontainer__listbodyitem--symbol">
                <span class="green-usdt">Quote asset type:</span>
                <span class="uppercase">{{ quoteAssetType }}</span>
              </div>
              <div class="assetscontainer__listbodyitem--listed">
                <span class="green-usdt">Listed:</span> {{ listed }}
              </div>
              <div class="assetscontainer__listbodyitem--listed">
                <span class="green-usdt">Inview:</span> {{ inview }}
              </div>
            </div>

            <div class="assetscontainer__listbodyitem--buttons">
              <button
                class="btn rounded-corner delist"
                @click="delist(_id)"
                v-if="listed"
              >
                De-list
              </button>
              <button
                class="btn rounded-corner relist"
                @click="relist(_id)"
                v-if="!listed"
              >
                Re-list
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminMixin from "@/mixins/admin";

export default {
  mixins: [adminMixin],
  data() {
    return {
      assetslist: [],
      baseasset: null,
      pairsview: "all",
      pairs: [],
      search: "",
      listed: false,
      delisted: false,
    };
  },
  watch: {
    baseasset(newval, oldval) {
      this.getpairs();
    },
    pairsview(newval, oldval) {
      this.getpairs();
      this.search = "";
    },
  },
  mounted() {
    this.getbaseasset();
  },
  computed: {
    currentList() {
      const { search, pairs } = this;

      // Normalize the search term
      const normalizedSearch = search.toLowerCase().trim();

      if (pairs.length && search.length) {
        const searchpairs = pairs.filter((pair) =>
          pair.pair.toLowerCase().trim().includes(normalizedSearch)
        );

        if (this.listed) {
          return searchpairs.filter((pair) => pair.listed);
        }

        if (this.delisted) {
          return searchpairs.filter((pair) => !pair.listed);
        }

        return searchpairs;
      }

      if (this.listed) {
        return pairs.filter((pair) => pair.listed);
      }

      if (this.delisted) {
        return pairs.filter((pair) => !pair.listed);
      }

      return pairs; // Return the original list if no search term or if pairs is empty
    },
  },
  methods: {
    async delist(id) {
      const url = `${this.baseurl}/jhgchdh/pair/delist?pairid=${id}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { message } = await response.json();

        alert(message);
        this.getpairs();
      } catch (error) {
        console.log(error);
      }
    },
    async relist(id) {
      const url = `${this.baseurl}/jhgchdh/pair/relist?pairid=${id}`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { message } = await response.json();

        alert(message);
        this.getpairs();
      } catch (error) {
        console.log(error);
      }
    },
    async getbaseasset() {
      const assetitem = this.$route.query.assetitem;

      const url = `${this.baseurl}/asset?assetid=${assetitem}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { asset } = await response.json();

        this.baseasset = asset;
      } catch (error) {
        console.log(error);
      }
    },
    async getpairs() {
      if (this.baseasset) {
        let url;

        if (this.pairsview !== 'all') {
          url = `${this.baseurl}/pairs/by-base?baseAsset=${this.baseasset.coin}&assetType=${this.pairsview}`;
        } else {
          url = `${this.baseurl}/pairs/by-base?baseAsset=${this.baseasset.coin}`;
        }

        //const url = `${this.baseurl}/pairs/by-base?baseAsset=${this.baseasset.coin}&assetType=${this.pairsview}`;

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const { pairs } = await response.json();

          // console.log(pairs);

          this.pairs = pairs;
        } catch (error) {
          console.log(error);
        }
      }
    },
    setpairsview(assetcat) {
      this.pairsview = assetcat;
    },
  },
};
</script>
