const express = require("express");
const app = express();

const productsRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/products", productsRoutes);
app.use("/orders", orderRoutes);

module.exports = app;