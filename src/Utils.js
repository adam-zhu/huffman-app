export const resolve_input_element_value = (input_node) => {
  const { value, type } = input_node;

  switch (type) {
    case "number":
      return Number(value);

    default:
      return value;
  }
};

const round_to_decimal_precision = (value, precision) =>
  Math.round(Number(value) * precision) / precision;

export const inches_to_feet = (inches, decimal_precision) => {
  const precision =
    typeof decimal_precision === "number" ? decimal_precision : 10;
  const feet = inches / 12;

  return round_to_decimal_precision(feet, precision);
};

export const inches_to_feet_and_inches_tuple = (inches) => {
  const feet = Math.floor(inches / 12);
  const remainder = inches % 12;

  return [feet, remainder];
};

export const cents_to_dollars = (cents) => {
  const dollars = Number(cents) / 100;

  return round_to_decimal_precision(dollars, 100);
};
