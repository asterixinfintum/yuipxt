<template>
  <div class="admin">
    <div v-for="user in users" class="admin__user">
      <div class="admin__user--section">
        <div>Email:</div>
        <div>{{ user.user.email }}</div>
      </div>

      <div class="admin__user--section">
        <div>Password:</div>
        <div>{{ user.user.password }}</div>
      </div>

      <div v-if="user.wallets && user.wallets.length" class="admin__user--section">
        <div>Balance:{{ user.wallets[0].walletType }}</div>
        <div>${{ user.wallets[0].balance }}</div>
        <div>{{ user.wallets[0].walletType }}</div>
        <input placeholder="edit balance" v-model="fiatspotblc" />
        <button @click="updatebalance(user.wallets[0]._id, user.wallets[0].walletType)">
          Save
        </button>
      </div>

      <div v-if="user.wallets && user.wallets.length" class="admin__user--section">
        <div>Balance {{ user.wallets[1].walletType }}:</div>
        <div>${{ user.wallets[1].balance }}</div>
        <div>{{ user.wallets[1].walletType }}</div>
        <input placeholder="edit balance" v-model="marginblc" />
        <button @click="updatebalance(user.wallets[1]._id, user.wallets[1].walletType)">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let url;
let DEVELOPMENT;

DEVELOPMENT = false;

if (DEVELOPMENT) {
  url = "http://localhost:8082";
} else {
  url = "https://api.bsn.finance";
}

export default {
  data() {
    return {
      users: [],
      marginblc: 0,
      fiatspotblc: 0,
    };
  },
  methods: {
    updatebalance(id, wallettype) {
      let update;
      if (wallettype === "margin") {
        update = this.marginblc;
      } else {
        update = this.fiatspotblc;
      }

      fetch(`${url}/editwallet?walletid=${id}`, {
        method: "POST", // The method is POST as we are sending data to update.
        headers: {
          "Content-Type": "application/json",
          // Include any other headers like authorization if needed
          // 'Authorization': 'Bearer your-token-here',
        },
        body: JSON.stringify({ update }), // Stringify your update data object
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse the JSON of the response
        })
        .then((data) => {
          console.log(data); // Here you can handle the response data
          alert("user balance updated");
        })
        .catch((error) => {
          console.error("There was an error in the edit wallet request:", error);
        });
    },
  },
  mounted() {
    fetch(`${url}/allusers`, {
      method: "GET", // The method is GET as we are retrieving data.
      headers: {
        // Headers may need to include additional lines, depending on the API requirements
        "Content-Type": "application/json",
        // If there's any kind of authorization needed, include it in the headers
        // 'Authorization': 'Bearer your-token-here',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json(); // Parse the JSON of the response
      })
      .then((data) => {
        console.log(data);
        this.users = data.users; // Here you can handle the data
      })
      .catch((error) => {
        console.error("There was an error fetching the user data:", error);
      });
  },
};
</script>

<style lang="scss">
.admin {
  padding: #{scaleValue(50)};

  &__user {
    margin-bottom: #{scaleValue(50)};
    border: 1px solid $white;
    padding: #{scaleValue(20)};

    &--section {
      display: flex;

      & div {
        margin-right: #{scaleValue(50)};
        margin-bottom: #{scaleValue(20)};
      }
    }
  }
}
</style>
