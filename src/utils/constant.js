const handleController = (req, res, next) => {
  try {
    req.controller(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};

export default handleController;
