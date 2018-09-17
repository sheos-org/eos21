# eos21
Teleport your ERC20 tokens to EOS.

In order to burn Ethereum ERC20 Tockens and materialize them into EOS we need 3 actors:

* **BlackHole** Contract in Ethereum Universe.
* **WhiteHole** Contract in EOSIO Universe.
* **WormHole** to teleport tockens.

# Compilation
## BlackHole
```
$ sudo npm install -g truffle
$ npm install
$ cd blackhole
$ truffle compile
$ truffle test
```

## WhiteHole
```
$ cd blackhole
$ mkdir build
$ cd build
$ cmake .. -DEOSIO_WASMSDK_ROOT=<path_to_eosio.wasmsdk>
$ make


