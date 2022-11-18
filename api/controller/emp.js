const appConst = require('../constants')
const empRepo = require('../entities/emp')
const books = require('../entities/books');
const db = require('../../db')
const redis = require("redis");

// const ioredis = require("ioredis");
// const scan=ioredis()

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
        let recordKey = "EMPLOYEE#" + id + "#";
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
        let keyPattern = "EMPLOYEE#" + req.params.emp_id + "#";
        const value = await redisClient.get(keyPattern)
        let result;
        resp = await empRepo.update(req.body, {
            where: {
                emp_id: req.params.emp_id
            }
        })
        let recordKey = "EMPLOYEE#" + req.params.emp_id + "#";
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
        let recordKey = "EMPLOYEE#" + req.params.emp_id + "#";
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
        let keyPattern = await redisClient.keys("*"+"emp_id:"+ req.params.emp_id + "*");
        console.log("---key-----> ", keyPattern)

        const value = await redisClient.get(keyPattern[0])
        console.log("---key-----222> ", keyPattern)
        if (value) {
            console.log("Fetched from CACHE.");
            resp = JSON.parse(value)
        }
        else if (!resp) {
            console.log("Fetched from DB");
            resp = await empRepo.findOne({ where: { emp_id: req.params.emp_id } });
            let recordKey = await fetchRecords(resp)
            console.log(recordKey)
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
        //await redisClient.flushAll();
        let resp = []
        let temp;
        const page = Number(req.body.page);
        const size = Number(req.body.size);
        let matchedkey;
        let key = await redisClient.keys('*')

        if ((req.body.page || req.body.page === 0) && req.body.size) {
            if (req.body.where) {
                temp = await getDetail(req.body.where)
                console.log("if req.body----", req.body.where)
                console.log("----temp---", temp)
                matchedkey = await redisClient.keys('*#' + temp + '*')
                resp = await fetchRecords(matchedkey)
                console.log(resp)
            }
            else {
                console.log("req.body------", req.body)
                matchedkey = await redisClient.keys('*')
                console.log("---keys-->>>--", matchedkey)
                resp = await fetchRecords(matchedkey)
                resp = resp.slice((page - 1) * size, size)

                console.log(" if cache------", resp)
            }
        }
        else if (key.length > 0) {
            if (req.body.where) {
                temp = await getDetail(req.body.where)
                console.log("if req.body----", req.body.where)
                console.log("----temp---", temp)
                matchedkey = await redisClient.keys('*#' + temp + '*')
                resp = await fetchRecords(matchedkey)
                console.log(resp)
            }
            else {
                console.log("req.body------", req.body)
                matchedkey = await redisClient.keys('*')
                console.log("---keys-->>>--", matchedkey)
                resp = await fetchRecords(matchedkey)
                console.log("else if cache------", resp)
            }
        }

        // else if (key.length < 1) {
        //     console.log("inside DB.");
        //     if (req.body.where) {
        //         console.log("Fetched from DB.(WHERE)");
        //         resp = await empRepo.findAll({
        //             where: req.body.where,
        //             offset: req.body.offset,
        //             limit: req.body.limit
        //         });
        //         for (let obj of resp) {
        //             const keys = createKey(obj);
        //             await redisClient.set(keys, JSON.stringify(obj));
        //             console.log(keys);
        //             console.log("-------3");
        //         }
        //     }
        //     else {
        //         console.log("Fetched from DB. (ALL)");
        //         // let allData=await empRepo.findAll();
        //         resp = await empRepo.findAll({
        //             offset: req.body.offset,
        //             limit: req.body.limit,
        //             order: [
        //                 ['emp_id', 'ASC']
        //             ]
        //         });
        //         for (let obj of resp) {
        //             const keys = createKey(obj);
        //             await redisClient.set(keys, JSON.stringify(obj));
        //             console.log(keys);
        //             console.log("-------3");
        //         }
        //     }
        // }
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

async function createKey(data) {
    let commonKeys = "EMPLOYEE#";
    // console.log("----inside------")
    if (data.emp_id) {
        commonKeys += 'emp_id:' + data.emp_id + "#";
    }
    if (data.name) {
        commonKeys += 'name:' + data.name + "#";
    }
    if (data.lastname) {
        commonKeys += 'lastname:' + data.lastname + "#";
    }
    if (data.age) {
        commonKeys += 'age:' + data.age + "#";
    }
    //  console.log(commonKeys)
    return commonKeys;
}
async function getDetail(data) {
    let searchKey;
    // console.log("----inside------")
    if (data.emp_id) {
        searchKey = 'emp_id:' + data.emp_id;
    }
    if (data.name) {
        searchKey = 'name:' + data.name;
    }
    if (data.lastname) {
        searchKey = 'lastname:' + data.lastname;
    }
    if (data.age) {
        searchKey = 'age:' + data.age;
    }
    // console.log(searchKey)
    return searchKey;
}

async function fetchRecords(key) {
    let array = []
    if (key && key.length > 0) {
        console.log("----inside if cache---")
        for (let obj of key) {
            console.log(obj)
            const values = await redisClient.get(obj)
            if (values) {
                console.log("Fetched from CACHE.");
                array.push(JSON.parse(values));
            }
        }
    }
    // console.log("----array-------> ", array)
    return array
}

async function cacheStart() {
    try {
        if (redisClient) {
            await redisClient.flushAll();
            const records = await empRepo.findAll();
            if (records && records.length > 0) {
                for (const record of records) {
                    const key = await createKey(record)
                    await redisClient.set(key, JSON.stringify(record))
                }
            } else {
                console.log("No Records found.");
            }
        } else {
            let msg = "Connection to Cache failed.";
            console.log(msg);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { addemp, updateemp, deleteemp, findemp, findemps, multioperation, deleteaallemp, cacheStart }