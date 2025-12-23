import Content from "../model/content.model.js";


export const getUserContent = async(req,res,next)=>{
      try {
    const { userId } = req.params;

    const contents = await Content.find({
      userId,
      status: "published"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    next(error);
  }
}