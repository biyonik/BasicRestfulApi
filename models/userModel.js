const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const createError = require("http-errors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'BBf1I488IFlDO46qiulhb0y2s9uQ1aYYcuGoB99EAQ5tenNagg2i8';

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 64
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        min: 6,
        max: 64
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Lütfen geçerli bir e-posta adresi giriniz'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir e-posta adresi giriniz']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 8,
        max: 16
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'user',
    timestamps: true
});

const schema = Joi.object({
    fullname: Joi.string()
        .min(3)
        .max(64)
        .trim(),

    username: Joi.string()
        .min(6)
        .max(64)
        .trim(),

    email: Joi.string()
        .email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}})
        .trim(),

    password: Joi.string()
        .min(8)
        .max(16)
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'))
        .trim(),

    isAdmin: Joi.boolean()
});
/**
 * Yeni bir kullanıcı validasyonu için kullanılır
 * @param userObject
 * @returns {Joi.ValidationResult}
 */
UserSchema.methods.joiValidation = function (userObject) {
    schema.required();
    return schema.validate(userObject);
};

UserSchema.methods.generateToken = async function() {
    const loggedInUser = this;
    return await jwt.sign({_id: loggedInUser._id}, secretKey, {expiresIn: '1h'});
}

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.__v;
    return user;
}

/**
 * Bir kullanıcıyı güncellerken bu validasyon kullanılır
 * @param userObject
 * @returns {Joi.ValidationResult}
 */
UserSchema.statics.joiValidationForUpdate = function (userObject) {
    return schema.validate(userObject);
};

/**
 *
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
UserSchema.statics.login = async function (email, password) {
    const {error, value} = schema.validate({email, password});
    if (error) {
        throw createError(400, error);
    }
    const user = await UserModel.findOne({email});
    if (!user) {
        throw createError(400, 'Bu e-posta adresine tanımlı bir kullanıcı bulunamadı!', {email: email});
    }
    const passwordControl = await bcrypt.compareSync(password, user.password);
    if (!passwordControl) {
        throw createError(400, 'Girilen e-posta veya şifre hatalı!');
    }
    return user;
}

const UserModel = mongoose.model('User', UserSchema);


module.exports = UserModel;
