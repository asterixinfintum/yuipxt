const mongoose = require('mongoose');
const { Schema } = mongoose;

const TailoredDashboardSchema = new Schema({
  increasefromyesterday: { type: Number, default: 16 },
  graphfigures: { type: [Object], default: [] },
  showtailored: { type: Boolean, default: true },

  marginwalletstate: { type: String, default: '' },
  spotwalletstate: { type: String, default: '' },
  autotrademarketstate: { type: String, default: 'profit' },
  autotrademarketpercentage: { type: Number, default: 65 },
  autotrademarketfigure: { type: Number, default: 2000000 },
  myprofitpercentfromyesterday: { type: Number, default: 2 },
  myprofitvalue: { type: Number, default: 200 },
  myprofitpercent: { type: Number, default: 8.88 },
  profitstatevalue: { type: Number, default: 20 },
  profitsstate: { type: String, default: 'profit' /*profit or loss*/ },
  profitstatetext: { type: String, default: '' },
  topassets: { type: String, default: 'Bitcoin || Ethereum || Bitcoin Cash || XRP || Crude Oil Brent || Copper || Aluminum || Natural Gas || Apple Inc. || Pfizer Inc. || Tesla, Inc. || Meta Platforms, Inc.' },
  tradeaccountmargin: {
    type: Number,
    default: 0,
  },
  tradeaccountdebt: {
    type: Number,
    default: 0,
  },
  tradeaccountequity: {
    type: Number,
    default: 0,
  },
});

TailoredDashboardSchema.path('profitstatetext').get(function () {
  if (this.profitsstate === 'profit') {
    return `Increased ${this.myprofitpercentfromyesterday}% from yesterday`;
  } else if (this.profitsstate === 'loss') {
    return `decreased ${this.myprofitpercentfromyesterday}% from yesterday`;
  } else {
    return this.profitstatetext;
  }
});

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true
  },
  anonId: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    default: false,
  },
  online: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: ''
  },
  keytoken: {
    type: String,
  },
  customFields: {},
  marginbtcaddress: {
    type: String,
    default: ''
  },
  spotbtcaddress: {
    type: String,
    default: ''
  },
  accountplan: {
    type: String,
    default: 'Basic'
  },
  lastOnline: {
    type: Date,
  },
  lastOnlineAgo: {
    type: String,
    default: ''
  },
  tailoreddashboard: {
    type: TailoredDashboardSchema,
    default: () => ({})
  },
  warnings: [
    {
      message: String,
      btnText: String,
      date: { type: Date, default: Date.now }
    }
  ],
  notifications: [
    {
      label: String,
      description: String,
      time: { type: Date, default: Date.now }
    }
  ],
  transactionFeePercentage: {
    type: Number,
    default: 1
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
