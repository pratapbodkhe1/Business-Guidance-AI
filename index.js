const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("🚀 Business Guidance AI Server Running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});