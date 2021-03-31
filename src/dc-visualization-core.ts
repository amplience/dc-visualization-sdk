import { Form } from './form'
import { Locale } from './locale'
import { Settings } from './settings'
import { DeliveryKey } from './delivery-key'
import { Visualization } from './connection'

const visualisation = Visualization.create()

const init = () => visualisation.init()
const form = new Form(visualisation.connection)
const locale = new Locale(visualisation.connection)
const settings = new Settings(visualisation.connection)
const deliveryKey = new DeliveryKey(visualisation.connection)

export default { init, form, locale, settings, deliveryKey }
