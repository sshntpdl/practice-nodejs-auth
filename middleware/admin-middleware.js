const isAdminUser = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Unauthorized! only admin can access it.",
    });
  }
  next();
};

export default isAdminUser;
