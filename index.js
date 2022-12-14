const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const ErrorObject = require("./utils/error");

const productRouter = require("./routes/product-routes");
const userRouter = require("./routes/user-routes");
const cartRouter = require("./routes/cart-routes");
const orderRoutes = require("./routes/order-routes");
const shopRoutes = require("./routes/shop-routes");
const reviewRoutes = require("./routes/review.routes");
const savedStore = require("./routes/savedStore");
const savedProduct = require("./routes/savedProduct");
const ErrorHandler = require("./controllers/error-controllers");

app.use(express.json());
app.use(cors());

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/shops", shopRoutes);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/stores", shopRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/savedstores", savedStore);
app.use("/api/v1/savedproducts", savedProduct);

app.all("*", (req, res, next) => {
  const err = new ErrorObject(`http:localhost:6000${req.url} not found`, 404);
  next(err);
});

app.use(ErrorHandler);

module.exports = app;
