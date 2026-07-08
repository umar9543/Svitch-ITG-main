const sanitizeFileName = (name) => {
  // Replace non-ASCII characters with an underscore
  return name.replace(/[^\x00-\x7F]/g, '_');
};
export default sanitizeFileName;
