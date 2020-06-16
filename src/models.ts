export interface SipCredentials {
  sipuri: string,
  password: string
}

export interface SipConfig {
  websocket: string,
  video: boolean,
  iceServers: Array<string>,
  defaultCountryCode: string,
  noAnswerTimeout: number
}

export interface PhoneConfig {
  disabledButtons: Array<string>
}