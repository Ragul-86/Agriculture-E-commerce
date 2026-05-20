export const formatCurrency = (n) => {
  if (n == null) return "";
  return "₹" + n.toLocaleString();
};
