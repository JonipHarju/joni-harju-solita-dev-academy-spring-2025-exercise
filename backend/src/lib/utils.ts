export const getStringParam = (param: any): string | undefined => {
  return typeof param === "string" ? param : undefined;
};
export const getNumberParam = (
  param: any,
  parseFunc: (val: string) => number
): number | undefined => {
  if (typeof param === "string" && !isNaN(parseFunc(param))) {
    return parseFunc(param);
  }
  return undefined;
};
