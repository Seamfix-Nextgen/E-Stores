const Order = require("../models/Order");
const CatchAsync = require("../utils/catch-async");
const QueryMethod = require("../utils/query");

exports.getOrder = CatchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (req.user.id !== order.userId.toString()) {
    return next(new ErrorObject(`You are not authorized!!!!!!!`, 403));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.getAllOrder = CatchAsync(async (req, res, next) => {
  let queriedOrders = new QueryMethod(Order.find(), req.query)
    .sort()
    .filter()
    .limit()
    .paginate();
  let orders = await queriedOrders.query;
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});
