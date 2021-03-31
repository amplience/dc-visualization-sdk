export interface CDv1Response<Types = Record<string, any>[]> {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api'
  '@type': 'QueryResult'
  result: [
    {
      '@id': string
    }
  ]
  '@graph': Types
}
