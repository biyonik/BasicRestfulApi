const createError = require("http-errors");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

const getAllUsers = async function (request, response, next) {
    try {
        const allUsers = await UserModel.find({}, {password: 0});
        return await response.json({
            data: allUsers
        });
    } catch (err) {
        next(createError(404, err));
    }
};

const getMe = async function (request ,response, next) {
    return response.status(200).json(request.user);
};

const getById = async function (request, response, next) {
    const id = request.params.id;
    const password_show = Number(request.query.password_show) || 0;
    try {
        const user = await UserModel.findById(id);
        if (user) {
            return await response.status(200).json({
                data: user
            });
        } else {
            throw createError(404, 'Bu id değerine denk bir kullanıcı bulunamadı');
        }
    } catch (err) {
        next(createError(404, err));
    }

};

const add = async function (request, response, next) {
    try {
        const addedUser = new UserModel(request.body);
        addedUser.password = await bcrypt.hash(addedUser.password, 10);
        const {error, value} = addedUser.joiValidation(request.body);

        if (error) {
            next(createError(400, error));
        } else {
            const addedResult = await addedUser.save();
            await response.status(201).json({
                message: 'Kullanıcı ekleme işlemi başarılı',
                statusCode: 201,
                data: addedResult
            });
        }
    } catch (err) {
        next(createError(404, err));
    }
};

const login = async function(request, response, next) {
    try {
        const user = await UserModel.login(request.body.email, request.body.password);
        const token = await user.generateToken();
        response.status(200)
            .json({
                data:user,
                token: token
            });
    } catch (err) {
        next(createError(404, err));
    }
};

const updateMe = async function (request ,response, next) {
    const id = request.user._id;
    const updatedUser = new UserModel(request.body);
    if(request.body.hasOwnProperty('password')) {
        request.body.password = await bcrypt.hash(request.body.password, 10);
    }
    const {error, value} = UserModel.joiValidationForUpdate(request.body);
    if (error) {
        next(createError(400, error));
    } else {
        try {
            const result = await UserModel.findByIdAndUpdate({_id: id}, request.body, {new: true, runValidators: true});
            if (result) {
                return await response.status(200).json({
                    message: `${id} id'li kullanıcının verileri güncellendi`,
                    id: id,
                    data: updatedUser
                });
            } else {
                throw createError(404, 'Bu id değerine denk bir kullanıcı bulunamadı', {dataId: id});
            }
        } catch (err) {
            next(createError(404, err));
        }
    }
};

const update = async function (request, response, next) {
    const id = request.params.id;
    const updatedUser = new UserModel(request.body);
    if(request.body.hasOwnProperty('password')) {
        request.body.password = await bcrypt.hash(request.body.password, 10);
    }
    const {error, value} = UserModel.joiValidationForUpdate(request.body);
    if (error) {
        next(createError(400, error));
    } else {
        try {
            const result = await UserModel.findByIdAndUpdate({_id: id}, request.body, {new: true, runValidators: true});
            if (result) {
                return await response.status(200).json({
                    message: `${id} id'li kullanıcının verileri güncellendi`,
                    id: id,
                    data: updatedUser
                });
            } else {
                throw createError(404, 'Bu id değerine denk bir kullanıcı bulunamadı', {dataId: id});
            }
        } catch (err) {
            next(createError(404, err));
        }
    }
};

const deleteAllUsers = async function (request, response, next) {
    try {
        const result = await UserModel.deleteMany({isAdmin: false});
        if (result) {
            return await response.status(200).json({
                message: `Tüm kullanıcılar silindi`,
                data: result
            });
        } else {
            throw createError(404, 'Silme işlemi tamamlanamadı!');
        }
    } catch (err) {
        next(createError(400, err));
    }
};

const deleteById = async function (request, response, next) {
    const id = request.params.id;
    try {
        const result = await UserModel.findByIdAndDelete({_id: id});
        if (result) {
            return await response.status(200).json({
                message: `${id} id'li kullanıcı silindi`,
                id: id,
                data: result
            });
        } else {
            throw createError(404, 'Bu id değerine denk bir kullanıcı bulunamadı', {dataId: id});
        }
    } catch (err) {
        next(createError(400, err));
    }
};

module.exports = {
    getAllUsers: getAllUsers,
    getById: getById,
    getMe: getMe,
    add: add,
    login: login,
    updateMe: updateMe,
    update: update,
    deleteAllUsers: deleteAllUsers,
    deleteById: deleteById
}
