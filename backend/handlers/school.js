const contract       = require('truffle-contract');
const BigNumber      = require('bignumber.js');
const Web3Utils      = require('web3-utils');
const SchoolContract = require('../build/contracts/School.json');
const config         = require('../config/config');
const tool           = require('../tools');
require('dotenv').config();
module.exports = {
  contract: null,
  instance: null,
  _result: null,
  _error: null,

  init: function (address, web3) {

    let self = this;
    return new Promise(function (resolve, reject) {
      let mainAddress = self.selectAddress(address, web3);
      console.log('Main address: ', self.selectAddress(mainAddress, web3));
      self.contract = contract(SchoolContract);
      let gasPrice = (BigNumber(web3.eth.gasPrice).toNumber())*100;
      console.log('Gas Price: ', web3.fromWei(gasPrice, 'ether'));
      self.contract.defaults({
        from: mainAddress,
        gas: 4700036,
        gasPrice: gasPrice
      });
      self.contract.setProvider(web3.currentProvider);
      let balance = web3.eth.getBalance(mainAddress);
      console.log('Balance: ', web3.fromWei(balance.toNumber(), 'ether')); // 1000000000000

      self.contract.deployed()
        .then(function (instance) {
          self.instance = instance;
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
  },

  addSchool: function (address, data) {
    let self = this;
    return new Promise(function (resolve, reject) {
      console.log('Tansacción enviada. Esperando respuesta.')
      self.instance.addSchool(address, tool.encrypted(data.name), data.start, data.end, {from: address})
        .then(function (tx) {
          console.log(new Date(), 'Tansacción confirmada');
          console.log(tx)
          resolve(tx);
        })
        .catch(function (error) {
          console.log('Transacción con error')
          console.error(error);
          reject(error);
        });
    });
  },

  getSchool: function (address) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.getSchool(address)
        .then(function(school) {
          let object = {
            schoolName:        tool.decrypted(Web3Utils.hexToString(school[0])),
            startDateBallot:   school[1],
            endDateBallot:     school[2]
          };
          resolve(object);
        })
        .catch(function(error) {
          console.error(error);
          reject(error);
        });
    });
  },

  addCandidate: function (address, data) {
    let self = this;
    return new Promise( function (resolve, reject) {
      self.instance.getCandidate(address, data.id)
        .then(function (candidate) {
          console.log(candidate)
          let result = false;
          if (Web3Utils.hexToString(candidate[0]) !== '') {
            result = true;
          }
          return result;
        })
        .then(function (result) {
          if (result === false) {
            return self.instance.addCandidate(
                address,
                tool.encrypted(data.id),
                tool.encrypted(data.fname),
                tool.encrypted(data.lname),
                tool.encrypted(data.photoUrl),
                data.nomination,
                data.position,
                {from: address}
            )
          }
            return "This candidate already exist.";
        })
        .then(function (tx) {
          resolve(tx)
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
  },

  getCandidate: function(address, id) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.getCandidate(address, tool.encrypted(id))
        .then(function(candidate) {
          console.log(candidate)
          let object = {
            fname:      tool.decrypted(Web3Utils.hexToString(candidate[0])),
            lname:      tool.decrypted(Web3Utils.hexToString(candidate[1])),
            votes:      candidate[2],
            nomination: candidate[3],
            photoUrl:   tool.decrypted(Web3Utils.hexToString(candidate[4])),
            position:   candidate[5]
          };
          resolve(object);
        })
        .catch(function(error) {
          console.error(error);
          reject(error);
        });
    });
  },

  getCandidateByIndex: function (address, index) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.getCandidateByIndex(address, index)
        .then(function(candidate) {
          let object = {
            id:         tool.decrypted(Web3Utils.hexToString(candidate[0])),
            fname:      tool.decrypted(Web3Utils.hexToString(candidate[1])),
            lname:      tool.decrypted(Web3Utils.hexToString(candidate[2])),
            votes:      candidate[3],
            nomination: candidate[4],
            photoUrl:   tool.decrypted(Web3Utils.hexToString(candidate[5])),
            position:   candidate[6]
          };
          resolve(object);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  getTotalCandidates: function(address) {
    let self = this;
    return new Promise( function (resolve, reject) {
      self.instance.getTotalCandidates(address)
        .then(function(total) {
          resolve(total.toNumber());
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  getTotalCandidatesByNomination: function(address, nomination) {
    let self = this;
    return new Promise( function (resolve, reject) {
      self.instance.getTotalCandidatesByNomination(address, nomination)
        .then(function(total) {
          resolve(total.toNumber());
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  getCandidatesList: function (address) {
    let self = this;
    return new Promise( function (resolve, reject) {
      self.getTotalCandidates(address)
        .then(function (total) {
          const list = [];
          for (let i=0; i<total; i++) {
            list.push(i);
          }
          return list;
        })
        .then(function (list) {
          let result = [];
          for (let i=0; i < list.length; i++) {
            const ps = self.getCandidateByIndex(address, i);
            result.push(ps);
          }
          return result;
        })
        .then(function (resultPromises) {
          Promise.all(resultPromises).then(candidates => {
            resolve(candidates);
          });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },

  doVote: function(address, data) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.vote(address, data.idVoter, tool.encrypted(data.idCandidate), {from: address})
        .then(function(tx) {
          resolve(tx);
        })
        .catch(function(error) {
          console.error(error);
          reject(error);
        });
    });
  },

  hasVoted: function(address, id, nomination) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.hasVoted(address, tool.encrypted(id), nomination, {from: address})
        .then(function(timestamp) {
          resolve(timestamp);
        })
        .catch(function(error) {
          console.error(error);
          reject(error);
        });
    });
  },

  getWinner: function(address, nomination) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.instance.getWinner(address, nomination)
        .then(function(winner) {
          let object = {
            id:         tool.decrypted(Web3Utils.hexToString(winner[0])),
            fname:      tool.decrypted(Web3Utils.hexToString(winner[1])),
            lname:      tool.decrypted(Web3Utils.hexToString(winner[2])),
            votes:      winner[3],
            nomination: winner[4],
            photoUrl:   tool.decrypted(Web3Utils.hexToString(winner[5])),
            position:   winner[6]
          };
          resolve(object);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  doAccountUnlocked: function (address, web3, callback) {
    console.log('Desbloqueando: '+ address)
    web3.personal.unlockAccount(address, process.env.WALLET_PASSWORD, 0x10,
      function (error, result) {
        if (!error) {
          console.log('Result Unlock Account: ', result);
          callback();
        } else if (error) {
          console.error('Error Unlock Account: ', error);
        }
      });
  },

  getTransactionsByAccount: function (web3, myaccount, startBlockNumber = null, endBlockNumber = null) {
    if (endBlockNumber == null) {
      endBlockNumber = web3.eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions from account \"" + myaccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {

      let block = web3.eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach(function (e) {
          if ( e.from !== null && myaccount.toLowerCase() === e.from.toLowerCase() ) {
            /*console.log("  tx hash          : " + e.hash + "\n"
              + "   nonce           : " + e.nonce + "\n"
              + "   blockHash       : " + e.blockHash + "\n"
              + "   blockNumber     : " + e.blockNumber + "\n"
              + "   transactionIndex: " + e.transactionIndex + "\n"
              + "   from            : " + e.from + "\n"
              + "   to              : " + e.to + "\n"
              + "   value           : " + e.value + "\n"
              + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
              + "   gasPrice        : " + e.gasPrice + "\n"
              + "   gas             : " + e.gas + "\n"
              + "   input           : " + e.input);*/
            //console.log(e.blockNumber, e.hash, Web3Utils.hexToString(e.input));
            console.log(e.blockNumber, e.hash, Web3Utils.hexToAscii(e.input));
          }
        })
        //console.log(new Date(), 'End process')
      }
    }
  },

  isLockAccount: function (address, web3) {
    return new Promise(function (resolve, reject) {
      const msg = web3.sha3('Sign address');
      let self = this;
      web3.eth.sign(address, msg, function (error, result) {
        if (!error) {
          self._result = result;
        } else if (error) {
          self._error = error;
          self._result = null;
        }
      });
      if (this._result === null || typeof this._result === "undefined") {
        reject(this._error);
      } else {
        resolve(this._result);
      }
    });
  },

  selectAddress: function (address, web3) {
    return address;
  }

};
