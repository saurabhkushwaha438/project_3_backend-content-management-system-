import Content from "../model/content.model.js";
import cloudinary from "../config/cloudinary.js";
export const getAllContent = async(req,res,next)=>{
    try{
        const contents = await Content.find({
            status:"published"
        });
        res.status(200).json({
            success:true,
            data:contents
        })
    }catch(err){
        next(err);
    }
}
export const getSpecificContent = async(req,res,next)=>{
    try {
        const {contentId} = req.params;
        const specificContent = Content.findById({
            _id:contentId,
            status:"published"
        });
         res.status(200).json({
            success:true,
            data:specificContent
        })
    } catch (error) {
        next(error);
    }
}
export const deleteContent = async(req,res,next)=>{
    try{
        const {contentId} = req.params;
        const deletedcontent = await Content.findOneAndDelete(contentId);
        if(!deletedcontent){
            return res.status(404).json({
                success:false,
                message:"content not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"this content deleted successfully"
        })
    }catch(err){
        next(err);
    }
}
export const createContent = async (req, res, next) => {
  try {
    const { title, body, tags,status } = req.body;

    if (!title || !body) {
      const err = new Error("Title and body are required");
      err.statusCode = 400;
      throw err;
    }

    let imgUrl = null;

    // If image is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "cms-content" }
      );

      imgUrl = result.secure_url;
    }

    const content = await Content.create({
      userId: req.user.id,   // from auth middleware
      title,
      body,
      imgUrl,
      tags,
      status
    });

    res.status(201).json({
      success: true,
      data: content
    });

  } catch (error) {
    next(error);
  }
}
export const updateContent = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { title, body, status, tags } = req.body;

    const content = await Content.findById(contentId);

    if (!content) {
      const err = new Error("Content not found");
      err.statusCode = 404;
      throw err;
    }

    if (content.userId.toString() !== req.user.id) {
      const err = new Error("Not authorized to update this content");
      err.statusCode = 403;
      throw err;
    }

    if (title) content.title = title;
    if (body) content.body = body;
    if (status) content.status = status;
    if (tags) content.tags = tags.split(",");

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "cms-content" }
      );

      content.imgUrl = uploadResult.secure_url;
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: content
    });

  } catch (error) {
    next(error);
  }
}
