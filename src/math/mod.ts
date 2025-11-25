export const mod = (num: number, modulus: number) => {
  return ((num % modulus) + modulus) % modulus;
}