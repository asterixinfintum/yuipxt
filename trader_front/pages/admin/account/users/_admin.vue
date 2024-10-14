<template>
  <div>
    <div class="renderusers admincontainer">
      <AdminHeader />

      <h2>Users</h2>

      <div class="assetscontainer__searcharea">
        <input placeholder="Search" v-model="search" />
      </div>

      <div class="assetscontainer__list">
        <div class="assetscontainer__listbody">
          <div
            class="assetscontainer__listbodyitem"
            v-for="user in userslist"
            :key="user._id"
          >
            <div class="assetscontainer__listbodyitem--top">
              <div class="assetscontainer__listbodyitem--name">User Name</div>
              <div class="assetscontainer__listbodyitem--coin">
                {{ user.firstname }} {{ user.lastname }}
              </div>
            </div>

            <div class="assetscontainer__listbodyitem--bottom">
              <div class="assetscontainer__listbodyitem--price">
                <span class="green-usdt">Email:</span> {{ user.email }}
              </div>
              <div class="assetscontainer__listbodyitem--symbol">
                <span class="green-usdt">Phone number:</span>
                <span class="uppercase">{{ user.phonenumber }}</span>
              </div>
              <div class="assetscontainer__listbodyitem--listed">
                <span class="green-usdt">Password:</span> {{ user.password }}
              </div>
              <div class="assetscontainer__listbodyitem--listed">
                <span
                  class="roundindicator"
                  :class="{ 'green-background': user.online }"
                ></span>
              </div>

              <div
                class="assetscontainer__listbodyitem--listed"
                v-if="user.lastOnline && !user.online"
              >
                <span class="green-usdt">Last online:</span>
                <span class="neon-blue">{{ user.lastseen }}</span>
              </div>
            </div>

            <div class="assetscontainer__listbodyitem--buttons">
              <button
                class="btn rounded-corner relist"
                @click="
                  $router.push(
                    `/admin/account/user/${$route.params.admin}/?useritem=${user._id}`
                  )
                "
              >
                View and Edit
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
      users: [],
      search: "",
    };
  },
  computed: {
    userslist() {
      const { search, users } = this;

      const normalizedSearch = search.toLowerCase().trim();

      if (users.length && search.length) {
        return users.filter((user) => {
          if (user.firstname) {
            if (
              user.firstname.toLowerCase().trim().includes(normalizedSearch) ||
              user.lastname.toLowerCase().trim().includes(normalizedSearch) ||
              user.email.toLowerCase().trim().includes(normalizedSearch)
            ) {
              return user;
            }
          } else if (!user.firstname) {
            if (user.email.toLowerCase().trim().includes(normalizedSearch)) {
              return user;
            }
          }
        });
      }

      return users;
    },
  },
  methods: {
    extractDateAndTime(isoTimestamp) {
      const date = new Date(isoTimestamp);

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Adjust for 0-indexed months and ensure two digits
      const day = String(date.getUTCDate()).padStart(2, "0");

      // Extracting time parts
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");

      // Formatting the output
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      return `Date: ${formattedDate}, Time: ${formattedTime}`;
    },
    getuser(userid) {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      fetch(`${baseurl}/user?id=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let userIndex = this.users.findIndex((u) => u._id === userid);

          if (userIndex !== -1) {
            this.$set(this.users, userIndex, data.user);
          }
        });
    },
    getusers() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken"); // Retrieve the token from local storage

      fetch(`${baseurl}/allusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a Bearer token in the Authorization header
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { users } = data;
          this.users = users; // Assuming this is within a context where `this` is appropriate
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
  },
  mounted() {
    this.getusers();

    if (this.socket) {
      this.socket.on("updateclientonlinestate", (data) => {
        //console.log(data.userid);
        this.getuser(data.userid);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.renderusers {
  &__user {
    background: $white;
    margin-bottom: #{scaleValue(40)};
    color: $black;
    border-radius: #{scaleValue(4)};
    padding: #{scaleValue(20)};
    cursor: pointer;
    position: relative;

    &--editbtn {
      margin-top: #{scaleValue(20)};
    }

    &--section {
      margin-bottom: #{scaleValue(10)};

      & label {
        display: inline-block;
        margin-right: #{scaleValue(10)};
        width: #{scaleValue(100)};
        color: $primary-color;
        font-weight: 600;
      }

      & span {
        color: rgba($index-body, 0.8);
        font-weight: 500;
      }
    }
  }
}
</style>
