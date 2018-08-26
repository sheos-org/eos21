const fs = require('fs');
const Web3 = require('web3');

const input = fs.readFileSync('./build/contracts/BlackHole.json');
const abi = JSON.parse(input.toString()).abi;
console.log(abi)
