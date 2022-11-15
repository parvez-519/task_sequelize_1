const appConst = require('../constants')
const deptRepo = require('../entities/dept');
const emp = require('../entities/emp');
const books = require('../entities/books');
const db = require('../../db');

// ADD ONE DATA
const addDept = async (req, res) => {
    try {
        const trans = await db.transaction();
        const resp = await deptRepo.create(req.body, {
            include: [
                {
                    model: emp,
                    include: [
                        {
                            model: books,
                        }
                    ]
                },
            ],
        },
            {
                transaction: trans
            })
        await trans.commit();

        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });
    }
    catch (err) {
        await trans.rollback();
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}
// ADD MULTI DATA
const bulkCreate = async (req, res) => {
    try {
        const trans = await db.transaction();
        const resp = await deptRepo.bulkCreate(req.body, {
            include: [
                {
                    model: emp,
                    include: [
                        {
                            model: books,
                        }
                    ]
                },
            ],
        },
            {
                transaction: trans
            })
        await trans.commit();

        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });
    }
    catch (err) {
        await trans.rollback();
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}
// DELETE ONE DATA
const deletedept = async (req, res) => {
    try {
        const resp = await deptRepo.destroy({
            where: {
                dept_id: req.params.dept_id
            }
        })
        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}
// FIND DATA
const findrecord = async (req, res) => {
    try {

        const resp = await deptRepo.findOne({
            where: {
                dept_id: req.params.dept_id
            },
            include: [
                {
                    model: emp,
                    include: [
                        {
                            model: books,
                        }
                    ]
                },
            ],
        })
        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}

// FIND ALL DATA
const findall = async (req, res) => {
    try {

        const resp = await deptRepo.findAndCountAll({
            include: [
                {
                    model: emp,
                    include: [
                        {
                            model: books,
                        }
                    ]
                },
            ],
            limit: 4,
            offset: 0,
        })
        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}
// UPDATE DATA--RELATIONS
const updateone = async (req, res) => {
    try {
        const resp = await deptRepo.update(req.body, {  
            where: {
                dept_id: req.params.dept_id
            }
        })
        //  await emp.update(req.body, {  
        //     where: {
        //         dept_id: req.params.dept_id
        //     }
        // })
        //  await books.update(req.body, {  
        //     where: {
        //         emp_id: req.params.dept_id
        //     }
        // })
        res.status(200).json({
            status: appConst.status.success,
            response: resp,
            message: "successfull",
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}

// const multioperation = async (req, res) => {
//     try {
//         const trans = await db.transaction();
//         //create
//         await deptRepo.create(req.body[0], {
//             include: [
//                 {
//                     model: emp,
//                     include: [
//                         {
//                             model: books,
//                         }
//                     ]
//                 },
//             ],
//         },
//         {
//             transaction: trans
//         })
//         //update
//         await deptRepo.update(req.body, {  
//             where: {
//                 dept_id: req.body[1].dept_id
//             }
//         })

//         await trans.commit();

//         res.status(200).json({
//             status: appConst.status.success,
//             response: resp,
//             message: "successfull",
//         });
//     }
//     catch (err) {
//         await trans.rollback();
//         console.log(err)
//         res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
//     }
// }

module.exports = { addDept, deletedept, findrecord, bulkCreate, findall, updateone }