export async function withBackoff<T>(fn: () => Promise<T>): Promise<T> {
  const delays = [250, 1000];
  try { return await fn(); } catch (e) {
    for (const d of delays) { await new Promise(r => setTimeout(r, d)); try { return await fn(); } catch {} }
    throw e;
  }
}