if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

import "regenerator-runtime/runtime.js";
import express from "express";
import http from "http";
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import cron from "node-cron";

const app = express();
const server = http.createServer(app);

const allowlist = ["http://localhost:3000", 'https://tradexquant.com', 'https://www.tradexquant.com', 'https://app.tradexquant.com'];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

  if (isDomainAllowed) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));

/*const io = socket(server, {
  cors: {
    origin: [`${process.env.baseurl}`, `${process.env.wwwbaseurl}`],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

let ioInstance;*/


import mongoose from 'mongoose';

import Asset from './models/asset';

import signupRoute from './routes/signup';
import loginRoute from './routes/login';
import logoutRoute from './routes/logout';
import clientRoute from './routes/client';

import assetRoute from './routes/asset';
import walletroute from './wallet/routes/wllt';

import adminRoute from './admin/routes';

import fileuploadRoute from './routes/fileupload.js';
import imageuploadRoute from './routes/imageupload.js';
//import fileretrieveRoute from './routes/fileretrieve.js';
import videouploadRoute from './routes/videoupload.js';

import pairsRoute from './trade/routes/pairs.js';
import ordersRoute from './trade/routes/orders.js';
import assetsRoute from './trade/routes/assets.js';

import dailyreport from './userdashboard/dailyreport';

import transactionsRoute from './wallet/routes/transactions.js';

import seedAssets from './functions/seedAssets';
import getBitcoinBalances from './wallet/functions/getBitcoinBalances';

import getprices from './trade/getprices.js';
import updatecommoditiesprices from './trade/commodities/updatecommoditiesprices.js';

import setonlineuser from './functions/setonlineuser';
import setofflineuser from './functions/setofflineuser';
import setpairinview from './functions/setpairinview';
import setpairoutofview from './functions/setpairoutofview';

import userwalletadmin from './userwallet/controllers/admin';
import userwalletuser from './userwallet/controllers/user';
import dashboardcontroller from './userdashboard/controller';
import admindashboardcontroller from './userdashboard/controller/admin';
import swapcontroller from './swaps/controllers';
import transfercontroller from './transfer/controllers';
import tradercontroller from './trader/controllers'

import asset_route from './assets/controller';

import usersettings from './routes/usersettings';

import './userdashboard';

/*function initSocketIO() {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');

      if (socket.user) {
        setofflineuser(socket.user._id)
      }
    });

    socket.on('pairinview', (data) => {

      setpairinview(data.pairid);
    });

    socket.on('pairoutofview', (data) => {

      setpairoutofview(data.pairid);
    });
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      const actualToken = token.split(' ')[1];

      const onlineuser = await setonlineuser(actualToken);

      if (onlineuser) {
        socket.user = {
          _id: onlineuser._id,
          firstname: onlineuser.firstname,
          lastname: onlineuser.lastname,
          email: onlineuser.email
        };
      }

      //console.log(socket.user )

      next();
    }
  });

  ioInstance = io;
}*/

function getCurrentDateTime() {
  var now = new Date();

  var year = now.getFullYear();
  var month = ('0' + (now.getMonth() + 1)).slice(-2); // Months are zero-based
  var day = ('0' + now.getDate()).slice(-2);
  var hours = ('0' + now.getHours()).slice(-2);
  var minutes = ('0' + now.getMinutes()).slice(-2);

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}

cron.schedule("*/1 * * * *", async () => {
  const date = getCurrentDateTime();
  //await getprices(date);
});


cron.schedule('0 */5 * * *', () => {
  updatecommoditiesprices();
});

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

app.use(express.static(path.join(__dirname, '../public/ui')));

app.use(express.urlencoded({
  extended: false
}));

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8082;

app.use(signupRoute);
app.use(loginRoute);
app.use(logoutRoute);
app.use(clientRoute);

app.use(walletroute)

app.use(adminRoute);
app.use(assetRoute);
app.use(pairsRoute);
app.use(ordersRoute);
app.use(assetsRoute);
app.use(transactionsRoute);

app.use(fileuploadRoute);
app.use(imageuploadRoute);
app.use(videouploadRoute);

app.use(dailyreport);

app.use(userwalletadmin);
app.use(userwalletuser);
app.use(asset_route);
app.use(dashboardcontroller);
app.use(admindashboardcontroller);
app.use(swapcontroller);
app.use(transfercontroller);
app.use(tradercontroller);
app.use(usersettings);

const publicPath = path.join(__dirname, '..', 'public');
const pagesPath = path.join(publicPath, 'pages');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(pagesPath, 'index.html'));
});

mongoose.connect(`${process.env.DB}`, {
  //mongodb://db:27017/traderapiv2 =====> production
  //mongodb://127.0.0.1:27017/traderapiv2 ===> development

  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('connected to database');

  const assets = await Asset.find();

  if (!assets.length) {
    seedAssets({ assetType: 'crypto' });
    seedAssets({ assetType: 'stock' });
    seedAssets({ assetType: 'commodity' });
    seedAssets({ assetType: 'fiat' });
  }

  server.listen(PORT, async (error) => {
    if (error) {
      return error;
    }

    return console.log(`server started on port here now ${PORT}`);
  });
});