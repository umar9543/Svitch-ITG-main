// utils/urlFormatter.js
export const trimForUrl = (string) => {
  // Convert to lowercase
  string = string.toLowerCase();
  // Remove spaces and any characters that are not alphanumeric or underscores
  string = string.replace(/[^a-z0-9_]/g, '');
  return string;
};
