export function generateSecureRandomHash(length: number): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('Length should be a positive integer.');
  }

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const randomBuffer = new Uint32Array(length);
  crypto.getRandomValues(randomBuffer);

  let hash = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBuffer[i] % charactersLength;
    hash += characters[randomIndex];
  }

  return hash;
}
