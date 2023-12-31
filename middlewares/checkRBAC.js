const User = require('../models/Users')
const Share = require('../models/Share')
const File = require('../models/Files')
const Folder = require('../models/Folders')
module.exports = function checkRBAC(req, res, next) {
    let license
    let curUser
    let url = req.originalUrl.slice(1).split('/')
    User.findOne({ username: req.data.username })
        .then(user => {
            curUser = user
            if (req.params.id == null) next()
            if (url.includes('files')) return File.findOne({ _id: req.params.id })
            else return Folder.findOne({ _id: req.params.id })
        })
        .then(async document => {
            if (document.owner === curUser.username) license = true
            else if (url[0] === 'share') {
                const shares = await Share.find(
                    {
                        shared_object: { $in: ['general', curUser._id, curUser.department] },
                        document_id: document._id
                    }
                )
                for (const share of shares) {
                    if (url[2] !== 'action') {
                        if (share.permissions.includes('preview')) {
                            license = true;
                            break;
                        }
                    }
                    else {
                        if (share.permissions.includes(url[3])) {
                            license = true;
                            break;
                        }
                    }
                }
            }
            else {
                switch (curUser.role) {
                    case 'employee':
                        license = false
                        break
                    case 'manager':
                        await User.find({ department: curUser.department, role: 'employee' })
                            .then(employees => {
                                license = employees.some(employee => employee.username === document.owner) && url[1] === 'staff'
                            })
                        req.data.flag = 'manager-employee'
                        break
                    case 'user':
                        license = false
                        break
                    case 'admin':
                        license = false
                        break
                }
            }
            if (license == true) {
                next()
            }
            else res.json({ message: 'Bạn không có quyền truy cập vào trang này' })
        })
        .catch(err => console.error(err))
}