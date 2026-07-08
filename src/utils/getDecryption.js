import { decrypt } from 'src/api/encryption';

export const decryptObjectKeys = (data) => {
  const decryptedData = data.map((item) => {
    const decryptedItem = {};
    Object.keys(item).forEach((key) => {
      decryptedItem[key] = decrypt(item[key]);
    });
    return decryptedItem;
  });
  return decryptedData;
};

export const decryptRecursiveObjectKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => decryptRecursiveObjectKeys(item));
  } else if (typeof data === 'object' && data !== null) {
    const decryptedItem = {};
    Object.keys(data).forEach((key) => {
      decryptedItem[key] = decryptRecursiveObjectKeys(data[key]);
    });
    return decryptedItem;
  } else {
    return decrypt(data);
  }
};
