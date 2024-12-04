const retryOperation = async (operation, delay, retries) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (error.code === 16500 && i < retries - 1) {
        const retryAfter = error.retryAfterMs || delay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
      } else {
        throw error;
      }
    }
  }
};
module.exports = retryOperation;