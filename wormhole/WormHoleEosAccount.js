module.exports = (params) => {
    const { blackHole, onData } = params;

    blackHole.events.TeleportToAccount({
         fromBlock: 0
    })
        .on('data', event => {
            const { eosAccount, tokens } = event.returnValues;

            console.log("(II) blackHole event (account=" + eosAccount + ", amount=" + tokens + ")");

            if (onData) {
                onData(event);
            }
            else
                console.log("(WW) No callback define. Doing nothing.")
        })
        .on('changed', console.log)
        .on('error', console.error);
}

