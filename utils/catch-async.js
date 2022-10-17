const CatchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, re, next).catch(next);
  };
};

module.exports = CatchAsync;
