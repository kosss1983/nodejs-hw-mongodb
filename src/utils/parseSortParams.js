import { SORT_ORDER } from "../constants/index.js";

/**
 * Parsing sort order
 * @param {*} sortOrder
 * @returns
 */
const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;

  return SORT_ORDER.ASC;
};

/**
 * Parsing sort by
 * @param {*} sortBy
 * @returns
 */
const parseSortBy = (sortBy) => {
  const keysOfContact = [
    "_id",
    "name",
    "phoneNumber",
    "email",
    "isFavourite",
    "contactType",
    "createdAt",
    "updatedAt",
  ];

  if (keysOfContact.includes(sortBy)) {
    return sortBy;
  }

  return "_id";
};

/**
 * Export sort params
 * @param {*} query
 * @returns
 */
export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
