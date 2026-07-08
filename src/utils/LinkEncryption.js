// Simple XOR-based encryption with Base64 encoding
const SECRET_KEY = 'simple_key'; // The key used for XOR

// XOR encryption/decryption function
function xorEncryptDecrypt(input, key) {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
}

// Encode Base64 in a URL-safe way
function base64Encode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode Base64 in a URL-safe way
function base64Decode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Encrypt function
export function encryptLink(text) {
  const encrypted = xorEncryptDecrypt(text, SECRET_KEY);
  return encodeURIComponent(base64Encode(encrypted)); // Base64 encode in a URL-safe manner
}

// Decrypt function
export function decryptLink(encryptedText) {
  try {
    const decodedBase64 = base64Decode(decodeURIComponent(encryptedText)); // Base64 decode safely
    return xorEncryptDecrypt(decodedBase64, SECRET_KEY); // XOR decrypt
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw error;
  }
}
