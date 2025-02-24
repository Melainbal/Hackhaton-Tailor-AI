require("dotenv").config();
const express = require("express");
const blueprintRoutes = require("./routes/blueprintRoutes");
const specsRoutes = require("./routes/specsRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api", blueprintRoutes);
app.use("/api", specsRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
