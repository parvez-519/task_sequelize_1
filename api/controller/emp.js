const appConst = require('../constants')
const empRepo = require('../entities/emp')
const books = require('../entities/books');
const db = require('../../db')
const redis = require("redis");
const { response } = require('express');
const redisClient = redis.createClient();
redisClient.connect();
//  redisClient.flushAll();

// ADD DATA
const addemp = async (req, res) => {
    try {

        const resp = await empRepo.create(req.body, {
            include: [
                {
                    model: books,
                },
            ],
        })

        console.log(resp["emp_id"])
        let id = resp["emp_id"];
        let recordKey = "employee:" + id + "#";
        await redisClient.set(recordKey, JSON.stringify(resp));

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
// UPDATE DATA
const updateemp = async (req, res) => {
    try {

        let resp;
        let keyPattern = "employee:" + req.params.emp_id + "#";
        const value = await redisClient.get(keyPattern)
        let result;
        resp = await empRepo.update(req.body, {
            where: {
                emp_id: req.params.emp_id
            }
        })
        let recordKey = "employee:" + req.params.emp_id + "#";
        await redisClient.del(recordKey);
        result = await redisClient.set(recordKey, JSON.stringify(resp));
        console.log(result)
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
// DELETE DATA
const deleteemp = async (req, res) => {
    try {
        const resp = await empRepo.destroy({
            where: {
                emp_id: req.params.emp_id
            }
        })
        let recordKey = "employee:" + req.params.emp_id + "#";
        let del = await redisClient.del(recordKey);

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
//DELETE ALL
const deleteaallemp = async (req, res) => {
    try {
        const resp = await empRepo.destroy({ where: {} })
        redisClient.flushAll();
        console.log(res)
        res.status(200).json({
            status: appConst.status.success,
            response: null,
            message: "successfull",
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}
// FIND DATA
const findemp = async (req, res) => {
    try {
        let resp;
        let keyPattern = "employee:" + req.params.emp_id + "#";
        const value = await redisClient.get(keyPattern)
        // await redisClient.flushAll();
        if (value) {
            console.log("Fetched from CACHE.");
            resp = JSON.parse(value)
        }
        else if (!resp) {
            console.log("Fetched from DB");
            resp = await empRepo.findOne({ where: { emp_id: req.params.emp_id } });
            let recordKey = "employee:" + req.params.emp_id + "#";
            await redisClient.set(recordKey, JSON.stringify(resp));
        }
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
const findemps = async (req, res) => {
    try {
        // await redisClient.flushAll();
        const cacheKey = `employee:` + '#';
        const values = await redisClient.get(cacheKey);
        let resp;
        if (values) {
            console.log("Fetched from CACHE.");
            resp = JSON.parse(values)
        }
        else if (!resp) {
            console.log("Fetched from DB.");
            resp = await empRepo.findAll();
            let recordKey = `employee:` + '#';
            await redisClient.set(recordKey, JSON.stringify(resp));

        }
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
// MULTI OPERATIONS IN SINGLE API
const multioperation = async (req, res) => {
    const trans = await db.transaction();
    try {
        //create
        await empRepo.create(req.body[0],
            {
                transaction: trans
            })
        //update
        await empRepo.update(req.body[1], {
            where: {
                emp_id: req.body[1].emp_id
            }
        })

        await trans.commit();

        res.status(200).json({
            status: appConst.status.success,
            response: null,
            message: "successfull",
        });
    }
    catch (err) {
        await trans.rollback();
        console.log(err)
        res.status(400).json({ status: appConst.status.fail, response: null, message: err.message })
    }
}



module.exports = { addemp, updateemp, deleteemp, findemp, findemps, multioperation, deleteaallemp }