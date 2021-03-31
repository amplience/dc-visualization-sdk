export type DeliveryRequestConfig = { isCDv1: boolean } & (
  | CD1Config
  | CD2Config
)

export interface CD1Config {
  scope: 'tree' | 'root'
  fullBodyObject: boolean
  locale: string | null
}

export interface CD2Config {
  format: 'inlined' | 'linked'
  depth: 'root' | 'all'
  locale?: string | null
}

export class RequestConfigContainer {
  DEFAULT_PARAMS_CD1: CD1Config = {
    scope: 'tree',
    fullBodyObject: true,
    locale: null,
  }

  DEFAULT_PARAMS_CD2: CD2Config = {
    format: 'inlined',
    depth: 'all',
    locale: null,
  }

  constructor(public _config: Partial<DeliveryRequestConfig>) {}

  get config(): DeliveryRequestConfig {
    return this.isCDv1() ? this.createCDv1Config() : this.createCDv2Config()
  }

  createCDv2Config() {
    return Object.assign<
      {},
      CD2Config,
      Partial<DeliveryRequestConfig>,
      { isCDv1: false }
    >({}, this.DEFAULT_PARAMS_CD2, this._config, { isCDv1: false })
  }

  createCDv1Config() {
    return Object.assign<
      {},
      CD1Config,
      Partial<DeliveryRequestConfig>,
      { isCDv1: true }
    >({}, this.DEFAULT_PARAMS_CD1, this._config, { isCDv1: true })
  }

  isCDv2() {
    return !this.isCDv1()
  }

  isCDv1() {
    return this._config.isCDv1
  }
}
