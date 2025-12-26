/**
 * Formats a price string or number into a readable string.
 * @param price The price to format.
 */
export const formatPrice = (price: string | number): string => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "0.00";

  return num >= 1000
    ? num.toLocaleString("en-US", { maximumFractionDigits: 1 })
    : num >= 1
    ? num.toFixed(2)
    : num.toFixed(4);
};

/**
 * Formats a percent string or number into a readable string with sign.
 * @param percent The percentage to format (e.g. 0.05 for 5%).
 */
export const formatPercent = (percent: string | number): string => {
  const num = typeof percent === "string" ? parseFloat(percent) : percent;
  if (isNaN(num)) return "0.00%";

  const val = num * 100;
  return val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`;
};

/**
 * Formats a volume string or number into a readable compact string (e.g. 1.2M).
 * @param value The volume to format.
 */
export const formatVolume = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";

  return num >= 1e9
    ? `$${(num / 1e9).toFixed(2)}B`
    : num >= 1e6
    ? `$${(num / 1e6).toFixed(2)}M`
    : `$${num.toLocaleString()}`;
};
