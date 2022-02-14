interface config {
  withHash?: boolean
  decode?: boolean
}
export declare function getLocationQuery(queryName?: string, config?: config)
export declare function setGlobalConfig(name: string, value: any)
export declare function getGlobalConfig(name: string)
export declare function removeGlobalConfig(name: string | Array<string>)
export declare function clearGlobalConfig()

interface LoadScriptConfig {
  url: string
  globalVar?: string
}
export declare function loadScript(config: string | LoadScriptConfig): Promise<any>
