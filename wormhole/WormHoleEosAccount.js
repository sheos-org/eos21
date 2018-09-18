class WormHoleEosAccount {
    constructor(blackHoleInstance, whiteHoleInstance, eosPrivateKey) {
        blackHoleInstance.events.TeleportToAccount({
           // fromBlock: 0
        }, function (error, event) { console.log(event); })
            .on('data', function (event) {
                const { eosAccount, tokens } = event.returnValues;

                console.log("!!!!!!!!! TODO: make WhiteHole issue " + tokens + " tokens to " + eosAccount + " EOS account. !!!!!!!!!!!");
            })
            .on('changed', function (event) {
                // remove event from local database
            })
            .on('error', console.error);
    }
}

module.exports = WormHoleEosAccount;
