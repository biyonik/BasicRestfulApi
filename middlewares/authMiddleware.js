const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const createError = require("http-errors");
const secretKey = 'BBf1I488IFlDO46qiulhb0y2s9uQ1aYYcuGoB99EAQ5tenNagg2i8';
const auth = async function(request, response, next) {
    try {
        const token = await request.header('Authorization').replace('Bearer ', '');
        const result = await jwt.verify(token, secretKey);
        const user = await  UserModel.find({_id: result._id});
        request.user = user;
        next();
    } catch (err) {
        next(createError(400, err));
    }

}

module.exports = auth;
