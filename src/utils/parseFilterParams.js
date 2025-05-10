/**
 * Parsing type
 * @param {*} type
 * @returns
 */
const parseContactType = (type) => {
  const isString = typeof type === "string";
  if (!isString) return;
  const isType = (type) => ["work", "home", "personal"].includes(type);

  if (isType(type)) return type;
};

/**
 * Parsing boolean string
 * @param {*} string
 * @returns
 */
const parseBoolean = (string) => {
  const isString = typeof string === "string";
  if (!isString) return;
  if (!["true", "false"].includes(string)) return;

  return string === "true" ? true : false;
};

/**
 * Export filter parameters
 * @param {*} query
 * @returns
 */
export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
