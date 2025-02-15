import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactValidationSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", ctrlWrapper(getAllContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));
router.post(
  "/",
  validateBody(createContactValidationSchema),
  ctrlWrapper(createContactController)
);
router.patch(
  "/:contactId",
  isValidId,
  validateBody(createContactValidationSchema),
  ctrlWrapper(patchContactController)
);
router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
