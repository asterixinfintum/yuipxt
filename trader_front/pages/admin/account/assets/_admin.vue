<template>
  <div>
    <div class="admincontainer assetscontainer">
      <AdminHeader />

      <h2>Assets</h2>

      <div class="assetscontainer__searcharea">
        <input placeholder="Search" v-model="search" />
      </div>

      <div class="assetscontainer__header">
        <div
          class="assetscontainer__headeritm"
          @click="setassetsview('crypto')"
          :class="{ current: assetsview === 'crypto' }"
        >
          Crypto
        </div>
        <div
          class="assetscontainer__headeritm"
          @click="setassetsview('stock')"
          :class="{ current: assetsview === 'stock' }"
        >
          Stocks
        </div>
        <div
          class="assetscontainer__headeritm"
          @click="setassetsview('commodity')"
          :class="{ current: assetsview === 'commodity' }"
        >
          Commodities
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
        <div class="assetscontainer__listheader"></div>

        <div class="assetscontainer__listbody">
          <div
            class="assetscontainer__listbodyitem"
            v-for="{ _id, image, name, coin, price, symbol, listed } in currentassets"
          >
            <div class="assetscontainer__listbodyitem--top">
              <figure>
                <img :src="returnCryptoLogo(image)" />
              </figure>
              <div class="assetscontainer__listbodyitem--name">
                {{ limitTextLength(name, 30) }}
              </div>
              <div class="assetscontainer__listbodyitem--coin">
                {{ coin }}
              </div>
            </div>

            <div class="assetscontainer__listbodyitem--bottom">
              <div class="assetscontainer__listbodyitem--price">
                <span class="green-usdt">Price:</span> {{ price }}
              </div>
              <div class="assetscontainer__listbodyitem--symbol">
                <span class="green-usdt">Symbol:</span> {{ symbol }}
              </div>
              <div class="assetscontainer__listbodyitem--listed">
                <span class="green-usdt">Listed:</span> {{ listed }}
              </div>
            </div>

            <div class="assetscontainer__listbodyitem--buttons">
              <span
                class="auth__inputarea--input user__walletasset--balanceedit"
                v-if="currentasset === _id"
              >
                <input
                  type="text"
                  ref="myprofitpercent"
                  v-model="currentassetprice"
                  :placeholder="`Update asset price`"
                />
              </span>

              <button class="btn neon-yellow padded-btn" v-if="currentasset === _id" @click="updateassetprice">
                Save
              </button>

              <button
                class="btn neon-blue padded-btn"
                @click="setcurrentasset(_id)"
                v-if="currentasset !== _id"
              >
                Edit
              </button>

              <button
                class="btn rounded-corner viewpairs"
                @click="
                  $router.push(
                    `/admin/account/pairs/${$route.params.admin}/?assetitem=${_id}`
                  )
                "
              >
                View pairs
              </button>
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
import cryptologosMixin from "@/mixins/cryptologos";

export default {
  mixins: [adminMixin, cryptologosMixin],
  data() {
    return {
      assetslist: [],
      assetsview: "crypto",
      search: "",
      listed: false,
      delisted: false,
      currentasset: null,
      currentassetprice: 0,
      currentassetobj: null,
    };
  },
  mounted() {
    this.getassets();
  },
  watch: {
    assetsview(newval, oldval) {
      this.search = "";
    },
    currentasset(newval, oldval) {
      if (newval) {
        this.currentassetobj = this.currentassets.find((asset) => asset._id === newval);

        this.currentassetprice = this.currentassetobj.price;
      } else {
        this.currentassetobj = null

        this.currentassetprice = 0
      }
    },
  },
  computed: {
    currentassets() {
      const { search } = this;

      const currentassets = !this.assetslist.length
        ? []
        : this.assetslist.filter((asset) => asset.assetType === this.assetsview);

      if (search.length) {
        const normalizedSearch = search.toLowerCase().trim();

        const currentassetsfilt = currentassets.filter(
          (asset) =>
            asset.name.toLowerCase().trim().includes(normalizedSearch) ||
            asset.coin.toLowerCase().trim().includes(normalizedSearch)
        );

        if (this.listed) {
          return currentassetsfilt.filter((asset) => asset.listed);
        }

        if (this.delisted) {
          return currentassetsfilt.filter((asset) => !asset.listed);
        }

        return currentassetsfilt;
      }

      if (this.listed) {
        return currentassets.filter((pair) => pair.listed);
      }

      if (this.delisted) {
        return currentassets.filter((pair) => !pair.listed);
      }

      return currentassets;
    },
  },
  methods: {
    async updateassetprice() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");
        const { baseurl } = this;

        if (token) {
          const response = await fetch(
            `${baseurl}/jhgchdh/assetitem/update?assetid=${this.currentasset}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ priceupdate: this.currentassetprice }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            alert("asset updated successfully");
            this.currentasset = null;
            this.getassets();
            this.socket.emit('updateprices');
          }
        }
      } catch (error) {
        throw error;
      }
    },
    setcurrentasset(assetid) {
      this.currentasset = assetid;
    },
    setassetsview(assetcat) {
      this.assetsview = assetcat;
    },
    limitTextLength(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      } else {
        return text.substring(0, maxLength) + "...";
      }
    },
    async delist(id) {
      const url = `${this.baseurl}/jhgchdh/asset/delist?assetid=${id}`;

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
        this.getassets();
      } catch (error) {
        console.log(error);
      }
    },
    async relist(id) {
      const url = `${this.baseurl}/jhgchdh/asset/relist?assetid=${id}`;

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
        this.getassets();
      } catch (error) {
        console.log(error);
      }
    },
    async getassets() {
      try {
        fetch(`${this.baseurl}/assets`)
          .then((response) => response.json())
          .then((data) => {
            const { assets } = data;
            this.assetslist = assets;
          })
          .catch((error) => {
            console.log(error);
            console.error("Error:", error);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
