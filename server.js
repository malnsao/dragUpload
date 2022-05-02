let Koa = require('koa')
let koaStatic = require('koa-static')
let koaBody = require('koa-body')
let path = require('path')
let fs = require('fs')
let app = new Koa()

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type,Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    if (ctx.method === 'OPTIONS') {
        ctx.body = 200
    } else {
        await next()
    }
})
app.use(koaBody({
    formidable: { uploadDir: path.resolve(__dirname, 'uploads') },
    multipart: true
}))
app.use(koaStatic(path.resolve(__dirname, 'uploads')))
app.use(async (ctx, next) => {
    if (ctx.url === '/upload') {
        let file = ctx.request.files.file
        let fileName = path.basename(file.filepath) + path.extname(file.originalFilename)
        fs.renameSync(file.filepath, path.join(path.dirname(file.filepath), fileName))
        ctx.body = {
            url: `http://localhost:9999/${fileName}`
        }
    } else {
        await next()
    }
})

app.listen(9999, () => {
    console.log('服务器9999启动')
})