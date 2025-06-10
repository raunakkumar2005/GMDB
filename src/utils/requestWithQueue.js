// utils/requestWithQueue.js
const queue = [];
let isProcessing = false;

export const requestWithQueue = async (url) => {
  return new Promise((resolve, reject) => {
    queue.push({ url, resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { url, resolve, reject } = queue.shift();

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API Request failed");
    const json = await res.json();
    resolve(json);
  } catch (err) {
    reject(err);
  }

  setTimeout(() => {
    isProcessing = false;
    processQueue();
  }, 400); // wait 400ms between requests (2.5 req/sec)
};
