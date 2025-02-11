export function isEqualIgnoreCase(str1, str2) {
    return new RegExp(`^${str1}$`, "i").test(str2);
}

export function formatDate(date) {
    return date ? new Date(date).toLocaleDateString() : "";
  }