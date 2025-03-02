import { isEqualIgnoreCase } from "./stringUtils.js";

export function accessVerify(access_name) {
  const userAuth = JSON.parse(sessionStorage.getItem("user-auth")) || [];

  return userAuth.some((auth) => 
    isEqualIgnoreCase(auth.access_name, access_name) && auth.enabled == 1
  );
}
