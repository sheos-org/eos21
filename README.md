# EOS21 Protocol ✌🏻☝🏼
Teleport your ERC20 tokens to EOS.

## Summary

EOS21 is a protocol for cross-chain ⛓ token movement between ETH and EOS.

ETH (ERC20) --> EOS (tokens)

The goal of this protocol is to provide a standard for app developers to move their tokens and apps between chains.

## Built With
* [EOS.IO](https://github.com/EOSIO/eos) - EOS Blockchain
* [EOSIO.CDT](https://github.com/EOSIO/eosio.cdt) - EOS Contract Development Toolkit

## Prerequisites
* [node.js](https://nodejs.org) - Javascript runtime (tested with v8.10 and 10.11)
* [cmake](https://cmake.org/) - Packaging

## EOS21 Overview

We believe that any token should be able to move as the developers desire or require as their apps may be best run on different chains at different times.

Typically, the way this has been done is by using what we call the "snapshot" method. 📸  This method is commonly used by token "airdrops" to send to accounts on ETH or EOS chains that match certain criteria such as having an address with at least X balance of the chain's native token. The EOS native token generation from the ERC20 was a snapshot airdrop. EOS was able to do this by expiring their ERC20 contract thereby making the ERC20 EOS tokens non-fungible.

In the EOS21 protocol, we are providing another option for ERC20 contracts that do not have a built-in pause/expiry function but who want to move their token to another chain. We are calling this action: teleportation. To teleport a token from one chain to another, it will exist on the destination chain, but no longer exist in a fungible form on the source chain.

#### The EOS21 Protocol has 3 Dimensions

* **Dimension 1** is on the source chain, Ethereum. There is a Blackhole 🌌 contract on ETH to perform the absorption of ERC20 tokens and also to receive account information for the destination chain (EOS). This information can either be configured to use the EOS Account name or an EOS Public Key. In the second case, the oracle must be changed to create an EOS account for the user.
* **Dimension 2** is an Oracle 🔮 program that runs off-chain to watch the ETH transactions and authorize the distribution of EOS tokens (in a future version of this protocol, the Oracle could be run entirely on EOS).
* **Dimension 3** is the destination chain, EOS. The EOS token contract which distributes the tokens to the 📩  destination EOS account sent by the token holders in Layer 1.

The standard Blackhole contract has 2 functions - be authorized to receive token Y from Ethereum and then receive the EOS account info the tokens to be distributed on the destination chain via the Oracle.

Once a user sends their tokens and destination account to the Blackhole, the ERC20 tokens will become non-fungible and the EOS tokens will be teleported to their destination account on the EOS chain.

The developer can choose to either send the tokens to a 0X000 address and thereby 🔥 them, or hold them in the Blackhole contract.


##### EOS21 Github Inventory
* **eos21/eos21.js** - Oracle for managing teleportation of tokens from ETH to EOS
* **eos21/config.json** - configuration file for blackhole and oracle contracts
* **eos21/blackhole/contracts/** - blackhole contracts listed below
    * **BlackHole.sol**	- blackhole contract that will attract ERC20 tokens
    * **BlackHoleEosAccount.sol**	- blackhole contract that takes an EOS Account as an input to activate a teleportation
    * **BlackHoleEosPublicKey.sol** - takes an EOS public key as an input to activate a teleportation (you will need to create  accounts using a modified oracle for account creation)
    * **TestERC20Token.sol** - used to specify ElementToken.sol for test deployments
    * **TestElementToken.sol** - default ElementToken contract for ERC20 tokens
    * **EosValidator.sol** - validates EOS account or key


* **eos21/blackhole/migrations/** - scripts for deploying truffle test
* **eos21/blackhole/test/** - truffle tests of the blackhole
* **eos21/eosio.token/** - standard EOSIO token contracts for testing from EOS.IO github
* **eos21/utils/** - error checking script.
* **eos21/package.json** - NPM installer for test suite

# Contributions

*EOS21 is open-source and we encourage you to customize, fork, and use the code. We built this as a example case. Some of the ideas we have include:*

* **EOS21 contracts could be modified to power a snapshot distribution using registration of EOS accounts or keys.**
* **EOS21 contracts could be modified to burn ETH tokens by sending them to a 0x00 address after the Oracle successfully moves them to EOS.**
* **EOS21 could be modified to allow tokens to travel both ways in the Teleporter ETH ↔ EOS.**
* **EOS21 could create public keys on either chain which share the same private key.**
* **EOS21 could be used to authenticate ETH transactions using EOS or vice-versa.**
* **EOS21 oracle could be written to run entirely on an EOS chain (instead of node.js).**
* **EOS21 can be used to move tokens between EOS sister-chains.**
* **EOS21 Solidity contract could be rewritten to support other chains such as Stellar.**
----------

# End-to-End Testing

*For testing, we will use a local Ethereum chain via Ganache and the EOS Jungle Testnet.*

### Overview for Testing

*Our scripts automate some of this process, but this is to help you understand what each step is in the process.*

1. **Create token on Ethereum.** *Truffle does this. (4 tokens will be notated as 40000 with 4 decimals in Ethereum contract - configure this in the config.json).*
2. **Distribute new tokens to fresh Ethereum account.** *Truffle does this.*
3. **Deploy blackhole contract.** *Contract address will automatically update in the truffle config file).*
4. **Deploy standard eosio.token contract on Jungle Testnet.**
5. **Issue EOS token via eosio.token contract.** *Parameters are configured in config.json*
6. **Start teleport_oracle on node.js server.**
7. **Source Ethereum account must send 2 actions.**
    * Authorize blackhole to teleport an amount of ERC20 tokens.
    * Send EOS account name to activate teleportation.
8. **Oracle will catch the event on Ethereum and send the tokens to the EOS account specified in step 7.**
9. **Close blackhole.**

### Ganache / Jungle Testing Prerequisites
* [Truffle](https://truffleframework.com) - `npm install -g truffle`
* [Ganache](https://truffleframework.com/ganache) - One click local Ethereum blockchain  
    * *Ganache should be configured to run locally on port 8545 (you may need to set this port in Ganache preferences or edit config.json to match the port number.)*

### Ganache / Jungle Testing Preparation
* [Create EOS Account on Jungle Testnet. GUI](http://dev.cryptolions.io/#account) *This will be our EOSTokenCreatorAccount.*
* [Use Jungle Testnet Faucet GUI to get EOS into your EOS Account. ](http://dev.cryptolions.io/#faucet)*Jungle Testnet gives you free tokens!*


* **Setup EOS wallet**
    * `cleos wallet create --name "<name of wallet>" --to-console`


* **Import private key for account**
    * `cleos wallet import --private-key <EOS private key>--name "<name of wallet>"`


* **Buy ram to deploy EOS token contract.** *This requires about 300kb of RAM, so 20 EOS should be enough on the testnet. For the mainnet, use [EOS NY's EOS Resource Planner](https://www.eosrp.io/) to estimate pricing*
    * `cleos -u http://dev.cryptolions.io:38888 system buyram <EOSTokenCreatorAccount> <EOSTokenCreatorAccount> "20.0000 EOS"`



## Step 1: Truffle Deployment of Ethereum Contracts (ERC20 token + Blackhole)

* **Clone EOS21 repository**
   * `git clone https://github.com/sheos-org/eos21.git`
   * `mkdir build`
   * `cd build`


* ** Compile the blackhole contract**
    * `cmake .. -DEOSIO_CDT_ROOT=/usr/local/eosio.cdt && make`


* ** Change directories to root of project**
    * `cd ../../../`


* ** Install npm for project**
    * `npm install`


* ** Install truffle infrastructure**
    * `npm install -g truffle`


* ** Compile blackhole contract**
    * `cd blackhole && truffle compile`


* ** Test all contracts**
    * `truffle test`


* ** Deploy ERC20 contract and the blackhole contract defined in config.json**
    * `truffle migrate --reset --network ganache`
    * *This process will also send your newly created ERC20 tokens to your first account in the Ganache interface.*

## Step 2: Deploy Oracle
* ** Start the oracle from the root of the EOS21 project**
  * *Open another session - or even better [screen](https://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/) the command.*
  * `node ./eos21.js`

## Step 3: Deploy EOS Token Contract
* ** Deploy standard EOSIO.token contract**
  * `cleos -u http://dev.cryptolions.io:38888 set contract <EOSTokenCreatorAccount> ./eosio.token`

* ** Issue custom EOS Token via eosio.token contract** *You may need to unlock wallet first)*
`cleos -u http://dev.cryptolions.io:38888 push action <EOSTokenCreatorAccount> create '["<EOSTokenCreatorAccount>","4.0000 <EOSTokenName>"]' -p <EOSTokenCreatorAccount>@active`

## Step 4: Test Teleportation
* ** Enter ganache console**
  * `truffle console --network ganache`

* ** Get the ERC token contract address**
  * `ERC20Token.deployed().then(i => erc20=i)`
  * *Search in the results of the above command, you will get the public key of the ERC20 token in the "from" field. Take note of this, you will need this in a minute 0x52... will be the ERC20PublicKey we in 2 steps*
  * **ERC20PublicKey Example:**
		class_defaults:
		{ from: '0x52410180254b53a0816e77082ec0578d7a141c5c',


* ** Use Blackhole Contract**
    * `BlackHoleEosAccount.deployed().then(i => blackhole=i)`


* ** Send Approval to Blackhole to Attract Tokens**
    * `erc20.approve(blackhole.address, 40000, {from:'<ERC20PublicKey>'})`
    * *this is the 0x52... address from the example above, your address will be different.*


* ** Teleport tokens by entering destination EOS account**
    * `blackhole.teleport("<DestinationEOSAccount>")`
    *  *You should see the action happen in the console of your oracle!*


* ** Check balance of Custom EOS Tokens in the Destination EOS account**
    *  `cleos -u http://dev.cryptolions.io:38888 get table <EOSTokenCreatorAccount> <DestinationEOSAccount> accounts`

## Your tokens have been teleported!
-------
#### WARNING !
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Mainnet Deployment
#### *Strongly recommend testing first using the Ganache / Jungle Guide outlined above.*

#### Preparation
* Must have ERC20 token deployed on Ethereum mainnet, EOS token deployed on EOS mainnet, and have the keys that control the EOS account loaded in a wallet where the oracle will be running.
* In config.json configure `blackhole` and `eosiotoken` sections to your token parameters.
    * `websocket_provider` will point to Ethereum node - on mainnet use `wss://mainnet.infura.io/ws`
    * `critic_block` will be the Ethereum block number that you want the blackhole contract to expire, set to 0 if it never expires.
    * `decimals` `symbol` and `tokens` will be the number of decimals defined in your ERC20 token contract, the symbol of your ERC20 token, and the maximum amount of tokens in your ERC20 contract.
    * `chain_id` will be the EOS chain ID - for EOS mainnet it will be `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`
    * `http_endpoint` points to an EOS API node
    * `account` is the account that has transfer permission of your issued EOS token address
    * `private_key` private key that can has permission to transfer the EOS token
* Install `eos21/blackhole/contracts/BlackHoleEosAccount.sol` or `blackhole/contracts/BlackHoleEosPublicKey.sol` on Ethereum mainnet
* Start the Oracle 🔮 eos21/oracle/TeleportOracle.js

# People

## Authors

* **Ben Sigman** - *architecture, testing, and documentation* - [bensig](https://github.com/bensig)
* **Alessandro Siniscalchi** - *C++/js heavy lifting*
[asiniscalchi](https://github.com/asiniscalchi)

## Contributors

* **Angel Jose** - *js Guidance*
[ajose01](https://github.com/ajose01)
* **Vladimir Venediktov** - *js/C++ Guidance*
[venediktov](https://github.com/venediktov)

## Shoutouts

[Cryptolions](https://cryptolions.io/) - *For keeping the Jungle Testnet alive! And for the awesome Jungle Testnet T-Shirts. *

[Brock Pierce](https://twitter.com/brockpierce) - *Thanks for giving the protocol a name - EOS21.*

[Crystal Rose](https://twitter.com/crystalrose) - *Thanks for giving birth to the idea for this protocol and all of your support.*

# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
