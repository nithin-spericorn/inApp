const express = require("express");
const router = express.Router();
const {
  craete_task,
  getChildTask,
  task_remove,
  task_update,
  signup,
  login,
} = require("../controller/TaskController");
const { checkToken } = require("../middleware/check");

router.get("/", async (req, res) => {
 
  return res.status(200).json({
    success: true,
    message: "Welcome testing",
  });
});
router.post("/create_task", checkToken, craete_task);

router.post("/getChildTask", checkToken, getChildTask);

router.delete("/delete", checkToken, task_remove);

router.put("/update", checkToken, task_update);

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
