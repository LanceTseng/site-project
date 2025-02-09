const express = require("express");
const coookie = require("cookie-parser");

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
app.use(express.urlencoded({ extended: false }));
app.use(coookie());

// Routes
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);
//api

const employeeRoutes = require("./routes/employeeRoutes");
const accessProvisioningRoutes = require("./routes/accessProvisioningRoutes");
const childTaskRoutes = require("./routes/childTaskRoutes");
const documentRoutes = require("./routes/documentRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const objectTypeRoutes = require('./routes/objectTypeRoutes');
const parentTaskRoutes = require('./routes/parentTaskRoutes');
const trainingModuleRoutes = require('./routes/trainingModuleRoutes');
const userModuleRoutes = require('./routes/userRoutes');
const relUserParentTaskRoutes = require('./routes/relUserParentTaskRoutes');
const relUserChildTaskRoutes = require('./routes/relUserChildTaskRoutes');
const employeeViewRoutes = require('./routes/employeeViewRoutes');

app.use("/api", employeeRoutes);
app.use("/api", accessProvisioningRoutes);
app.use("/api", childTaskRoutes);
app.use("/api", documentRoutes);
app.use("/api", equipmentRoutes);
app.use('/api', objectTypeRoutes);
app.use('/api', parentTaskRoutes);
app.use('/api', trainingModuleRoutes);
app.use('/api', userModuleRoutes);
app.use('/api', relUserParentTaskRoutes);
app.use('/api', relUserChildTaskRoutes);
app.use('/api', employeeViewRoutes);



//view
app.get("/", (req, res) => {
  console.log("get")
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

db.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

app.listen(process.env.PORT || port, () => {
  console.log(`Sever is on Port:${port}！`);
});
