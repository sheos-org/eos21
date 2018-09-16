class WarmHole {
    constructor(blackHoleInstance) {
        // console.log("Hello World!");


        // console.log(blackHoleInstance.events);

        // create the event

        blackHoleInstance.events.TeleportToAccount({
            fromBlock: 0
        }, function (error, event) { console.log(event); })
            .on('data', function (event) {
                console.log(event); // same results as the optional callback above
            })
            .on('changed', function (event) {
                // remove event from local database
            })
            .on('error', console.error);
    }
}

module.exports = WarmHole;
