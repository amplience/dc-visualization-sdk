export type IModel<T = any> = T

export type ModelChangeDispose = () => void

export type ModelChangeHandler<T = any> = (context: IModel<T>) => void
