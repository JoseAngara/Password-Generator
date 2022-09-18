import { sha512 } from "js-sha512";

function getValidAsciiCodes(message: string): string[] {
  let matches = message.match(/.{1,2}/g) || [];

  return matches
    .map((value) => parseInt(value, 16))
    .filter((value) => value > 32 && value < 127)
    .map((value) => value.toString(16).padStart(2, "0"));
}
function hexToUtf8(hex: string): string {
  return decodeURIComponent("%" + getValidAsciiCodes(hex)?.join("%"));
}

function encrypt(message: string): string {
  return hexToUtf8(sha512(message));
}

export function getPin(length: number, key: string, message: string) {
  let pin = "";
  let toEncrypt = message + key;
  while (pin.length < length) {
    pin += (encrypt(toEncrypt).match(/\d+/g) || []).join("");
    console.log(pin);
    toEncrypt += key;
  }

  return pin.substring(0, length);
}

export function getPassword(
  length: number,
  key: string,
  message: string,
  regexp: RegExp
) {
  let password = "";
  let toEncrypt = key + message + key;
  while (password.length < length) {
    password += (encrypt(toEncrypt).match(regexp) || []).join("");
    toEncrypt += key;
  }

  return password.substring(0, length);
}
