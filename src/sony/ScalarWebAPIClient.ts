import fetch from "node-fetch";
import { parseString } from "../utils/xml2js";
import { AUTH_HEADERS } from "./common";

const getNodeName = (type: string) => "av:X_ScalarWebAPI_" + type;
const NODE_NAME_DEVICE_INFO = getNodeName("DeviceInfo");

export interface ServicesDescription {
  version: string;
  baseUrl: string;
  serviceTypes: string[];
}

export type SimpleParamType = "string" | "int" | "bool" | string;

export interface ComplexParamType {
  [prop: string]: ParamType;
}

export interface ParamType {
  array: boolean;
  type: SimpleParamType | ComplexParamType;
}

export interface MethodType {
  name: string;
  paramIn: ParamType[];
  paramOut: ParamType[];
  version: string;
}

export type ButtonCodes = Record<string, string>;

export type PowerStatus = "standby" | "active";

const parseParamType = (typeStr: string): ParamType => {
  let array = false;
  if (typeStr.endsWith("*")) {
    array = true;
    typeStr = typeStr.slice(0, -1);
  } else if (typeStr.endsWith("[]")) {
    array = true;
    typeStr = typeStr.slice(0, -2);
  }
  if (typeStr.startsWith("{")) {
    const type = JSON.parse(typeStr) as ComplexParamType;
    for (const prop in type) {
      type[prop] = parseParamType(type[prop] as any);
    }
    return { array, type };
  } else {
    const type = typeStr as SimpleParamType;
    return { array, type };
  }
};

export default class ScalarWebAPIClient {
  private description: Promise<ServicesDescription> | undefined;

  constructor(private url: string) {}

  public async getServicesDescription(): Promise<ServicesDescription> {
    if (!this.description) {
      this.description = this.getServicesDescriptionInternal();
    }
    return this.description;
  }

  public async getMethodTypes(serviceType: string): Promise<MethodType[]> {
    const data = (await this.callMethod(serviceType, "getMethodTypes", [
      "1.0",
    ])) as Array<[string, string[], string[], string]>;

    return data.map(([name, paramIn, paramOut, version]) => ({
      name,
      paramIn: paramIn.map(parseParamType),
      paramOut: paramOut.map(parseParamType),
      version,
    }));
  }

  public async getRemoteControllerInfo() {
    const [, codes] = (await this.callMethod(
      "system",
      "getRemoteControllerInfo",
    )) as [void, Array<{ name: string; value: string }>];

    const map: any = {};
    for (const item of codes) {
      map[item.name] = item.value;
    }

    return map as ButtonCodes;
  }

  public async getPowerStatus() {
    const [{ status }] = (await this.callMethod(
      "system",
      "getPowerStatus",
    )) as Array<{ status: PowerStatus }>;
    return status;
  }

  private async callMethod<T = any>(
    serviceType: string,
    method: string,
    params: any[] = [],
  ) {
    const description = await this.getServicesDescription();
    if (!description.serviceTypes.includes(serviceType)) {
      throw new Error(
        `The service ${serviceType} is not available on the device`,
      );
    }

    const url = `${description.baseUrl}/${serviceType}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...AUTH_HEADERS },
      body: JSON.stringify({
        method,
        version: "1.0",
        params,
        id: 4694,
      }),
    });

    return (await response.json()).result as T;
  }

  private async getServicesDescriptionInternal(): Promise<ServicesDescription> {
    const response = await fetch(this.url);
    const xml = await response.text();
    const desc = await parseString(xml, { explicitRoot: false });
    if (desc && desc.device) {
      const [device] = desc.device;
      if (NODE_NAME_DEVICE_INFO in device) {
        const [deviceInfo] = device[NODE_NAME_DEVICE_INFO];
        const [version] = deviceInfo[getNodeName("Version")];
        const [baseUrl] = deviceInfo[getNodeName("BaseURL")];
        const [serviceList] = deviceInfo[getNodeName("ServiceList")];
        const serviceTypes = serviceList[getNodeName("ServiceType")];
        return {
          version,
          baseUrl,
          serviceTypes,
        };
      }
    }

    throw new Error(
      `The device at ${this.url} do not provide ScalarWebAPI services.`,
    );
  }
}
