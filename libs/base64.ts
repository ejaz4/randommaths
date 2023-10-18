export const encodeBase64 = (plainText: string) => Buffer.from(plainText).toString("base64");

export const decodeBase64 = (base64String: string) => Buffer.from(base64String, "base64").toString("ascii");

