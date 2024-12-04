export function generateSecureRandomInteger(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max should be integers.');
  }
  if (min >= max) {
    throw new Error('Min should be less than Max.');
  }

  // Генерация случайного целого числа в диапазоне [min, max]
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);

  // Приведение случайного числа к диапазону [min, max]
  const range = max - min + 1;
  const randomNumber = randomBuffer[0] % range;

  return randomNumber + min;
}
