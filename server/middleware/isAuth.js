module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Login required",
      redirect: req.originalUrl
    });
  }
  next();
};