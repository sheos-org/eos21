# eos21
Teleport your ERC20 tokens to EOS.

# WARNING !
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

In order to burn Ethereum ERC20 tokens and materialize them into EOS we need 3 programs:

* **BlackHole** Contract in Ethereum Universe.
* **token.eosio** Standard token in EOSIO Universe.
* **oracle** node.js program to teleport tokens from Ethereum to EOS.

# EOS21 System Requirements:
* cmake
* nodejs
* eos.io https://github.com/EOSIO/eos
* EOSIO.CDT (Contract Development Toolkit) https://github.com/EOSIO/eosio.cdt
* node (tested with 8.10 and 10.11)
* `npm install -g ethereum/web3.js` (if you run the oracle on OS X, this will help to get things running)

EOS21 Testing Requirements

# Testing Prerequisites
* Truffle https://truffleframework.com/ (`npm install -g truffle`)
* Ganache https://truffleframework.com/ganache running locally on port 8545 (you may need to set this port manually in Ganache preferences)
* EOS Account on Jungle Testnet - http://dev.cryptolions.io
    * Use faucet for tokens
    * Setup EOS account, buy ram.
    * `cleos -u http://dev.cryptolions.io:38888 system buyram <EOStokencreatoraccount> <EOStokencreatoraccount> "20.0000 EOS"`
* Setup eos wallet and import private key for account
    * `cleos wallet create --name "<name of wallet>" --to-console`
    * `cleos wallet import --private-key <EOS private key>--name "<name of wallet>"`

# Overview
1. Create token on Ethereum Ganache/Truffle. (4 tokens will be notated as 40000 with 4 decimals in ETH).
2. Distribute new tokens to fresh Ethereum account.
3. Deploy blackhole contract (contract address will automatically update in the config file).
4. Create standard EOS token contract on Jungle Testnet.
5. Deploy new token via contract.
6. Start teleport_oracle on node.js server
7. User on Ethereum must send 2 actions a) authorize blackhole teleport amount b) send EOS account name.
8. Oracle will catch the event and send the tokens.
9. Close blackhole.


# Step by Step Instructions
```
# Clone repo from here
git clone https://github.com/sheos-org/eos21.git
mkdir build
cd build

# get root of eosio.cdt folder - to find a clue - which eosio-cpp

# On OS X - /usr/local/bin/eosio-cpp on Linux could be ~/opt/eosio.cdt
cmake .. -DEOSIO_CDT_ROOT=/usr/local/eosio.cdt

# make the package
make

# create basic EOSIO.token contract
cleos -u http://dev.cryptolions.io:38888 set contract <EOStokencreatoraccount> ./eosio.token

# issue EOS tokens
`"cleos push action <EOStokencreatoraccount> create '["EOStokencreatoraccount","4.0000"]'"`

# cd to root of project
cd ../../../

# install npm for project
npm install

# install truffle test
npm install -g truffle

# compile blackhole contract
cd blackhole
truffle compile

# test all contracts
truffle test

# if it all completes correctly, then we can deploy
truffle migrate --reset --network ganache

# open another terminal and start the oracle
cd ../
node ./eos21.js

# create token on EOS (you may need to unlock wallet)
cleos -u http://dev.cryptolions.io:38888 push action <EOStokencreatoraccount> create '["<EOStokencreatoraccount>","4.0000 <tokenname>"]' -p <EOStokencreatoraccount>@active

# Enter ganache
truffle console --network ganache

# Deploy test ERC20 token
ERC20Token.deployed().then(i => erc20=i)

# in the results of this command, you will get      
# class_defaults:
#      { from: '0x52410180254b53a0816e77082ec0578d7a141c5c',
# ^^ This will be the address of the ERC20 account that owns some test tokens

# deploy blackhole contract
BlackHoleEosAccount.deployed().then(i => blackhole=i)

# approve blackhole to take tokens
erc20.approve(blackhole.address, 40000, {from:'0x52410180254B53A0816e77082EC0578D7A141c5c'})

# teleport tokens by entering destination EOS account
blackhole.teleport("<destinationEOSaccount>")

# check balance
cleos -u http://dev.cryptolions.io:38888 get table <EOStokencreatoraccount> <destinationEOSaccount> accounts
```
