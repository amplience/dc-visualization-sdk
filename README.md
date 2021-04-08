[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

# dc-visualization-sdk

[![Build Status](https://travis-ci.org/amplience/dc-visualization-sdk.svg?branch=master)](https://travis-ci.org/amplience/dc-visualization-sdk)
[![npm version](https://badge.fury.io/js/dc-visualization-sdk.svg)](https://badge.fury.io/js/dc-visualization-sdk)

`dc-visualization-sdk` is a low level sdk that enables creating real time visualizations that can be used in the content editing form in Dynamic Content App.

# Installation

Using npm:

```bash
npm install dc-visualization-sdk --save
```

Using yarn:

```bash
yarn add dc-visualization-sdk
```

Using cdn:

```html
<script src="https://unpkg.com/dc-visualization-sdk/dist/dc-visualization-sdk.umd.js"></script>
```

## Usage

Creating a basic change handler.

By default the model is returned in a CDv2 compatible format

```typescript
import visualization from 'dc-visualization-sdk'

async function initialize() {
  try {
    await visualization.init()

    const disposeChange = visualization.form.changed((model) => {
      // handle form model
    })
  } catch (err) {
    // not connected to content.amplience
  }
}
```

or

```typescript
import { init, form } from 'dc-visualization-sdk'

async function initialize() {
  try {
    await init()

    const disposeChange = form.changed((model) => {
      // handle form model
    })
  } catch (err) {
    // not connected to content.amplience
  }
}
```

or

```typescript
import visualization from 'dc-visualization-sdk'

visualization.init().then((sdk) => {
  const disposeChange = sdk.form.changed((model) => {
    // handle form model
  })
})
```

## Form

Form class allows you to get and watch for changes within the Production Content Form, it is not enabled for other contexts such as Snapshot Browser or Edition page ect.

### Options

Options allows you to get the content form model in different formats to match Devlivery API v1 and v2 depending on the config you pass below are the valid options for each version.

#### CDv2

| key    | type    | description                                                                        | values              | default   | required |
| ------ | ------- | ---------------------------------------------------------------------------------- | ------------------- | --------- | -------- |
| format | string  | shape of data to be returned either an array of all linked content or inlined data | 'inlined', 'linked' | 'inlined' | false    |
| depth  | string  | whether it should return all linked content or just the root of the form           | 'all', 'root'       | 'all'     | false    |
| isCDv1 | boolean | no need to be set for CDv2                                                         | false               | false     | false    |

<br><br>

#### CDv1

| key            | type    | description                                                              | values         | default | required |
| -------------- | ------- | ------------------------------------------------------------------------ | -------------- | ------- | -------- |
| scope          | string  | whether it should return all linked content or just the root of the form | 'tree', 'root' | 'tree'  | false    |
| fullBodyObject | boolean | whether it should return content of items or just an id referenceing     | boolean        | true    | false    |
| isCDv1         | boolean | needs to be set in order to get model in a CDv1 format                   | false          | false   | true     |

---

<br>
<br>

### get

If you want to get the current state of the form

> Disclaimer this method only works in the Production Content Form

```typescript
import visualization from 'dc-visualization-sdk'

const options = {
  format: 'linked'
  depth: 'all'
}

visualization.form.get(options).then(model => {
    // handle form model
})
```

### changed

`form.changed` returns a function that when called removes the callback from being called on changes.

#### Watching the form

`form.changed` default config returns the model in a CDv2 format see [CDv2 Documentation]() for more information.

> Disclaimer this method only works in the Production Content Form

```typescript
import visualization from 'dc-visualization-sdk'

const disposeChange = visualization.form.changed((model) => {
  // handle form model
})
```

#### Watching the form: CDv1 model

To get the correct typing if you're using typescript you can pass `CDv1Response` to `form.changed`.

see [CDv1 Documentation]() for more information.

```typescript
import visualization, { CDv1Response } from 'dc-visualization-sdk'

const disposeChange = visualization.form.changed<CDv1Response>(
  (model) => {
    // handle form model
  },
  {
    isCDv1: true,
  }
)
```

## Locale

Locale class allows you to get the currently selected locale in the form and watch for changes to async update your application asynchronously

### get

Get the current locale selected in visualization settings. `locale.get` returns a Promise that either resolves a locale string i.e `en-GB` or `null`

```typescript
const value = await visualization.locale.get()

console.log(value)
// 'en-GB'
```

### changed

Sets up a listener for when the visualization locale changes.

`locale.changed` returns a function that when called removes the callback from being called on changes.

```typescript
const dispose = visualization.locale.changed((model) => {
  // handle locale change
})
```

## Delivery Key

DeliveryKey class allows you to get the delivery key of the content item you're viewing and watch for changes to asynchronously update your application

### get

Get the current delivery key for the content item you're viewing. `deliveryKey.get` returns a Promise that either resolves a string i.e `carousel-home-page` or `null`

```typescript
const value = await visualization.deliveryKey.get()

console.log(value)
// 'carousel-home-page'
```

### changed

Sets up a listener for when the content item Delivery Key changes.

`deliveryKey.changed` returns a function that when called removes the callback from being called on changes.

```typescript
const dispose = visualization.deliveryKey.changed((model) => {
  // handle deliveryKey change
})
```

## Settings

Settings class allows you to get the currently selected visualization settings in the form such as Device selected, vse URL, contentId and snapshotId and watch for changes to asynchronously update your application

### get

Get the currently selected visualization settings for the content item you're viewing. `settings.get` returns a Promise that resolves to the ISettings object

```typescript
const value = await visualization.settings.get()

console.log(value)
```

### changed

Sets up a listener for when the visualization settings changes.

`settings.changed` returns a function that when called removes the callback from being called on changes.

```typescript
const dispose = visualization.deliveryKey.changed((model) => {
  // handle deliveryKey change
})
```

## Best Practices

```

```
