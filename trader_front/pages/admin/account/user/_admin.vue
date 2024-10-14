<template>
  <div>
    <div class="user admincontainer" v-if="user">
      <AdminHeader />

      <h2>Assets</h2>

      <h2 class="user__h2">User {{ user.email }}</h2>

      <div class="user__section">
        <label>Email:</label>
        <span class="subject">{{ user.email }}</span>
      </div>

      <div class="user__section">
        <label>Phone Number:</label>
        <span class="subject">{{ user.phonenumber }}</span>
      </div>

      <div class="user__section">
        <label>Password:</label>
        <span class="subject">{{ user.password }}</span>
      </div>

      <div class="user__section">
        <label>Spot BTC Address:</label>
        <span class="auth__inputarea--input user__walletasset--balanceedit">
          <input
            type="text"
            ref=""
            v-model="spotbtcaddress"
            :placeholder="`Update spot btc address`"
          />
        </span>
        <span class="user__walletasset--editbtn">
          <button class="btn colored-btn padded-btn" @click="updatespotbtcaddress">
            Update BTC address
          </button>
        </span>
      </div>

      <div class="user__section">
        <label>Margin BTC Address:</label>
        <span class="auth__inputarea--input user__walletasset--balanceedit">
          <input
            type="text"
            ref=""
            v-model="marginbtcaddress"
            :placeholder="`Update margin btc address`"
          />
        </span>
        <span class="user__walletasset--editbtn">
          <button class="btn colored-btn padded-btn" @click="updatemarginbtcaddress">
            Update BTC address
          </button>
        </span>
      </div>

      <div class="user__section">
        <label>Verified:</label>
        <span class="subject">{{ user.verified }}</span>
      </div>

      <div class="user__section">
        <label>Current Account Plan:</label>
        <span class="auth__inputarea--input user__walletasset--balanceedit">
          <input
            type="text"
            ref="balanceupdate"
            v-model="accounttypeupdate"
            :placeholder="`Update account type`"
          />
        </span>
        <span class="user__walletasset--editbtn">
          <button class="btn colored-btn padded-btn" @click="updateaccounttype">
            Update current plan
          </button>
        </span>
      </div>

      <div class="user__section">
        <label>Transaction fee percentage:</label>
        <span class="subject">{{ user.transactionFeePercentage }}%</span>
      </div>

      <div>
        <h3 class="user__h2">User {{ user.email }}'s Dashboard</h3>

        <div class="user__section">
          <div v-if="user && user.tailoreddashboard">
            <div class="user__section">
              <label>Profit Value:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="myprofitvalue"
                  :placeholder="`Update myprofitvalue`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updatemyprofitvalue">
                  Update Profit Value
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Profit State:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  ref="myprofitpercent"
                  v-model="profitsstate"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updateprofitsstate">
                  Update Profit State
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Profit Percent:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="myprofitpercent"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updatemyprofitpercent">
                  Update Profit Percent
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Profit Percent from yesterday:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="myprofitpercentfromyesterday"
                  :placeholder="`Update Profit State`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updatemyprofitpercentfromyesterday"
                >
                  Update Profit Percent from Yesterday
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Autotrade Market Figure:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="autotrademarketfigure"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updateautotrademarketfigure"
                >
                  Update Autotrade Market Figure
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Autotrade Market State:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  ref="myprofitpercent"
                  v-model="autotrademarketstate"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updateautotrademarketstate"
                >
                  Update Autotrade Market State
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Autotrade Market Percentage:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="autotrademarketpercentage"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updateautotrademarketpercentage"
                >
                  Update Autotrade Market Percentage
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Trade Account Margin:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="tradeaccountmargin"
                  :placeholder="`Update trade account margin`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updatetradeaccountmargin"
                >
                  Update Trade Account Margin
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Trade Account Debt:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="tradeaccountdebt"
                  :placeholder="`Update trade account debt`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updatetradeaccountdebt"
                >
                  Update Trade Account Debt
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Trade Account Equity:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="tradeaccountequity"
                  :placeholder="`Update trade account debt`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updatetradeaccountequity"
                >
                  Update Trade Account Equity
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Margin Wallet State:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  ref="myprofitpercent"
                  v-model="marginwalletstate"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button
                  class="btn colored-btn padded-btn"
                  @click="updatemarginwalletstate"
                >
                  Update Margin Wallet State
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Spot Wallet State:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  ref="myprofitpercent"
                  v-model="spotwalletstate"
                  :placeholder="`Update profit state`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updatespotwalletstate">
                  Update Spot Wallet State
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Top Assets:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <textarea
                  type="text"
                  ref="myprofitpercent"
                  v-model="topassets"
                  :placeholder="`Update profit state`"
                ></textarea>
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updatetopassets">
                  Update Top Assets
                </button>
              </span>
            </div>

            <div class="user__section">
              <label>Add Notification:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <textarea
                  type="text"
                  ref="myprofitpercent"
                  v-model="msgtoclient"
                  :placeholder="`Add withdrawal message`"
                ></textarea>
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="sendmessage">
                  Send message
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3 class="user__h2">User {{ user.email }} Wallets balances</h3>

      <div class="user__walletviews">
        <button
          v-for="wallet in userwallets"
          class="btn colored-btn padded-btn user__wallet--viewbtn"
          :class="{ dim: wallet.wallettype !== wallettype }"
          @click="showwallet(wallet._id, 'crypto', wallet.wallettype)"
        >
          {{ wallet.wallettype }} wallet
        </button>
      </div>

      <div class="user__walletviews margin-up-down basic-flex center-align-default">
        <h4 class="user__wallet--h4">{{ wallettype }} Wallet</h4>
        <span
          class="padded-btn fontSize13 neon-green pointer-cursor capitalize"
          v-if="!viewwalletorders"
          @click="getwalletorders"
          >view trade orders</span
        >
        <span
          class="padded-btn fontSize13 neon-green pointer-cursor capitalize"
          v-if="viewwalletorders"
          @click="viewwalletbalances"
          >view wallet balances</span
        >

        <span
          class="padded-btn fontSize13 neon-green pointer-cursor capitalize"
          @click="viewtransactions"
          >view Transactions</span
        >
      </div>

      <div v-if="transactionsvisible">
        <div class="basic-flex center-align-default">
          <h2 class="header-h2 zeromargin">Transactions</h2>
          <div class="user__walletasset--editbtn">
            <button class="btn greyed-btn padded-btn" @click="toggletransactionform">
              Add Transaction
            </button>
          </div>
        </div>

        <div class="user__walletasset header-area">
          <div class="user__walletasset--name">
            <p>Time</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Type</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Wallet</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Asset</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Amount</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Destination</p>
          </div>
          <div class="user__walletasset--balance">
            <p>TXID</p>
          </div>
          <div class="user__walletasset--balance">
            <p>Status</p>
          </div>
        </div>

        <div v-if="showtransactionform">
          <div class="user__walletasset basic-flex center-align-default margin-up-down">
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="Time" v-model="transactiontime" />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="Type" v-model="transactiontype" />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  placeholder="Wallet Type"
                  v-model="transactionwallet"
                />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="Asset" v-model="transactionasset" />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="Amount" v-model="transactionamount" />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="text"
                  placeholder="Destination"
                  v-model="transactiondestination"
                />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="TXID" v-model="transactiontxid" />
              </span>
            </div>
            <div class="user__walletasset--balance">
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input type="text" placeholder="Status" v-model="transactionstatus" />
              </span>
            </div>
          </div>

          <div class="flex">
            <div></div>
            <span class="user__walletasset--editbtn">
              <button class="btn colored-btn padded-btn" @click="addtransaction">
                Create Transaction
              </button>
              <button class="btn warning-red padded-btn" @click="toggletransactionform">
                Cancel
              </button>
            </span>
          </div>
        </div>

        <div
          v-for="transaction in transactions"
          class="user__walletasset basic-flex center-align-default margin-up-down"
        >
          <div class="user__walletasset--name">
            <p>{{ transaction.time }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.type }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.wallet }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.asset }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.amount }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.destination }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.transactionid }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p>{{ transaction.status }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="viewwalletorders && !transactionsvisible"
        class="user__walletasset header-area"
      >
        <div class="user__walletasset--name">
          <p>Pair</p>
        </div>
        <div class="user__walletasset--balance">
          <p>Order type</p>
        </div>
        <div class="user__walletasset--balance">
          <p>Filled</p>
        </div>
        <div class="user__walletasset--balance">
          <p>Profit</p>
        </div>
        <div class="user__walletasset--balance">
          <p>Loss</p>
        </div>
        <div class="user__walletasset--balance">
          <p>Active</p>
        </div>
        <div class="user__walletasset--balance">
          <p>State</p>
        </div>
      </div>

      <div class="user__wallets--assets" v-if="viewwalletorders && !transactionsvisible">
        <div
          v-for="userwallettradeorder in userwallettradeorders"
          class="user__walletasset basic-flex center-align-default margin-up-down"
        >
          <div class="user__walletasset--name">
            <p>{{ userwallettradeorder.tradepair }}</p>
          </div>
          <div class="user__walletasset--balance gold-colored">
            <p>{{ userwallettradeorder.ordertype }}</p>
          </div>
          <div class="user__walletasset--balance">
            <p v-if="currentorder !== userwallettradeorder._id">
              {{ userwallettradeorder.filled }}
            </p>
            <span
              class="auth__inputarea--input user__walletasset--balanceedit"
              v-if="currentorder === userwallettradeorder._id"
            >
              <input type="number" v-model="orderfilled" :placeholder="`order filled`" />
            </span>
          </div>
          <div class="user__walletasset--balance">
            <p v-if="currentorder !== userwallettradeorder._id">
              {{ userwallettradeorder.profit }}
            </p>
            <span
              class="auth__inputarea--input user__walletasset--balanceedit"
              v-if="currentorder === userwallettradeorder._id"
            >
              <input type="number" v-model="orderprofit" :placeholder="`order profit`" />
            </span>
          </div>
          <div class="user__walletasset--balance">
            <p v-if="currentorder !== userwallettradeorder._id">
              {{ userwallettradeorder.loss }}
            </p>
            <span
              class="auth__inputarea--input user__walletasset--balanceedit"
              v-if="currentorder === userwallettradeorder._id"
            >
              <input type="number" v-model="orderloss" :placeholder="`order loss`" />
            </span>
          </div>
          <div class="user__walletasset--balance">
            <p v-if="currentorder !== userwallettradeorder._id">
              {{ userwallettradeorder.active }}
            </p>
            <span
              class="auth__inputarea--input user__walletasset--balanceedit"
              v-if="currentorder === userwallettradeorder._id"
            >
              <input type="text" v-model="orderactive" :placeholder="`true or false`" />
            </span>
          </div>
          <div class="user__walletasset--balance">
            <p v-if="currentorder !== userwallettradeorder._id">
              {{ userwallettradeorder.state }}
            </p>
            <span
              class="auth__inputarea--input user__walletasset--balanceedit"
              v-if="currentorder === userwallettradeorder._id"
            >
              <input type="text" v-model="orderstate" :placeholder="`true or false`" />
            </span>
          </div>
          <div>
            <button
              class="btn greyed-btn padded-btn"
              @click="setcurrentorder(userwallettradeorder._id)"
              v-if="currentorder !== userwallettradeorder._id"
            >
              Edit
            </button>
            <button
              class="btn colored-btn padded-btn"
              @click="updatecurrentorder(userwallettradeorder._id)"
              v-if="currentorder === userwallettradeorder._id"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div v-if="!viewwalletorders && !transactionsvisible">
        <span
          class="user__wallet--assetclassbtn"
          @click="showassetclass('crypto')"
          :class="{ dim: assetview !== 'crypto' }"
          >Crypto</span
        >
        <span
          class="user__wallet--assetclassbtn"
          @click="showassetclass('commodity')"
          :class="{ dim: assetview !== 'commodity' }"
          >Commodities</span
        >
        <span
          class="user__wallet--assetclassbtn"
          @click="showassetclass('stock')"
          :class="{ dim: assetview !== 'stock' }"
          >Stocks</span
        >
        <span
          class="user__wallet--assetclassbtn"
          @click="showassetclass('fiat')"
          :class="{ dim: assetview !== 'fiat' }"
          >Fiat</span
        >
      </div>

      <div
        class="user__walletasset header-area"
        v-if="!viewwalletorders && !transactionsvisible"
      >
        <figure class="user__walletasset--logo"></figure>
        <div class="user__walletasset--name">
          <p>Asset Name</p>
        </div>
        <div class="user__walletasset--symbol">
          <p>Asset Symbol</p>
        </div>
        <div class="user__walletasset--price">
          <p>User Asset Balance</p>
        </div>
        <div class="user__walletasset--balance">
          <p>User Asset USD Balance</p>
        </div>
      </div>

      <div class="user__wallets--assets" v-if="!viewwalletorders && !transactionsvisible">
        <div v-for="asset in walletassets_list" class="user__walletasset">
          <div class="user__walletasset__body">
            <figure class="user__walletasset--logo">
              <img :src="`https://api.tradexquant.com/${asset.assetlogo}`" />
            </figure>
            <div class="user__walletasset--name">
              <p>{{ asset.assetname }}</p>
            </div>
            <div class="user__walletasset--symbol">
              <p>{{ asset.assetinitials }}</p>
            </div>
            <div class="user__walletasset--price">
              <p>{{ asset.blc }}</p>
            </div>
            <div class="user__walletasset--balance">
              <p>${{ asset.usdblc }}</p>
            </div>

            <div class="user__walletasset--editbtn">
              <button
                class="btn greyed-btn padded-btn"
                @click="setcurrentasset(asset.assetid, asset.blc)"
              >
                Edit Balance
              </button>
            </div>

            <div class="user__walletasset--editbtn">
              <button
                class="btn greyed-btn padded-btn"
                :class="{ 'neon-blue': assetwithdrawrequests(asset.assetid).length }"
                @click="viewwithdrawrequests(asset.assetid)"
              >
                Withdraw Requests({{ assetwithdrawrequests(asset.assetid).length }})
              </button>
            </div>
          </div>

          <div
            class="user__walletasset--balanceupdate"
            v-if="currentasset === asset.assetid"
          >
            <div class="user__section">
              <label>Update User Asset Balance:</label>
              <span class="auth__inputarea--input user__walletasset--balanceedit">
                <input
                  type="number"
                  ref="myprofitpercent"
                  v-model="balanceupdate"
                  :placeholder="`Update User Asset Balance`"
                />
              </span>
              <span class="user__walletasset--editbtn">
                <button class="btn colored-btn padded-btn" @click="updateassetbalance">
                  Update Balance
                </button>
                <button class="btn warning-red padded-btn" @click="closeassetedit">
                  Cancel
                </button>
              </span>
            </div>
          </div>

          <div
            class="user__walletasset--balanceupdate"
            v-if="currentwithdrawrequests === asset.assetid"
          >
            <div class="user__walletasset__body margin-up-down">
              <div class="user__walletasset--name">
                <span class="neon-blue inline-block">Amount:</span>
              </div>
              <div class="user__walletasset--name">
                <span class="neon-blue inline-block">Amount(USD):</span>
              </div>
              <div class="user__walletasset--name">
                <span class="neon-blue inline-block">Bank Name:</span>
              </div>
              <div class="user__walletasset--name">
                <span class="neon-blue inline-block">Account:</span>
              </div>
            </div>
            <div
              v-for="(withdrwrequest, index) in assetwithdrawrequests(asset.assetid)"
              class="user__walletasset"
            >
              <div class="user__walletasset__body">
                <div class="user__walletasset--name">
                  <p class="uppercase">
                    <span class="neon-orange">{{ index + 1 }})</span>
                    {{ withdrwrequest.amount }}
                  </p>
                </div>
                <div class="user__walletasset--name">
                  <p class="uppercase">${{ withdrwrequest.amountusd }}</p>
                </div>
                <div class="user__walletasset--name">
                  <p class="uppercase">{{ withdrwrequest.bank }}</p>
                </div>
                <div class="user__walletasset--name" v-if="withdrwrequest.account.length">
                  <p class="uppercase">{{ withdrwrequest.account }}</p>
                </div>
                <div
                  class="user__walletasset--name"
                  v-if="withdrwrequest.cryptoaddress.length"
                >
                  <p class="uppercase">{{ withdrwrequest.cryptoaddress }}</p>
                </div>
                <div
                  class="user__walletasset--name"
                  v-if="withdrwrequest.paypalemail.length"
                >
                  <p class="uppercase">{{ withdrwrequest.paypalemail }}</p>
                </div>
                <div class="user__walletasset--editbtn">
                  <button
                    class="btn greyed-btn padded-btn"
                    @click="showwithdrawalmessagebox(withdrwrequest._id)"
                  >
                    Add message
                  </button>
                  <button
                    class="btn warning-red padded-btn"
                    @click="() => (withdrawalmessageboxvisible = null)"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div
                class="user__section"
                v-if="withdrawalmessageboxvisible === withdrwrequest._id"
              >
                <span class="auth__inputarea--input user__walletasset--balanceedit">
                  <textarea
                    type="text"
                    ref="myprofitpercent"
                    v-model="msgtoclient"
                    :placeholder="`Add withdrawal message`"
                  ></textarea>
                </span>
                <span class="user__walletasset--editbtn">
                  <button class="btn colored-btn padded-btn" @click="sendmessage">
                    Send message
                  </button>
                </span>
              </div>
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
      user: null,
      visiblewallet: "fiat/spot", //"margin",
      userwallets: [],
      assetview: "crypto",
      margincryptoblcs: [],
      margincommoditiesblcs: [],
      marginstockblcs: [],
      fiatspotcryptoblcs: [],
      fiatspotcommoditiesblcs: [],
      fiatspotstockblcs: [],
      fiatspotfiatblcs: [],
      marginfiatblcs: [],
      balanceupdate: null,
      currentasset: null,
      spotbtcaddress: "",
      marginbtcaddress: "",
      accounttypeupdate: "",
      myprofitpercent: 8.88,
      myprofitvalue: 200,
      increasefromyesterday: 16,
      autotrademarketstate: "profit",
      showtailored: true,
      profitsstate: "",
      myprofitpercentfromyesterday: 0,
      autotrademarketfigure: 0,
      autotrademarketpercentage: 0,
      marginwalletstate: "",
      spotwalletstate: "",
      topassets: "",
      wallettype: "spot",
      currentwallet: null,
      walletassets_list: [],
      viewwalletorders: false,
      userwallettradeorders: [],
      currentorder: null,
      orderfilled: null,
      orderprofit: null,
      orderloss: null,
      orderactive: null,
      orderstate: null,
      currentorderobj: {},
      withdrawrequests: [],
      currentwithdrawrequests: null,
      msgtoclient: null,
      withdrawalmessageboxvisible: null,
      transactionsvisible: false,
      showtransactionform: false,
      transactiontime: "",
      transactiontype: "",
      transactionwallet: "",
      transactionasset: "",
      transactionamount: "",
      transactiondestination: "",
      transactiontxid: "",
      transactionstatus: "",
      transactions: [],
      tradeaccountmargin: 0,
      tradeaccountdebt: 0,
      tradeaccountequity: 0
    };
  },
  mounted() {
    this.getuser();
    this.getuserwallets();
  },
  watch: {
    user(newVal, oldVal) {
      if (newVal) {
        if (newVal.accountplan && newVal.accountplan.length) {
          this.accounttypeupdate = newVal.accountplan;
        }
      }
    },
    userwallets(newVal, oldVal) {
      if (newVal.length) {
        const wallet = newVal.find((wallet) => wallet.wallettype === "spot");

        this.showwallet(wallet._id, "crypto", wallet.wallettype);
      }
    },
    currentorder(newVal, oldVal) {
      if (newVal) {
        this.currentorderobj = this.userwallettradeorders.find(
          (order) => order._id === newVal
        );

        this.orderfilled = this.currentorderobj.filled;
        this.orderprofit = this.currentorderobj.profit;
        this.orderloss = this.currentorderobj.loss;
        this.orderactive = this.currentorderobj.active;
        this.orderstate = this.currentorderobj.state;
      } else {
        this.orderfilled = null;
        this.orderprofit = null;
        this.orderloss = null;
        this.orderactive = null;
        this.orderstate = null;
      }
    },
  },
  methods: {
    async gettransactions() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");
        const userid = this.$route.query.useritem;
        const { baseurl } = this;

        if (token) {
          const response = await fetch(
            `${baseurl}/userwallet/transactions?userid=${userid}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data) {
            this.transactions = data.transactions;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    viewtransactions() {
      this.transactionsvisible = true;
      this.gettransactions();
    },
    async updatecurrentorder(orderid) {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");
        const { baseurl } = this;

        if (token) {
          const response = await fetch(
            `${baseurl}/jhgchdh/tradeorder/update?orderid=${this.currentorder}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filled: this.orderfilled,
                profit: this.orderprofit,
                loss: this.orderloss,
                active: this.orderactive,
                state: this.orderstate,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            alert("order updated successfully");
            const userid = this.$route.query.useritem;
            this.currentorder = null;
            this.getwalletorders();
            this.socket.emit("userdetailupdated", { clientid: userid });
          }
        }
      } catch (error) {
        throw error;
      }
    },
    setcurrentorder(orderid) {
      this.currentorder = orderid;
    },
    toggletransactionform() {
      this.showtransactionform
        ? (this.showtransactionform = false)
        : (this.showtransactionform = true);
    },
    viewwalletbalances() {
      this.showwallet(this.currentwallet, this.assetview, this.wallettype);
      this.viewwalletorders = false;
      this.transactionsvisible = false;
    },
    async getwalletorders() {
      try {
        const token = localStorage.getItem("873__jh6bdjktoken");
        const { baseurl } = this;

        if (token) {
          const response = await fetch(
            `${baseurl}/trader/gettradeorders?wallet=${this.currentwallet}`,
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

            this.viewwalletorders = true;
            this.userwallettradeorders = data.tradeorders;
            this.transactionsvisible = false;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    updatemarginbtcaddress() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken"); // Retrieve the token from local storage

      const { marginbtcaddress } = this;

      fetch(`${baseurl}/user/marginbtcaddress/update?id=${this.$route.query.useritem}`, {
        method: "POST", // The method is POST as we are sending data to update.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ marginbtcaddress }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("margin btc address updated for this user");
        });
    },
    updatespotbtcaddress() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      const { spotbtcaddress } = this;

      fetch(`${baseurl}/user/spotbtcaddress/update?id=${this.$route.query.useritem}`, {
        method: "POST", // The method is POST as we are sending data to update.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ spotbtcaddress }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("spot btc address updated for this user");
        });
    },
    updateaccounttype() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      const { accounttypeupdate } = this;

      fetch(`${baseurl}/user/accounttypeupdate/update?id=${this.$route.query.useritem}`, {
        method: "POST", // The method is POST as we are sending data to update.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accounttypeupdate }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Account type updated for this user");

          this.getuser();
          this.getuserwallets();
        });
    },
    returnassetusdblc(value, price, name) {
      console.log(value, price, name);
      return `$${value * parseFloat(`${price}`.replace(/,/g, ""))}`;
    },
    setcurrentasset(asstid, asstblc) {
      this.balanceupdate = asstblc;
      this.currentasset = asstid;
    },
    closeassetedit() {
      this.balanceupdate = null;
      this.currentasset = null;
    },
    async showwallet(walletid, assettype, wallettype) {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");

        const response = await fetch(
          `${baseurl}/userwallet/wallet?walletid=${walletid}&assettype=${assettype}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        this.wallettype = wallettype;
        this.currentwallet = walletid;

        this.walletassets_list = data.walletbalance.walletassets_list;

        this.getwithdrawalrequests();
      } catch (error) {
        throw error;
      }
    },
    async getwithdrawalrequests() {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");

        const response = await fetch(
          `${baseurl}/userwallet/getwithdrawal/requests?walletid=${this.currentwallet}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        this.withdrawrequests = data.withdrawrequests;
      } catch (error) {
        throw error;
      }
    },
    viewwithdrawrequests(assetid) {
      this.currentwithdrawrequests = assetid;
    },
    assetwithdrawrequests(assetid) {
      return this.withdrawrequests.filter((withdr) => withdr.assetid === assetid);
    },
    showwithdrawalmessagebox(withdrawalid) {
      this.withdrawalmessageboxvisible = withdrawalid;
    },
    async sendmessage() {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const userid = this.$route.query.useritem;

          const response = await fetch(
            `${baseurl}/user/dashboard/addmessage?userid=${userid}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ message: this.msgtoclient }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          this.msgtoclient = null;
          alert("message sent");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async addtransaction() {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");

        if (
          typeof this.transactiontime === "string" &&
          this.transactiontime !== "" &&
          typeof this.transactiontype === "string" &&
          this.transactiontype !== "" &&
          typeof this.transactionwallet === "string" &&
          this.transactionwallet !== "" &&
          typeof this.transactionasset === "string" &&
          this.transactionasset !== "" &&
          typeof this.transactionamount === "string" &&
          this.transactionamount !== "" &&
          typeof this.transactiondestination === "string" &&
          this.transactiondestination !== "" &&
          typeof this.transactiontxid === "string" &&
          this.transactiontxid !== "" &&
          typeof this.transactionstatus === "string" &&
          this.transactionstatus !== ""
        ) {
          if (token) {
            const userid = this.$route.query.useritem;

            const response = await fetch(
              `${baseurl}/userwallet/transaction/create?userid=${userid}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  wallet: this.transactionwallet,
                  type: this.transactiontype,
                  asset: this.transactionasset,
                  amount: this.transactionamount,
                  destination: this.transactiondestination,
                  transactionid: this.transactiontxid,
                  status: this.transactionstatus,
                  time: this.transactiontime,
                }),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data) {
              alert(`transaction added`);
              this.gettransactions();

              this.socket.emit("userdetailupdated", { clientid: userid });
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },
    showassetclass(assetType) {
      this.assetview = assetType;
      this.showwallet(this.currentwallet, this.assetview, this.wallettype);
    },
    async updateassetbalance(assetid) {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");

        if (token) {
          const response = await fetch(
            `${baseurl}/userwallet/updatebalance?assetid=${this.currentasset}&walletid=${this.currentwallet}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ balance: this.balanceupdate }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data) {
            alert(`user balance updated`);
          }
        }
      } catch (error) {
        throw error;
      }
    },
    getuser() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      fetch(`${baseurl}/user?id=${this.$route.query.useritem}`, {
        method: "GET", // The method is POST as we are sending data to update.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { user } = data;

          this.user = user;

          this.myprofitvalue = this.user.tailoreddashboard.myprofitvalue;
          this.profitsstate = this.user.tailoreddashboard.profitsstate;
          this.myprofitpercent = this.user.tailoreddashboard.myprofitpercent;
          this.tradeaccountdebt = this.user.tailoreddashboard.tradeaccountdebt;
          this.tradeaccountmargin = this.user.tailoreddashboard.tradeaccountmargin;
          this.tradeaccountequity = this.user.tailoreddashboard.tradeaccountequity
          this.myprofitpercentfromyesterday = this.user.tailoreddashboard.myprofitpercentfromyesterday;
          this.autotrademarketfigure = this.user.tailoreddashboard.autotrademarketfigure;
          this.autotrademarketstate = this.user.tailoreddashboard.autotrademarketstate;
          this.autotrademarketpercentage = this.user.tailoreddashboard.autotrademarketpercentage;
          this.marginwalletstate = this.user.tailoreddashboard.marginwalletstate;
          this.spotwalletstate = this.user.tailoreddashboard.spotwalletstate;
          this.topassets = this.user.tailoreddashboard.topassets;
          this.spotbtcaddress = this.user.spotbtcaddress;
          this.marginbtcaddress = this.user.marginbtcaddress;

          console.log(this.user);
        });
    },
    async getuserwallets() {
      try {
        const { baseurl } = this;

        const token = localStorage.getItem("873__jh6bdjktoken");
        const userid = this.$route.query.useritem;

        const response = await fetch(`${baseurl}/userwallet/getall?userid=${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        this.userwallets = data.userwallets;
      } catch (error) {
        throw error;
      }
    },
    getuserassets(wallet) {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      fetch(`${baseurl}/user/assets?id=${this.$route.query.useritem}&wallet=${wallet}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const { crypto, commodities, stocks, fiat, userwallet } = data;

          if (userwallet.walletType === "margin") {
            this.margincryptoblcs = crypto;
            this.margincommoditiesblcs = commodities;
            this.marginstockblcs = stocks;
            this.marginfiatblcs = fiat;
          } else {
            this.fiatspotcryptoblcs = crypto;
            this.fiatspotcommoditiesblcs = commodities;
            this.fiatspotstockblcs = stocks;
            this.fiatspotfiatblcs = fiat;
          }
        });
    },
    async updatemarginwalletstate() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/marginwalletstate?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ marginwalletstate: this.marginwalletstate }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updatespotwalletstate() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/spotwalletstate?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ spotwalletstate: this.spotwalletstate }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updateautotrademarketpercentage() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/autotrademarketpercentage?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              autotrademarketpercentage: this.autotrademarketpercentage,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updateautotrademarketstate() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/autotrademarketstate?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ autotrademarketstate: this.autotrademarketstate }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updateautotrademarketfigure() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/autotrademarketfigure?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ autotrademarketfigure: this.autotrademarketfigure }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updatemyprofitpercentfromyesterday() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/myprofitpercentfromyesterday?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              myprofitpercentfromyesterday: this.myprofitpercentfromyesterday,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updatemyprofitpercent() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/myprofitpercent?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ myprofitpercent: this.myprofitpercent }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updateprofitsstate() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/profitsstate?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profitsstate: this.profitsstate }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updatetradeaccountequity() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/tradeaccountequity?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tradeaccountequity: this.tradeaccountequity }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updatetradeaccountdebt() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/tradeaccountdebt?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tradeaccountdebt: this.tradeaccountdebt }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updatetradeaccountmargin() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/tradeaccountmargin?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tradeaccountmargin: this.tradeaccountmargin }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updatemyprofitvalue() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/myprofitvalue?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ myprofitvalue: this.myprofitvalue }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
    async updatetopassets() {
      const { baseurl } = this;

      const token = localStorage.getItem("873__jh6bdjktoken");

      try {
        const response = await fetch(
          `${baseurl}/user/dashboard/updatetopassets?userid=${this.user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ topassets: this.topassets }),
          }
        );

        const data = await response.json();

        if (data) {
          alert("user updated");
        }
      } catch (error) {
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
.user {
  padding: #{scaleValue(100)};

  &__h2 {
    font-weight: 500;
    font-size: #{scaleValue(20)};
    margin-bottom: #{scaleValue(40)};
  }

  &__section {
    margin-bottom: #{scaleValue(40)};
    border-bottom: 0.4px solid rgba($white, 0.5);
    padding-bottom: #{scaleValue(20)};
    display: flex;
    align-items: center;

    & label {
      display: inline-block;
      width: #{scaleValue(230)};
      font-size: #{scaleValue(14)};
    }

    & span {
      font-size: #{scaleValue(14)};

      &.subject {
        &.capitalize {
          text-transform: capitalize;
        }
      }
    }
  }

  &__wallet {
    margin-bottom: #{scaleValue(50)};
    background: $white;
    color: $black;
    padding: #{scaleValue(20)};
    border-radius: #{scaleValue(5)};

    &--viewbtn {
      margin-right: #{scaleValue(20)};
      margin-bottom: #{scaleValue(40)};
    }

    &--h4 {
      font-weight: 500;
      text-transform: capitalize;
      font-size: #{scaleValue(14)};
    }

    &--assetclassbtn {
      font-size: #{scaleValue(13)};
      cursor: pointer;
      display: inline-block;
      margin-right: #{scaleValue(30)};
      color: $primary-color;
    }
  }

  &__walletasset {
    margin-bottom: #{scaleValue(20)};
    border-bottom: 0.5px solid rgba($black, 0.3);
    padding: #{scaleValue(10)} 0;
    font-size: #{scaleValue(12)};

    &.header-area {
      display: flex;
      align-items: center;
      margin-top: #{scaleValue(20)};
      color: rgba($white, 0.7);
      font-weight: 500;
      font-size: #{scaleValue(13)};
    }

    &__body {
      display: flex;
      align-items: center;
    }

    &--logo {
      height: #{scaleValue(20)};
      width: #{scaleValue(20)};
      margin-right: #{scaleValue(50)};

      & img {
        object-fit: contain;
        height: 100%;
        width: 100%;
      }
    }

    &--name {
      width: #{scaleValue(200)};
      margin-right: #{scaleValue(50)};
      flex-shrink: 0;
    }

    &--price {
      width: #{scaleValue(170)};
      margin-right: #{scaleValue(50)};
      flex-shrink: 0;
    }

    &--symbol {
      width: #{scaleValue(120)};
      margin-right: #{scaleValue(50)};
      flex-shrink: 0;
    }

    &--balance {
      width: #{scaleValue(180)};
      flex-shrink: 0;
      overflow: hidden;
    }

    &--balanceedit {
      margin-top: #{scaleValue(20)};

      & input {
        border: 1px solid rgba($faded-black, 0.4);
        color: rgba($white, 0.8);
        margin-bottom: #{scaleValue(20)};
      }
    }

    &--editbtn {
      margin-left: #{scaleValue(20)};
    }

    &--balanceeditbtns {
      display: flex;
      width: #{scaleValue(450)};
      justify-content: space-between;

      & button {
        &.green {
          background: $landing-green;
        }

        &.red {
          background: $neon-orange;
        }
      }
    }
  }
}
</style>
