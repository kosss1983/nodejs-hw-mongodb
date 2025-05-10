import dotenv from "dotenv";

dotenv.config();

/**
 * Get and return environment variable if exist
 * @param {*} name
 * @param {*} defaultValue
 * @returns
 */
export const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
};
