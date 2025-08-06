/**
  
 * Appends "..." if the string is truncated.
 *
 * @param text  
 * @param wordLimit  
 * @returns  
 */
export const truncateStr = (text: string, wordLimit: number): string => {
  if (!text) {
    return "";
  }

  const words = text.split(/\s+/);
  if (words.length <= wordLimit) {
    return text;
  }

  const truncatedText = words.slice(0, wordLimit).join(" ");
  return `${truncatedText}...`;
};
