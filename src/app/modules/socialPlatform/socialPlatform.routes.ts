import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SocialValidation } from "./socialPlatform.validation";
import { SocialController } from "./socialPlatform.controller";

const router = express.Router();


router.post(
  "/create-social",
  validateRequest(SocialValidation.SocialPlatformSchema),
  SocialController.createSocial
);


router.get("/", SocialController.getAllSocials);


router.get("/:id", SocialController.getSingleSocial);

router.patch(
  "/:id",
//   validateRequest(SocialValidation.SocialPlatformUpdateSchema),
  SocialController.updateSocial
);

router.delete("/:id", SocialController.deleteSocial);

export const SocialRouter = router;
