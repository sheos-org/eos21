module.exports = (params) => {
    const { blackHole, onData } = params;

    blackHole.events.Teleport({
         fromBlock: 0
    })
        .on('data', event => {
            if (onData) {
                onData(event);
            }
            else
                console.log("(II) blackHole event " + event.returnValues);
        })
        .on('changed', console.log)
        .on('error', console.error);
}

