const db = require("../model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const Task = db.Task;

module.exports = {
  signup: async (req, res) => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hash1 = await bcryptjs.hash("123", 12);
      const hash2 = await bcryptjs.hash("1234", 12);
      const users = [
        {
          name: "nithin",
          email: "n@gmail.com",
          password: hash1,
        },
        {
          name: "joseph",
          email: "j@gmail.com",
          password: hash2,
        },
      ];
     
      users.forEach(async (item) => {
        await db.User.create({
          name: item.name,
          email: item.email,
          password: item.password,
        });
      });
    
      return res.status(200).json({ message: "user registration successfull" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  login: async (req, res) => {
   
    try {
      const data = await db.User.findOne({ where: { email: req.body.email } });
    
      if (data) {
        bcryptjs.compare(req.body.password, data.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: data.email,
                id: data.user_id,
              },
              "secret" //process.env.SECRET
            );
            
            res.status(200).json({
              success: true,
              message: "authentication successfull",
              token: token,
            });
          } else {
            res.status(400).json({
              success: false,
              message: "invalid credentials",
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: "No User Found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },

  craete_task: async (req, res) => {
    try {
      const status = ["pending", "in_progress", "completed"];
      if (req.body.ChildTaskParent !== 0) {
        let isParentTaskExist = await db.Task.findOne({
          Task_id: req.body.ChildTaskParent,
        });

        let newChildTask;
        if (isParentTaskExist) {
          let { status } = isParentTaskExist;
          if (status == "pending") {
            return res.status(400).json({
              success: false,
              message:
                "we cant create child task because parent is in pending status",
            });
          }
          
          newChildTask = {
            Task_id: req.body.Task_id,
            Taskname: req.body.Taskname,
            user_id: req.user._id,
            status: req.body.status,
            Task_completed_time: moment(),
            ChildTaskParent: req.body.ChildTaskParent
              ? req.body.ChildTaskParent
              : 0,
          };

          const result = await db.Task.create(newChildTask);
        } /*else {
          return res.status(400).json({
            success: false,
            message: "invalid parentTask id",
          });
        }*/
      } else {
        const newTask = {
          Task_id: req.body.Task_id,
          Taskname: req.body.Taskname,
          user_id: req.body.user_id,
          status: status[0],
          Task_completed_time: moment(),
          ChildTaskParent: req.body.ChildTaskParent
            ? req.body.ChildTaskParent
            : 0,
        };
        const result = await db.Task.create(newTask);
      }

      return res.status(200).json({
        success: true,
        message: "user tassk created Successfully",
      });
    } catch (error) {
      
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  getChildTask: async (req, res) => {
    try {
      let { Task_id } = req.body;
      let result = await db.Task.find({ ChildTaskParent: Task_id });
      let parentTask=await db.Task.findOne({Task_id:Task_id})
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          message: {parentTask,childTask:result},
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "their is no child task with this task Id",
        });
      }
    } catch (error) {
      
    }
  },
  task_remove: async (req, res) => {
    try {
      let { Task_id } = req.body;
      let a = [req.body.Task_id];
      
      const childTask = () => {};
      let data = await db.Task.find({ ChildTaskParent: Task_id });
      if (data) {
        data.map((item) => a.push(item.Task_id));
      } else {
      }

      let arraylength = a.length;
      let j = 0;
      let p = 1;
      do {
        let data = await db.Task.find({ ChildTaskParent: a[j] });

        if (data) {
          data.map((item) => a.push(item.Task_id));
        }
        if (a[a.length - 1] === a[j]) {
          p = 0;
        }
        j++;
      } while (p > 0);

      let statusArray = [];
      let s = await db.Task.find({ Task_id: { $in: a } });
      let x = 0;
      let itsChildTaskisNotInCompletedState = false;
      let Task_Status;
      if (s.length === 1) {
        let { status } = s[0];
        itsChildTaskisNotInCompletedState = false;
      } else {
        while (x < s.length) {
          let { status } = s[x];
          console.log("sta",status)
          if (status === "in_progress") {
            itsChildTaskisNotInCompletedState = true;
          }
          x++;
        }
      }

      let remove;

      if (itsChildTaskisNotInCompletedState === false) {
        for (let i = 0; i < a.length; i++) {
          remove = await db.Task.deleteOne({ Task_id: a[i] });
        }
      } else {
        return res.status(400).json({
          success: true,
          message:
            "sorry we cant delete the task because its child task is not in completed status",
        });
      }

      if (remove) {
        return res.status(200).json({
          success: true,
          message: "sucessfully deleted the task and its All child task",
        });
      }
    } catch (error) {}
  },
  task_update: async (req, res) => {
    let { Task_id, status } = req.body;
    let update = await db.Task.findOneAndUpdate(
      { Task_id: Task_id },
      { status: status, user_id: req.user._id, Task_completed_time:moment(new Date()).format("YYYY-MM-DD")}
    );
    if(status==='completed'){
      let {createdAt}=update;
      let taskworkingtime=createdAt.getTime()-new Date().getTime()
      console.log(taskworkingtime)
    }
    if (update) {
      return res.status(200).json({
        success: true,
        message: "sucessfully Updated the Task Status",
      });
    }
  },
};
