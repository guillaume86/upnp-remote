import fs from "fs";
import path, { basename } from "path";
import appDir from "./appDir";

interface CacheData {
  [key: string]: any;
}

export class Cache {
  protected _data: CacheData;

  constructor() {
    this._data = {};
  }

  public memoize<T>(
    action: () => Promise<T>,
    cacheKey: string,
    checkCachedValue?: (value: T) => Promise<boolean>,
  ) {
    return async (): Promise<T> => {
      const cachedValue = this.get<T>(cacheKey);
      if (cachedValue !== undefined) {
        if (!checkCachedValue || (await checkCachedValue(cachedValue))) {
          return cachedValue;
        } else {
          this.delete(cacheKey);
        }
      }

      const returnValue = await action();
      this.set(cacheKey, returnValue);
      return returnValue;
    };
  }

  public get<T>(cacheKey: string): T | undefined {
    if (cacheKey in this._data) {
      return this._data[cacheKey] as T;
    } else {
      return undefined;
    }
  }

  public set<T>(cacheKey: string, value: T) {
    this._data[cacheKey] = value;
  }

  public delete(cacheKey: string) {
    delete this._data[cacheKey];
  }
}

interface DurableCacheOptions {
  filePath: string;
}

export class DurableCache extends Cache {
  constructor(private options: DurableCacheOptions) {
    super();
    this.loadFromFile(options.filePath);
  }

  private loadFromFile(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;
    const json = fs.readFileSync(filePath, { encoding: "utf8" });
    this._data = JSON.parse(json);
    return true;
  }

  public save() {
    const json = JSON.stringify(this._data, null, 2);
    fs.writeFileSync(this.options.filePath, json, { encoding: "utf8" });
  }

  public set<T>(cacheKey: string, value: T) {
    super.set(cacheKey, value);
    (async () => this.save())();
  }
}

export const cache = new DurableCache({
  filePath: path.join(appDir, "cache.json"),
});

export default cache;
