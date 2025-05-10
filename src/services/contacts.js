import { contactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
}) => {
  const limitOnPage = perPage;
  const offset = (page - 1) * perPage;
  const contactsQuery = contactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where("contactType").equals(filter.type);
  }

  if (typeof filter.isFavourite === "boolean") {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const contactsCount = await contactsCollection
    .find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(offset)
    .sort({ [sortBy]: sortOrder })
    .limit(limitOnPage)
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await contactsCollection.findOne({
    _id: contactId,
    userId,
  });
};

export const createContact = async (payload) => {
  return await contactsCollection.create(payload);
};

export const deleteContact = async (contactId, userId) => {
  return await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {}
) => {
  const result = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      ...options,
    }
  );

  return result;
};
