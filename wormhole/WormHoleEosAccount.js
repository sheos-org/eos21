class WormHole {
    constructor(blackHoleInstance, eosPrivateKey) {
        this.eosPrivateKey = eosPrivateKey;

        blackHoleInstance.events.TeleportToAccount({
           // fromBlock: 0
        }, function (error, event) { console.log(event); })
            .on('data', function (event) {
                const { eosAccount, tokens } = event.returnValues;
                console.log(eosAccount, tokens);
                //console.log(event); // same results as the optional callback above
            })
            .on('changed', function (event) {
                // remove event from local database
            })
            .on('error', console.error);
    }
}

module.exports = WormHole;
