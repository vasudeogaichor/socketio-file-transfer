function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({success: false, message:'Something went wrong', error: err });
    next();
}

module.exports = errorHandler;
