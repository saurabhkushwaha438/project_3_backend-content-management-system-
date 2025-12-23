
import { Router } from "express";
import { getAllContent,getSpecificContent,deleteContent,createContent,updateContent } from "../controller/content.controller.js";
import upload from "../middleware/multer.middleware.js"
import authorization from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";
import onlyValidAdmin from "../middleware/user.middleware.js";
const contentRouter = Router();

// Create content
contentRouter.post("/", authorization,adminOnly,upload.single("image"),createContent);

// Get all contents
contentRouter.get("/", getAllContent);

// Get specific content
contentRouter.get("/:contentId", getSpecificContent);

// Update content
contentRouter.patch("/:contentId",authorization,onlyValidAdmin, updateContent);

// Delete content
contentRouter.delete("/:contentId",authorization,onlyValidAdmin ,deleteContent);

export default contentRouter;
