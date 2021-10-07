async function errorHandler(error, request, response, next) {
    await response.status(error.statusCode)
        .json({
            failed: true,
            message: error.message,
            statusCode: error.statusCode,
            id: error.dataId
        });
}

module.exports = errorHandler;
