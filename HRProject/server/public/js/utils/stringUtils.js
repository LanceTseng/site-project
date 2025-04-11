export function isEqualIgnoreCase(str1, str2) {
    return new RegExp(`^${str1}$`, "i").test(str2);
}

export function isEqualIgnoreCaseStrict(str1, str2) {
    if (typeof str1 !== "string" || typeof str2 !== "string") {
        return false; // Ensures safe comparison
    }
    return str1.replace(/\s+/g, "").toLowerCase() === str2.replace(/\s+/g, "").toLowerCase();
}

export function formatDate(date) {
    return date ? new Date(date).toLocaleDateString() : "";
  }