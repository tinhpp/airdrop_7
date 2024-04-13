export const calculateAPR = (input, output, duration) => {
  if (!input || !output || !duration) return 0;
  const apr = ((output - input) * 365 * 100) / (input * duration);
  return apr.toFixed(2);
};

export const calculateRepayment = (input, apr, duration) => {
  if (!input || !apr || !duration) return 0;
  const repayment = +input + (apr * input * duration) / (365 * 100);
  for (let i = 2; i <= 10; i++) {
    if (repayment.toFixed(i) != Number(repayment.toFixed())) return repayment.toFixed(i);
  }

  return repayment;
};
