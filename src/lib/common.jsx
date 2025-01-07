export const isNonNegativeNumber = (value) => {
    const nonNegativeNumberRegex = /^\d+(\.\d+)?$/;
    return nonNegativeNumberRegex.test(value);
  };