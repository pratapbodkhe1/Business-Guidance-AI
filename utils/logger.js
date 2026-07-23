function logInfo(message) {
    console.log(`[INFO] ${new Date().toISOString()} : ${message}`);
}

function logError(error) {
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(error);
}

module.exports = {
    logInfo,
    logError
};