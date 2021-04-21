export interface ISettings {
  vse: string;
  devices: IDevice[];
}

export interface IDevice {
  name: string;
  height: number;
  rotated: boolean;
  orientate: boolean;
  width: number;
}
