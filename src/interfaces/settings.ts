export interface ISettings {
  contentId: string
  snapshotId: string
  contentTypeId: string
  device: IDevice
  visualization: IVisualizationSetting
}

export interface IDevice {
  name: string
  height: number
  rotated: boolean
  orientate: boolean
  width: number
}

export interface IVisualizationSetting {
  label: string
  default: boolean
  vseDomain: string
  hasLocaleToken: boolean
  templatedUri: string
  actualTemplatedUri: string
}
