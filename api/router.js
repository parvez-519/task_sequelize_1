
const emp=require('./controller/emp')
const dept=require('./controller/dept')

const router = require("express").Router();


//CRUD OPERATIONS USING EMP
router.post("/addemp", emp.addemp);
router.put("/updateemp/:emp_id", emp.updateemp);
router.delete("/deleteemp/:emp_id", emp.deleteemp);
router.get("/findemp/:emp_id", emp.findemp);
router.get("/findemps", emp.findemps);
router.post("/multi",emp.multioperation)
router.delete("deleteall",emp.deleteaallemp)
//RELATIONS USING DEPT
router.put("/adddept", dept.addDept);
router.post("/addbulk", dept.bulkCreate);
router.delete("/deletedept/:dept_id", dept.deletedept);
router.get("/findrecord/:dept_id", dept.findrecord);
router.get("/findall", dept.findall);
router.put("/updateone/:dept_id", dept.updateone);


module.exports=router