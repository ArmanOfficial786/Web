export default function isObjEmpty(obj: any): boolean {
  return Object.keys(obj ?? {}).length < 1;
}
