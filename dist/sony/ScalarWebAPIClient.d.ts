export interface ServicesDescription {
    version: string;
    baseUrl: string;
    serviceTypes: string[];
}
export declare type SimpleParamType = "string" | "int" | "bool" | string;
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
export declare type ButtonCodes = Record<string, string>;
export declare type PowerStatus = "standby" | "active";
export default class ScalarWebAPIClient {
    private url;
    private description;
    constructor(url: string);
    getServicesDescription(): Promise<ServicesDescription>;
    getMethodTypes(serviceType: string): Promise<MethodType[]>;
    getRemoteControllerInfo(): Promise<Record<string, string>>;
    getPowerStatus(): Promise<PowerStatus>;
    private callMethod;
    private getServicesDescriptionInternal;
}
