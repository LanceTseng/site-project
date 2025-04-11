export function loginUser() {
  console.log(sessionStorage.getItem("user"));
  return JSON.parse(sessionStorage.getItem("user"));
}
