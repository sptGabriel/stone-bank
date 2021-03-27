export const isEmptyOrUndefined = (obj: any) =>
  obj ? Object.keys(obj).length === 0 : true
