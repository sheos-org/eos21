# EOS21 Protocol ✌🏻☝🏼
Teleport your ERC20 tokens to EOS.

#### WARNING !
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## EOS21 Overview

This is a protocol for cross-chain token movement between EOS and ETH chains. ⛓

The goal of this protocol is to provide a standard for app developers to move their tokens and apps between chains.

We believe that any token should be able to move as the developers desire or require as their apps may be best run on different chains at different times.

Typically, the way this has been done is by using what we call the "snapshot" method. 📸 This method is commonly used by token "airdrops" to send to accounts on ETH or EOS chains that match certain criteria such as having an address with at least X balance of the chain's native token. The EOS native token generation from the ERC20 was a snapshot airdrop. EOS was able to do this by expiring their ERC20 contract thereby making the ERC20 EOS tokens infungible.

In the EOS21 protocol, we are providing another option for ERC20 contracts that do not have a built-in pause/expiry function but who want to move their token to another chain. We are calling this action: teleportation. To teleport a token from one chain to another, it will exist on the destination chain, but no longer exist in a fungible form on the source chain.

EOS21 is comprised of 3 layers.

Layer 1 is on the source chain - in this case, ETH. There is a Blackhole 🌌 contract on ETH to perform the absorption of ERC20 tokens and also to receive account information for the destination chain (EOS).

Layer 2 is an Oracle 🔮 program that runs off-chain to watch the ETH transactions and authorize the distribution of EOS tokens (in a future version of this protocol, the Oracle could be run entirely on EOS).

Layer 3 is the EOS token contract which distributes the tokens to the 📩 destination EOS account sent by the token holders in Layer 1.

The standard Blackhole contract has 2 functions - be authorized to receive token Y and then receive the account info or key for the tokens to be distributed on the destination chain.

Once a user sends their tokens and destination account to the Blackhole, the ERC20 tokens will become infungible and the EOS tokens will be teleported to their destination account on the EOS chain. The developer can choose to either send the tokens to a 0X000 address and thereby 🔥 them, or hold them in the Blackhole contract.

EOS21 is open-source and it can be customized or built-on by other developers. Some of the ideas we had include:

* EOS21 contracts could be modified to power a snapshot distribution using registration of EOS accounts or keys.
* EOS21 could be modified to allow tokens to travel both ways in the Teleporter ETH ↔ EOS.
* EOS21 could create public keys on either chain which share the same private key.
* EOS21 could be used to authenticate ETH transactions using EOS or vice-versa.
* EOS21 oracle  🔮 could be written to run entirely on an EOS chain (instead of js).
* EOS21 can be used to move tokens between EOS sister-chains.
* EOS21 Solidity contract could be rewritten to support other chains such as Stellar.

## EOS21 System Requirements
* cmake
* nodejs
* eos.io https://github.com/EOSIO/eos
* EOSIO.CDT (Contract Development Toolkit) https://github.com/EOSIO/eosio.cdt
* node (tested with 8.10 and 10.11)
* `npm install -g ethereum/web3.js` (if you run the oracle 🔮 on OS X, this will help to get things running)

## Mainnet Deployment Instructions
#### *Strongly recommend testing first using the Ganache / Jungle Guide outlined below.*
* Must have ERC20 account and EOS token setup already
* In config.json configure `blackhole` and `eosiotoken` sections to your token parameters.
    * `websocket_provider` will point to Ethereum node - on mainnet use `wss://mainnet.infura.io/ws`
    * `critic_block` will be the Ethereum block number that you want the blackhole contract to expire, set to 0 if it never expires.
    * `decimals` `symbol` and `tokens` will be the number of decimals defined in your ERC20 token contract, the symbol of your ERC20 token, and the maximum amount of tokens in your ERC20 contract.
    * `chain_id` will be the EOS chain ID - for mainnet "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
    * `http_endpoint` points to an EOS API node
    * `account` is the account that has transfer permission of your issued EOS token address
    * `private_key` private key that can has permission to transfer the EOS token
* Install `eos21/blackhole/contracts/BlackHoleEosAccount.sol` on Ethereum mainnet (or official testnet if you want to test there instead of Ganache)
* Run the oracle 🔮 eos21/oracle/TeleportOracle.js

## EOS21 Ganache / Jungle Testnet Guide

### Overview for testing
1. Create token on Ethereum Ganache/Truffle. (4 tokens will be notated as 40000 with 4 decimals in ETH).
2. Distribute new tokens to fresh Ethereum account.
3. Deploy blackhole contract (contract address will automatically update in the config file).
4. Create standard EOS token contract on Jungle Testnet.
5. Deploy new token via contract.
6. Start teleport_oracle on node.js server
7. User on Ethereum must send 2 actions a) authorize blackhole teleport amount b) send EOS account name.
8. Oracle 🔮 will catch the event and send the tokens.
9. Close blackhole.

### Testing Requires the Following 4 Actors:
* **ERC20 Token Contract** Our truffle test will install one for you on truffle for testing - parameters are configured in config.json.
* **BlackHole Contract** in Ethereum Universe - parameters are configured in config.json.
* **Token.Eosio** Standard token in EOSIO Universe, with a token issued there to match the name set in config.json.
* **Oracle 🔮** node.js program to teleport tokens from Ethereum to EOS.

### Ganache / Jungle Testing Prerequisites
##### Install Truffle
https://truffleframework.com/ `npm install -g truffle`
##### Install Ganache
https://truffleframework.com/ganache

###### *Ganache should be running locally on port 8545 (you may need to set this port manually in Ganache preferences or edit config.json to match the port number.)*

##### EOS Account on Jungle Testnet
http://dev.cryptolions.io/#account
##### Use Jungle Faucet to get EOS tokens
http://dev.cryptolions.io/#faucet

#####  Setup EOS account, buy ram.
`cleos -u http://dev.cryptolions.io:38888 system buyram <EOStokencreatoraccount> <EOStokencreatoraccount> "20.0000 EOS"`

##### Setup eos wallet and import private key for account

`cleos wallet create --name "<name of wallet>" --to-console`

`cleos wallet import --private-key <EOS private key>--name "<name of wallet>"`

## Step by Step Jungle Ganache Testing

### Install EOS21 blackhole / ERC20 test token

##### Clone repo from here
`git clone https://github.com/sheos-org/eos21.git`
`mkdir build`
`cd build`

##### get root of eosio.cdt folder - to find a clue - which eosio-cpp

##### Compile the blackhole contract On OS X - /usr/local/bin/eosio-cpp on Linux could be ~/opt/eosio.cdt
```cmake .. -DEOSIO_CDT_ROOT=/usr/local/eosio.cdt
make```

##### cd to root of project to install NPM
`cd ../../../`

##### install npm for project
`npm install`

##### install truffle infrastructure
`npm install -g truffle`

##### compile blackhole contract
```cd blackhole
truffle compile```

##### test all contracts
`truffle test`

##### if the test completes correctly, then we can deploy ERC20 contract and the blackhole contract defined in config.json
`truffle migrate --reset --network ganache`

##### open another terminal and start the oracle from the root of the EOS21 project
`node ./eos21.js`


## Deploy EOS Token Contract
##### create basic EOSIO.token contract
`cleos -u http://dev.cryptolions.io:38888 set contract <EOSTokenCreatorAccount> ./eosio.token`

##### create custom EOS token (you may need to unlock wallet first)
```cleos -u http://dev.cryptolions.io:38888 push action <EOSTokenCreatorAccount> create '["<EOSTokenCreatorAccount>","4.0000 <EOSTokenName>"]' -p <EOSTokenCreatorAccount>@active```

### Test Blackhole Teleportation
#####  Enter ganache console
`truffle console --network ganache`

#####  Get the ERC token contract address
`ERC20Token.deployed().then(i => erc20=i)`

#####  *Search in the results of the above command, you will get the public key of the ERC20 token in the "from" field. Take note of this, you will need this in a minute.*
		class_defaults:
		{ from: '0x52410180254b53a0816e77082ec0578d7a141c5c',

#####  Deploy blackhole contract
`BlackHoleEosAccount.deployed().then(i => blackhole=i)`

#####  Approve blackhole to take tokens
`erc20.approve(blackhole.address, 40000, {from:'<use public key of ERC20 token address above in our example it is 0x524...>'})`

##### Teleport tokens by entering destination EOS account
`blackhole.teleport("<DestinationEOSAccount>")`

##### You should see the action happen in the console of your oracle!

* check balance
`cleos -u http://dev.cryptolions.io:38888 get table <EOSTokenCreatorAccount> <DestinationEOSAccount> accounts`

## Your tokens have been teleported!
