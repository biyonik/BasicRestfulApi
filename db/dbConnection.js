const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const uri = 'mongodb://localhost/restapiproject';
mongoose.connect(uri, options)
    .then(_ => console.log("Veritabanı bağlantısı yapıldı"))
    .catch((err) => {throw err;});

