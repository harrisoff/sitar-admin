import { SESSION_STORAGE_KEYS } from "../../config";

const { WX_TOKEN, MINI_TOKEN } = SESSION_STORAGE_KEYS;

export function setToken(key, value) {
  sessionStorage.setItem(key, value);
}

export function getToken(key) {
  return sessionStorage.getItem(key);
}

export function getWxToken() {
  return getToken(WX_TOKEN);
}

export function getMiniToken() {
  return getToken(MINI_TOKEN);
}

export function delMiniToken() {
  sessionStorage.removeItem(MINI_TOKEN);
}
