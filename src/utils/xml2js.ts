import {
  convertableToString,
  OptionsV2,
  parseString as parseStringCb,
} from "xml2js";

/**
 * Promise version of xml2js parseString
 * @internal
 */
export function parseString<T = any>(
  xml: convertableToString,
  options?: OptionsV2,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = (err: Error, result: any) => {
      if (err) reject(err);
      else resolve(result);
    };
    options ? parseStringCb(xml, options, cb) : parseStringCb(xml, cb);
  });
}
