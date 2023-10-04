const siteRouter = require('./site')
const loginRouter = require('./login')
const filesRouter = require('./files')
const foldersRouter = require('./folders')
const usersRouter = require('./users')

const registerRouter = require('./register')
 
function route(app){
    app.use('./users',usersRouter)
    app.use('/files', filesRouter)
    app.use('/folders', foldersRouter)
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/', siteRouter)
}

module.exports = route