export async function setTimeoutAsync(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export default setTimeoutAsync;
