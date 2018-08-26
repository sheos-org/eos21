const fs = require('fs');
const Web3 = require('web3');

const input = fs.readFileSync('./build/contracts/BlackHole.json');
const abi = JSON.parse(input.toString()).abi;

let provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
const web3 = new Web3(provider);
let BlackHole = new web3.eth.Contract(abi);