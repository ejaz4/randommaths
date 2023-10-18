// https://stackoverflow.com/a/69323252
import crypto from "crypto"

export const generateRandomString = (length: number) => {
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    return randomBytes.toString('hex').slice(0, length);
}