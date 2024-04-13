export const calculateRepayment = (
  input: number,
  apr: number,
  duration: number,
): string => {
  if (!input || !apr || !duration) return '0';
  const repayment: number = +input + (apr * input * duration) / (365 * 100);
  for (let i = 2; i <= 10; i++) {
    if (Number(repayment.toFixed(i)) != Number(repayment.toFixed()))
      return repayment.toFixed(i);
  }

  return String(repayment);
};
