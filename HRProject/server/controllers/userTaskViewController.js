const UserTaskViewRepository = require("../repositories/userTaskViewRepository");

class UserTaskViewController {
  async getAllUserTaskView(req, res) {
    try {
      const userTasks = await UserTaskViewRepository.getAllUserTasks();
      res.status(200).json(userTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
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
  //   }
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
    }
  }

  //v_user_parent_task
  async getAllUserParentTaskView(req, res) {
    try {
      const parentTasks = await UserTaskViewRepository.getAllUserParentTask();
      res.status(200).json(parentTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching parentTasks" });
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
    }
  }

  //v_user_child_task
  async getAllUserChildTaskView(req, res) {
    try {
      const childTasks = await UserTaskViewRepository.getAllUserChildTask();
      res.status(200).json(childTasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching childTasks" });
    }
  }


   async getUserChildTaskViewByTaskId(req, res) {//parent id
      try {
        const childTasks =
          await UserTaskViewRepository.getUserChildTaskByTaskId(
            req.params.id
          );
        if (!childTasks) {
          return res.status(404).json({ message: "UserEmployee not found" });
        }
   
        res.status(200).json(childTasks);
      } catch (error) {
        res.status(500).json({ error: "Error fetching userEmp" });
      }
    }
  
}

// Export an instance of the class
module.exports = new UserTaskViewController();
