const express = require('express');
require('./db/dbConnection');

const errorMiddleware = require('./middlewares/errorMiddleware');
// Routes
const UserRouter = require('./route/user/userRouter');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/users', UserRouter);

app.get('/', (request, response) => {
    response.status(200).json({
        'message': 'RestfulApi Project çalışıyor...'
    });
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Sunucu, ${port} portundan dinleniyor`);
});
