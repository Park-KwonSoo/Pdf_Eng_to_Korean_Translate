const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const api = require('./src/api')

require('dotenv').config();

app.use(bodyparser());
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(PORT, "is connected");
})