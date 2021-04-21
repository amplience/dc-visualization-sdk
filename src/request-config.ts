export type DeliveryRequestConfig = CD2Config;
export interface CD2Config {
  format: 'inlined' | 'linked';
  depth: 'root' | 'all';
}

export class RequestConfigContainer {
  DEFAULT_PARAMS_CD2: CD2Config = {
    format: 'inlined',
    depth: 'all',
  };

  constructor(public _config: Partial<DeliveryRequestConfig>) {}

  get config(): DeliveryRequestConfig {
    return this.createCDv2Config();
  }

  createCDv2Config() {
    return Object.assign<{}, CD2Config, Partial<DeliveryRequestConfig>>(
      {},
      this.DEFAULT_PARAMS_CD2,
      this._config
    );
  }
}
