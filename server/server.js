const express = require("express");
const coookie = require("cookie-parser");
const {
  logMiddleware,
  errorLogger,
} = require("./middlewares/loggerMiddleware");

require("dotenv").config();

const path = require("path");
const app = express();
const db = require("./config/database");
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public"))); // ✅ Serves files inside `public/`
app.use(express.urlencoded({ extended: true }));
app.use(coookie());
app.use(logMiddleware); // Logs incoming requests

// Routes
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);
//api

const employeeRoutes = require("./routes/employeeRoutes");
const accessProvisioningRoutes = require("./routes/accessProvisioningRoutes");
const childTaskRoutes = require("./routes/childTaskRoutes");
const documentRoutes = require("./routes/documentRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const eqptOccupiedHisRoutes = require("./routes/eqptOccupiedHisRoutes");
const objectTypeRoutes = require("./routes/objectTypeRoutes");
const parentTaskRoutes = require("./routes/parentTaskRoutes");
const trainingModuleRoutes = require("./routes/trainingModuleRoutes");
const userModuleRoutes = require("./routes/userRoutes");
const formDesignRoutes = require("./routes/formDesignRoutes");
const relUserParentTaskRoutes = require("./routes/relUserParentTaskRoutes");
const relUserChildTaskRoutes = require("./routes/relUserChildTaskRoutes");
const relUserFormRoutes = require("./routes/relUserFormRoutes");
const relUserAccessRoutes = require("./routes/relUserAccessRoutes");
const ticketRoutes = require("./routes/ticketsRoutes");
const relUserHandoverRoutes = require("./routes/relUserHandoverRoutes");
const UserPaymentRoutes = require('./routes/userPaymentRoutes');

const userTaskViewRoutes = require("./routes/userTaskViewRoutes");
const userEmployeeViewRoutes = require("./routes/userEmployeeViewRoutes");
const employeeViewRoutes = require("./routes/employeeViewRoutes");
const childTaskViewRoutes = require("./routes/childTaskViewRoutes");
const equipmentViewRoutes = require("./routes/equiptmentViewRoutes");
const userFormViewRoutes = require("./routes/userFormViewRoutes");
const formDesignViewRoutes = require("./routes/formDesignViewRoutes");
const accessProvisioningViewRoutes = require("./routes/accessProvisioningViewRoutes");
const userAccesssViewRoutes = require("./routes/userAccessViewRoutes");
 

app.use("/api", employeeRoutes);
app.use("/api", accessProvisioningRoutes);
app.use("/api", childTaskRoutes);
app.use("/api", documentRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", eqptOccupiedHisRoutes);
app.use("/api", equipmentViewRoutes);
app.use("/api", objectTypeRoutes);
app.use("/api", parentTaskRoutes);
app.use("/api", trainingModuleRoutes);
app.use("/api", userModuleRoutes);
app.use("/api", formDesignRoutes);
app.use("/api", relUserParentTaskRoutes);
app.use("/api", relUserChildTaskRoutes);
app.use("/api", relUserFormRoutes);
app.use("/api", employeeViewRoutes);
app.use("/api", userTaskViewRoutes);
app.use("/api", userEmployeeViewRoutes);
app.use("/api", childTaskViewRoutes);
app.use("/api", userFormViewRoutes);
app.use("/api", formDesignViewRoutes);
app.use("/api", relUserAccessRoutes);
app.use("/api", accessProvisioningViewRoutes);
app.use("/api", userAccesssViewRoutes);
app.use("/api", ticketRoutes);
app.use("/api", relUserHandoverRoutes);
app.use("/api", UserPaymentRoutes);

//upload test
const fileRoutes = require("./routes/fileRoutes");
app.use("/api", fileRoutes);

//view
app.get("/", (req, res) => {
  console.log("get");
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

db.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

app.use(errorLogger); // Logs incoming requests

app.listen(process.env.PORT || port, () => {
  console.log(`Sever is on Port:${port}！`);
});
