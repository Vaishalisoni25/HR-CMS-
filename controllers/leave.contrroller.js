const leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const Attendance = require("../models/attendance.model");
const { ROLES } = require("../config/constant");

const countDaysInclusive = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);

s.setHours(0, 0, 0, 0);
e.setHours(0, 0, 0, 0);
const diffMs = e - s;
return Math.floor(diffMs / (24*60*60*1000)) + 1;

};

//create leave (emp)

exports.applyLeave = async (req,  res)  => {
  // expect Zod validation data in req.body

  try{
    const {leaveType, fromDate, toDate, reason } = req.body;
    const employeeId = req.user.id;
    // basic checks 
    const from = new Date (fromDate);
    const to =new Date (toDate);
    if ( to < from ) return res.status(400).json({ msg:"toDate must be >= fromDate"})
  
  //checkoverlap with existing approved leaves
  const overlapping = await Leave.findOne({
    employeeId,
    status:"APPROVED",
    $or:[
      {fromDate:{$Ite:to}, toDate:{$gte: from}}     //any overlap
    ],
  });

  if(overlapping){
    return res.status(400).json({msg: "Overlapping approved leave exists"});
  }

  const totalDays = countDaysInclusive(from, to);

  const leave = new Leave ({
    employeeId,
    leaveType,
    fromDate:from,
    toDate: to,
    totalDays,
    reason,
    status:"PENDING",
  });
   await leave.save();
   return res.status(201).json({msg:"Leave applied",leave});
  
    } catch(err){
     return res.status(500).json({msg:"Server error",error:err.message})
    }
};
//get leaves( employee=> own,hr/superAdmin => all or filtered)

exports.getLeaves = async (req, res) =>{
  try{
     const user = req.user;
     let filter={};

     //if emp only their leaves
     if(user.role  ! == ROLES.SUPERADMIN && user.role !==ROLES.HR){
      filter.employeeId = user.id;

     }else{
      // for hr , you might want to filter by compare/department 
      //example : filter.compareCode = user.compareCode(if present)
     // for now ,hr & superA seeee all
     }
const leaves = await Leave.find(filter).populate("employeeId", "name", "email");
    return res.json(leaves);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//aprrrove or reject Leave
exports.handleApproval = async (req, res) =>{
  try {
    const user = res.user;
    if(![ROLES.HR, ROLES.SUPERADMIN].includes(user.role)){
      return res.status(403).json({msg:"Access Denied"})
    }

    const leaveId = req.params.id;
    const{ status } = req.body;        //should ne approved or rejected
 
    const leave = await leave.findById(leaveId);
    if(!leave)return res.status(404).json({msg:"Leave not found "})

      if(leave.status ! == "PENDING"){
         return res.status(400).json({msg: "Only pending leaves can be aprproved/rejected"})
         
      }
       //if rejecting:
          if(status === "REJECTED"){
          leave.status = "REJECTED";
          leave.approvedBy = user.id;
          await leave.save();
          return res.json({msg: "Leave rejected", leave });
          }

      //if approving 
      if(status ==="APPROVED")
         {
          //Deduct leave balance if required and calculate pay roll  deduction  for  LWP

          const employee  = await Employee.findById(leave.employeeId);
          if(!employee) return res.status(404).json ({ msg: "Emplyoyee not found "})

            //NOTE = Leave balance  logic required hare we have mark and optionaly calculate 
            
            //if leave .leave.leave Type == 'lwp

             let deduction    = 0;

             if(leave.laveType == "LWP"){

              // use employee .basic salary or emp .salary - ensure field exis

              // const salary = employee.basicSalary || employee.salary || 0;

              //  const perDay = salary ? salary / 30 : 0;

              //  deduction = perDay  * leave.totalDays ;

             }
           //update leave status  and payyroll deduction 

            leave.status = "APPROVED";
            leave.aprrovedBy = user.id;
            leave.payrollDeduction = deduction;

            await leave.save();
            
//attendance intigartion logic 

          const dayCount = leave.totalDays;
          for(let i=0; i < dayCount ; i++){
            const d = new Date(leave.fromDate);
            d.setDate (d.getDate() + i);

             d.setHours(0, 0, 0, 0);
             //find and Create attendance for that date 
             const dateStart = d;
             const  dateEnd = new Date(d);
             dateEnd.setHours(23, 59, 59, 999);

             let attendance = await Attendance.findOne({
              employeeId: leave.employee,
              date:{
                $gte: dateStart,
                $lte: dateEnd,
              },
             });
             const newStatus = leave.leaveType === "LWP"? "LWP": "leave";

             if(attendance){
              //overwrite status a leave /LWP
              attendance.status = newStatus;
              //optionally store leaveType 
              attendance.leaveType = leave.leaveType;
              await attendance.save();

             }
             else {
              // Create attendance entry

              await Attendance.create({
                employeeId: leave.employeeId,
                date: d,
                status:newStatus,
                leaveType: leave.leaveType,
              });
             }

          }
          return res.json({msg: "Leave approved", leave});

         }
         return res.status(400).json({msg:"Invalid status"});

  }catch(err){
    console.error(err);
    return res.status(500).json({ msg:"Server error",error:err.message})
  }
}

