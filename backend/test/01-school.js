const School    = artifacts.require('School');
const BigNumber = require('bignumber.js');
const Web3      = require('web3');
const web3      = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const moment    = require('moment');

chai           = require('chai');
chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

expect = chai.expect;

const candidates = [
  {fname: 'Joaquin' , lname: 'Toquica'  , id: '123456789', proposal: 'Voy a construir un muro'   , nomination: 'procurator'} ,
  {fname: 'Genaro'  , lname: 'Gonzalez' , id: '234567891', proposal: 'Voy a poner baños'         , nomination: 'observer'}   ,
  {fname: 'Tatiana' , lname: 'Ramirez'  , id: '345678912', proposal: 'Voy a poner puestos'       , nomination: 'comptroller'},
  {fname: 'Lizeth'  , lname: 'Rodriguez', id: '456789123', proposal: 'Voy a PaZaR el curso'      , nomination: 'comptroller'},
  {fname: 'Tarcisio', lname: 'Torres'   , id: '567891234', proposal: 'Me voy a cambiar el nombre', nomination: 'observer'}   ,
  {fname: 'Donald'  , lname: 'Trump'    , id: '895647895', proposal: 'I will hate forever'       , nomination: 'procurator'} ,
  {fname: 'Hugh'    , lname: 'Hefner'   , id: '365128974', proposal: 'Girls for all'             , nomination: 'procurator'} ,
  {fname: 'Barack'  , lname: 'Obama'    , id: '678912345', proposal: 'I am going to implement'   , nomination: 'procurator'}
];

const voters = [
  {fname: 'Alfonso' , lname: 'Lizarazo' , id: '789123456', vote: 0, candidate_id: '123456789'},
  {fname: 'Hernan'  , lname: 'Pelaez'   , id: '891234567', vote: 1, candidate_id: '234567891'},
  {fname: 'Monica'  , lname: 'Urbina'   , id: '912345678', vote: 2, candidate_id: '345678912'},
  {fname: 'Gabriela', lname: 'Rodriguez', id: '123457896', vote: 3, candidate_id: '456789123'},
  {fname: 'Paola'   , lname: 'Turbay'   , id: '879123456', vote: 4, candidate_id: '567891234'},
  {fname: 'Juanita' , lname: 'Casas'    , id: '978123456', vote: 5, candidate_id: '678912345'},
  {fname: 'Juan'    , lname: 'Arenas'   , id: '278913456', vote: 5, candidate_id: '678912345'},
  {fname: 'Maria'   , lname: 'Mayor'    , id: '378912456', vote: 5, candidate_id: '678912345'},
  {fname: 'Juan'    , lname: 'Garcia'   , id: '478912356', vote: 6, candidate_id: '895647895'},
  {fname: 'Jorge'   , lname: 'Isaacs'   , id: '578912346', vote: 5, candidate_id: '678912345'},
  {fname: 'Laura'   , lname: 'Rodriguez', id: '896575423', vote: 2, candidate_id: '345678912'},
  {fname: 'Alberto' , lname: 'Garcia'   , id: '895245685', vote: 4, candidate_id: '567891234'},
  {fname: 'Jose'    , lname: 'Contreras', id: '857856963', vote: 4, candidate_id: '567891234'}
];

contract('School', accounts => {
  const schools = [
    { schoolName: 'La puertita blanca', canVote: true , account: accounts[1], startDateBallot: moment().subtract(1, 'hours').format('X'), endDateBallot: moment().add(8, 'hours').format('X') },
    { schoolName: 'La puertita negra' , canVote: false, account: accounts[2], startDateBallot: moment().add(2, 'days').format('X')      , endDateBallot: moment().add(2, 'days').add(8, 'hours').format('X') }
  ];

  describe('School contract', () => {
    it('should get an instance', () => {
      School.deployed().then(instance => { school = instance; });
    });

    it('should save the school info', () => {
      schools.forEach(s => {
        school.addSchool(s.account, s.schoolName, s.startDateBallot, s.endDateBallot, {from: s.account})
          .then(tx => {
            expect(tx.tx).to.match(/\w{66}/);
          });
      });
    });

    it('should get school information', () => {
      schools.forEach(s => {
        school.getSchool(s.account)
          .then(school => {
            expect(school).to.be.a('array');
            expect(school.length).to.eq(3);
            expect(web3.toAscii(school[0])).to.eq(s.schoolName);
            expect(school[1].toNumber()).to.eq(BigNumber(s.startDateBallot).toNumber());
            expect(school[2].toNumber()).to.eq(BigNumber(s.endDateBallot).toNumber());
          });
      });
    });

    it('should know if election is open for certain school', () => {
      schools.forEach(s => {
        school.isElectionOpen(s.account)
          .then(result => {
            expect(result).to.eq(s.canVote);
          });
      });
    });

  });

  describe('Dynamics', () => {
    describe('candidates', () => {
      it('should register a candidate with all their info', async () => {
        const s = schools[0];
        const c = candidates[0];
        tx = await school.addCandidate(s.account, c.fname, c.lname, c.proposal, c.id, c.nomination);
        expect(tx.tx).to.match(/\w{66}/);
      });

      it('should get 0 votes for each candidate', async () => {
        const s = schools[0];
        const c = candidates[0];
        candidate = await school.getCandidate(s.account, c.id);
        console.log(candidate)
      });
/*
      it('should get candidates list by index', () => {
        let counter = 0;
        candidates.forEach(c => {
          school.getCandidateByIndex(counter)
            .then(candidate => {
              expect(candidate).to.be.a('array');
              expect(candidate.length).to.eq(7);
              expect(candidate[0]).to.eq(Web3Utils.padRight(Web3Utils.toHex(c.id), 64));
              expect(candidate[1]).to.eq(c.id);
              expect(candidate[2]).to.eq(Web3Utils.padRight(Web3Utils.toHex(c.fname), 64));
              expect(candidate[3]).to.eq(Web3Utils.padRight(Web3Utils.toHex(c.lname), 64));
              expect(Web3Utils.hexToAscii(candidate[4])).to.eq(c.proposal);
              expect(candidate[5].toNumber()).to.eq(BigNumber(0).toNumber());
            });
          ++counter;
        });
      });

      it('should get the total of candidates', () => {
        school.getTotalCandidates()
          .then(total => {
            expect(total.toNumber()).to.be.equal(8);
          })
      });

      it('should get the total of candidates by nomination (procurator)', () => {
        school.getTotalCandidatesByNomination("procurator")
          .then(total => {
            expect(total.c[0]).to.be.equal(4);
          })
      });

      it('should get the total of candidates by nomination (comptroller)', () => {
        school.getTotalCandidatesByNomination("comptroller")
          .then(total => {
            expect(total.c[0]).to.be.equal(2);
          })
      });

      it('should get the total of candidates by nomination observer)', () => {
        school.getTotalCandidatesByNomination("observer")
          .then(total => {
            expect(total.c[0]).to.be.equal(2);
          })
      });

    });

    describe('voters', () => {
      it('record a new voter along with their choice', () => {
        voters.forEach(voter => {
          school.vote(voter.fname, voter.lname, voter.vote, voter.id)
            .then(tx => {
              expect(tx.tx).to.match(/\w{66}/);
            });
        });
      });

      it('avoid vote duplicity', () => {
        const v = voters[1];
        expect(school.vote(v.fname, v.lname, v.vote, v.id)).to.be.eventually.rejected;
      });

    });

    describe('final stage', () => {
      it('gets Barack Obama as winner of procurator', () => {
        school.getWinnerByNomination("procurator")
          .then(winner => {
            expect(winner).to.be.a('array');
            expect(winner.length).to.eq(5);
            expect(winner[0]).to.eq(Web3Utils.padRight(Web3Utils.toHex('678912345'), 64));
            expect(winner[1]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Barack'), 64));
            expect(winner[2]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Obama'), 64));
            expect(winner[3].toNumber()).to.eq(BigNumber(4).toNumber());
            expect(winner[4]).to.eq('procurator');
          });
      });
      it('gets Tatiana Ramirez as winner of comptroller', () => {
        school.getWinnerByNomination("comptroller")
          .then(winner => {
            expect(winner).to.a('array');
            expect(winner.length).to.eq(5);
            expect(winner[0]).to.eq(Web3Utils.padRight(Web3Utils.toHex('345678912'), 64));
            expect(winner[1]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Tatiana'), 64));
            expect(winner[2]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Ramirez'), 64));
            expect(winner[3].toNumber()).to.eq(BigNumber(2).toNumber());
            expect(winner[4]).to.eq('comptroller');
          });
      });
      it('gets Tarcisio Torres as winner of observer', () => {
        school.getWinnerByNomination("observer")
          .then(winner => {
            expect(winner).to.a('array');
            expect(winner.length).to.eq(5);
            expect(winner[0]).to.eq(Web3Utils.padRight(Web3Utils.toHex('567891234'), 64));
            expect(winner[1]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Tarcisio'), 64));
            expect(winner[2]).to.eq(Web3Utils.padRight(Web3Utils.toHex('Torres'), 64));
            expect(winner[3].toNumber()).to.eq(BigNumber(3).toNumber());
            expect(winner[4]).to.eq('observer');
          });
      }); */
    });
  });
});
