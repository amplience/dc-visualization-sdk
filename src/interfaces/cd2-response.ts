export interface CDv2Response<Content = Record<string, any>> {
  content: Content
}

export interface CDv2LinkedResponse<
  Content = Record<string, any>,
  Types = Record<string, any>[]
> {
  content: Content
  linkedContent: Types
}
