const socket = require('zmq').createSocket('rep');
const Web3 = require('web3');
const EosJs = require('eosjs');
const check = require('./Check');

class WormHoleEosAccount {
    initEthereumProvider(provider){
        const web3 = new Web3();
        web3.setProvider(provider);

        this.web3 = web3;
    }

    initEos(config){
        this.eos = new EosJs(config);
    }

    async initWhiteHole(address){
        this.whiteHole = await this.eos.contract(address)
    }

    initEventHandler(onData) {
        const blackHole = this.blackHole;

        blackHole.events.TeleportToAccount({
            // fromBlock: 0
        })
            .on('data', function (event) {
                const { eosAccount, tokens } = event.returnValues;
                const whiteHole = this.whiteHole;

                if (onData)
                    onData(eosAccount, tokens);
                else
                    console.log("(WW) no hadler function installer. Received (" + eosAccount + ", " + tokens + ")");
            })
            .on('changed', function (event) {
                // remove event from local database
            })
            .on('error', console.error);
    }

    initBlackHole(abi, address) {
        const web3 = this.web3;

        check(web3.utils.isAddress(address), "validating blackhole address");
        const blackHole =  new web3.eth.Contract(abi, address);
        check(blackHole, "create instance to blackhole contract");
        check(blackHole.options.address === web3.utils.toChecksumAddress(address), "instance has correct address");

        this.blackHole = blackHole;
    }

    wait() {
        socket.on('message', function (buf) {
            // echo request back
            socket.send(buf);
        });

        process.on('SIGINT', function () {
            socket.close();
            console.log("... exiting.");
            process.exit();
        });

        console.log("(II) press ctrl+c to exit");
        socket.bindSync('tcp://*:5555');
    };

}

module.exports = WormHoleEosAccount;
