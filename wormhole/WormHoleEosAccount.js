module.exports = (blackHole, whiteHole) => {
    blackHole.events.TeleportToAccount({
        // fromBlock: 0
    })
        .on('data', function (event) {
            const { eosAccount, tokens } = event.returnValues;

            console.log("(II) blackHole event (account=" + eosAccount + ", amount=" + tokens + ")");

            if (whiteHole){
                console.log("(TODO) issue tokens");
            }
            else
                console.log("(WW) No whiteHole define. Doing nothing.")
        })
        .on('changed', console.log)
        .on('error', console.error);
}

