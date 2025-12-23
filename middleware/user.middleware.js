import Content from "../model/content.model.js";

const onlyValidAdmin = async (req, res, next) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Owner check
    if (content.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this content"
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default onlyValidAdmin;
