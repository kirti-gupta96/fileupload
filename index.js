const express = require('express');
const axios = require('axios');
const multer = require('multer');
const app = express();
const router = require('./routes/routes.js');
const connectToMongoDB = require('./db/dbConnection');


const PORT = process.env.PORT || 3000;

connectToMongoDB();
app.use(express.json());
// app.use(authMiddleware);
app.use(router(app));


app.use((err, req, res, next) => {
  console.error("Error from error handler", err);
  const errStatus = err.status || 500;
  res.status(errStatus).json({ error: err.message || "Internal Server Error" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
