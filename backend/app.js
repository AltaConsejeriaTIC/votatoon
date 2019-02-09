const app = require('express')();
const basicAuth = require('express-basic-auth');
const fs = require('fs');
const private_key = fs.readFileSync('ssl/server.key', 'utf8');
const certificate = fs.readFileSync('ssl/server.crt', 'utf8');
const credentials = {
  key: private_key, cert: certificate
};
const http = require('http').Server(app);
const https = require('https').Server(credentials, app);
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const cors = require('cors');
const Web3 = require('web3');
const config = require('./config/config');

app.use(timeout('300s'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(haltOnTimedout);
app.use(basicAuth({
  users: { 'vivelab': 'vivelabbogota' },
  unauthorizedResponse: getUnauthorizedResponse
}));

const tool  = require('./tools');
const Web3Utils      = require('web3-utils');

/*
 * Auth basic
 *
 * POST /api/... HTTP/1.1
 * Host: localhost:3000
 * Content-Type: application/json
 * Authorization: Basic dml2ZWxhYjp2aXZlbGFiYm9nb3Rh
 * Cache-Control: no-cache
 *
 */
function getUnauthorizedResponse(req) {
  return (req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
    'No credentials provided');
}

let ethereumNode;
let mainAddress;
console.log('Environment: ', config.environment);
switch (config.environment) {
  case 'development':
    ethereumNode = config.blockchainNode.development;
    mainAddress = config.mainAddress.development;
    break;
  case 'test':
    ethereumNode = config.blockchainNode.test;
    mainAddress = config.mainAddress.test;
    break;
  case 'production':
    ethereumNode = config.blockchainNode.production;
    mainAddress = config.mainAddress.production;
    break;
  default:
    ethereumNode = config.blockchainNode.development;
    mainAddress = config.mainAddress.development;
}

const web3 = new Web3(new Web3.providers.HttpProvider(ethereumNode));

// Contracts
const School = require('./handlers/school');

console.log(new Date(), 'Block Number', web3.eth.blockNumber);
//console.log(new Date(), 'Decrypted text', tool.decrypted(Web3Utils.hexToAscii('0xb83a82ac00000000000000000000000000b88b373d92b58c17b81340b21e581fb3810c021ae38000000000000000000000000000000000000000000000000000000000006132316561356531000000000000000000000000000000000000000000000000')));

app.get('/', function (req, res) {
  res.send('Backend');
});

//API Services
/*
 * Header
 * address: address school
 *
 * data:
 * {
 *  "name": string,
 *  "start": timestamp,
 *  "end": timestamp
 * }
 *
 */
app.post('/addSchool', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const data = req.body;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  School.doAccountUnlocked(schoolAddress, web3);
  console.log(new Date(), '/addSchool School address: ', schoolAddress);
  School.addSchool(schoolAddress, data)
    .then(function (tx) {
      res.json(tx);
    })
    .catch(function (error) {
      res.json(error);
    });
});

/*
 * Header
 * address: address school
 *
 */
app.get('/getSchool', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  School.init(mainAddress, web3);
  const schoolAddress = req.header('address');
  console.log(new Date(), '/getSchool School address: ', schoolAddress);
  School.getSchool(schoolAddress)
    .then(function (schoolName) {
      res.json(schoolName);
    })
    .catch(function (error) {
      res.json(error);
    });

});

/*
 * Header
 * address: address school
 *
 * data:
 * {
 *  "id": integer,
 *  "fname": string,
 *  "lname": string,
 *  "proposal": text,
 *  "nomination": enum("procurator", "comptroller", "observer")
 * }
 *
 */
app.post('/addCandidate', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const data = req.body;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  School.doAccountUnlocked(schoolAddress, web3);
  console.log(new Date(), '/addCandidate School address: ', schoolAddress);
  School.addCandidate(schoolAddress, data)
    .then(function (tx) {
      res.json(tx);
    })
    .catch(function (error) {
      res.json(error);
    });
});


/*
 * Header
 * address: address school
 *
 * parameters:
 * "id": string
 *
 */
app.get('/getCandidate', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const id = req.query.id;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  console.log(new Date(), '/getCandidate School address: ', schoolAddress)
  School.getCandidate(schoolAddress, id)
    .then(function (candidate) {
      res.json(candidate);
    })
    .catch(function (error) {
      res.json(error);
    });
});

/*
 * Header
 * address: address school
 *
 *
 */
app.get('/getCandidatesList', function (req, res) {
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  console.log(new Date(), '/getCandidatesList School address: ', schoolAddress)
  School.getCandidatesList(schoolAddress)
    .then(function (list) {
      res.json(list);
    })
    .catch(function (error) {
      res.json(error);
    });
});

/*
 * Header
 * address: address school
 *
 * data:
 * {
 *  "idVoter": string,
 *  "idCandidate": string
 * }
 */
app.post('/vote', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const data = req.body;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  School.doAccountUnlocked(schoolAddress, web3);
  console.log(new Date(), '/vote School address: ', schoolAddress);
  School.doVote(schoolAddress, data)
    .then(function (tx) {
      res.json(tx);
    })
    .catch(function (error) {
      res.json(error);
    });
});

/*
 * Header
 * address: address school
 *
 * parameters:
 * "nomination": enum("procurator", "comptroller", "observer")
 *
 */
app.get('/getWinner', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const nomination = req.query.nomination;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  console.log(new Date(), '/getWinner School address: ', schoolAddress);
  School.getWinner(schoolAddress, nomination)
    .then(function (winner) {
      res.json(winner);
    })
    .catch(function (error) {
      res.json(error);
    });
});

/*
 * Header
 * address: address school
 *
 * parameters:
 * "id": string
 * "nomination": enum("procurator", "comptroller", "observer")
 *
 */
app.get('/hasVoted', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const id = req.query.id;
  const nomination = req.query.nomination;
  const schoolAddress = req.header('address');
  School.init(mainAddress, web3);
  console.log(new Date(), '/hasVoted School address: ', schoolAddress);
  School.hasVoted(schoolAddress, id, nomination)
    .then(function (voted) {
      res.json(voted);
    })
    .catch(function (error) {
      res.json(error);
    });
});

app.get('/getTransactions', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const schoolAddress = req.header('address');
  const initialBlock = req.header('initialBlock');
  const finalBlock = req.header('finalBlock');
  School.init(mainAddress, web3);
  console.log(new Date(), '/getTransactions School address: ', schoolAddress);
  School.getTransactionsByAccount(web3, schoolAddress, 	initialBlock, finalBlock)//2710779-2713738
    .then(function (tx) {
      res.json(tx);
    })
    .catch(function (error) {
      res.json(error);
    });
});

app.use(haltOnTimedout);

function haltOnTimedout (req, res, next) {
  if (!req.timedout) {
    next();
  }
}

function errorHandler (err, req, res, next) {
  res.status (res.statusCode) .json ({
    'Message': err.message,
    'Status': res.statusCode,
    'Content': req.headers
  });
}
app.use(errorHandler);

http.listen(config.httpPort);
https.listen(config.httpsPort);
