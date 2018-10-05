module.exports = (params) => {
    const { blackHole, onData } = params;

    blackHole.events.Teleport({
         fromBlock: 0
    })
        .on('data', event => {
            const { note, amount } = event.returnValues;

            console.log("(II) blackHole event (account=" + note + ", amount=" + amount + ")");

            if (onData) {
                onData(event);
            }
            else
                console.log("(WW) No callback define. Doing nothing.")
        })
        .on('changed', console.log)
        .on('error', console.error);
}

