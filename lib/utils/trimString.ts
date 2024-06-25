export default function trimString(
  inputString: string,
  maxLength = 280
): string {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.slice(0, maxLength - 3) + '...';
  }
}
