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
// - - - - -
/**
 * Truncates a string to a specified number of words and adds an ellipsis.
 *
 * @param text The input string to shorten.
 * @param wordLimit The maximum number of words to return. Defaults to 120.
 * @returns The truncated string or the original string if it's within the word limit.
 */
export const shorten = (text: string, wordLimit: number = 100): string => {
  // Return an empty string if the input is not a valid string
  if (!text || typeof text !== "string") {
    return "";
  }

  // Split by any whitespace character to create an array of words
  const words = text.split(/\s+/);

  // If the text is already within the limit, return it as is
  if (words.length <= wordLimit) {
    return text;
  }

  // Slice the array to the word limit, join back into a string, and add an ellipsis
  return words.slice(0, wordLimit).join(" ") + "...";
};
