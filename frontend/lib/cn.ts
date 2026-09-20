type ClassValue = string | false | null | undefined;

/** Join class names, dropping falsy values. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
