const UserTaskViewRepository = require("../repositories/userTaskViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserTaskViewController {
  async getAllUserTaskView(req, res) {
    try {
      const userTasks = await UserTaskViewRepository.getAllUserTasks();
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  async getUserTaskViewByUserId(req, res) {
    try {
      const userTasks = await UserTaskViewRepository.getUserTaskByUserId(
        req.params.userid
      );
      if (!userTasks) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  // async getUserTaskViewByUserId(req, res) {
  //   try {
  //     const userTasks = await UserTaskViewRepository.getUserTaskByUserId(
  //       req.params.id
  //     );
  //     if (!userTasks) {
  //       return res.status(404).json({ message: "UserTask not found" });
  //     }
  //     res.status(200).json(userTasks);
  //   } catch (error) {
  //     res.status(500).json({ error: "Error fetching userTasks" });
  //    logger.error(error.message);//
  // }
  // }

  async getUserTaskViewByHeadId(req, res) {
    try {
      const userTasks = await UserTaskViewRepository.getUserTaskByHeadId(
        req.params.id
      );
      if (!userTasks) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  async getUserTaskViewByLineId(req, res) {
    try {
      const userTasks = await UserTaskViewRepository.getUserTaskByLineId(
        req.params.id
      );
      if (!userTasks) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  async getUserTaskViewByCondition(req, res) {
    try {
      const { taskName, userName, taskGroupId, userId } = req.query;
      const userTasks =
        await UserTaskViewRepository.getUserParentTaskByCondition(
          taskName,
          userName,
          taskGroupId,
          userId
        );
      if (!userTasks) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  //v_user_parent_task
  async getAllUserParentTaskView(req, res) {
    try {
      const parentTasks = await UserTaskViewRepository.getAllUserParentTask();
      res.status(200).json(parentTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching parentTasks" });
      logger.error(error.message);
    }
  }

  async getUserParendTaskViewByUserId(req, res) {
    try {
      const parentTasks =
        await UserTaskViewRepository.getUserParentTaskByUserId(req.params.id);
      if (!parentTasks) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(parentTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching parentTasks" });
      logger.error(error.message);
    }
  }

  //v_user_child_task
  async getAllUserChildTaskView(req, res) {
    try {
      const childTasks = await UserTaskViewRepository.getAllUserChildTask();
      res.status(200).json(childTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching childTasks" });
      logger.error(error.message);
    }
  }

  async getUserChildTaskViewByTaskId(req, res) {
    //parent id
    try {
      const childTasks = await UserTaskViewRepository.getUserChildTaskByTaskId(
        req.params.id
      );
      if (!childTasks) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }

      res.status(200).json(childTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
      logger.error(error.message);
    }
  }
}

// Export an instance of the class
module.exports = new UserTaskViewController();
