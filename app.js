const express = require("express");
const app = express();

const productsRoutes = require("./routes/products");

app.use("/products", productsRoutes);

module.exports = app;