
const admin = function (request, response, next) {
    if(request.user[0].isAdmin !== true) {
        return response.status(403).json({
            message: 'Erişim engellendi! Kullanıcının bu isteği yapma yetkisi yok.'
        });
    }
    next();
}

module.exports = admin;
