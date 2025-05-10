import { contactsCollection } from "../db/models/contact.js";

export const getAllContacts = async () => {
  return await contactsCollection.find();
};

export const getContactById = async (contactId) => {
  return await contactsCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return await contactsCollection.create(payload);
};

export const deleteContact = async (contactId) => {
  return await contactsCollection.findOneAndDelete({
    _id: contactId,
  });
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      ...options,
    }
  );

  return result;
};
