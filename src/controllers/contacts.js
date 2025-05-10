import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from "../services/contacts.js";
import createHttpError from "http-errors";

/**
 * Get all contacts from DB
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

/**
 * Get contact by ID from DB
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, "Contact not found!");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

/**
 * Create new contact
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createContactController = async (req, res, next) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

/**
 * Update contact by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result,
  });
};

/**
 * Delete contact by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, "Contact not found!");
  }

  res.status(204).send();
};
