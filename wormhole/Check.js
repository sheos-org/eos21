function check(condition, msg) {
    if (condition)
        console.log("(II) " + msg);
    else {
        console.error("(EE) " + msg);
        process.exit();
    }
}

module.exports = check;