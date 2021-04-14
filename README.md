[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

# dc-visualization-sdk

[![Build Status](https://travis-ci.org/amplience/dc-visualization-sdk.svg?branch=master)](https://travis-ci.org/amplience/dc-visualization-sdk)
[![npm version](https://badge.fury.io/js/dc-visualization-sdk.svg)](https://badge.fury.io/js/dc-visualization-sdk)

`dc-visualization-sdk` enables real time visualizations that can be used in the Content Form in the Dynamic Content (DC) App.

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

# Usage

In order to create a connection to DC you first need to initiate the SDK with `visualization.init()`. Once initiated you can subscribe to change events in the content form with `visualization.form.changed(<callback>)`.

Examples of this are shown below:

```typescript
import visualization from 'dc-visualization-sdk';

async function initialize() {
  try {
    await visualization.init();
    const unsubscribe = visualization.form.changed((model) => {
      // handle form model change
    })
  } catch (err) {
    // unable to connect
  }
}
```

or

```typescript
import { init, form } from 'dc-visualization-sdk';

async function initialize() {
  try {
    await init();
    const unsubscribe = form.changed((model) => {
      // handle form model change
    })
  } catch (err) {
    // unable to connect
  }
}
```

or

```typescript
import visualization from 'dc-visualization-sdk';

visualization.init().then((sdk) => {
  const unsubscribe = sdk.form.changed((model) => {
    // handle form model change
  });
}).catch((err){
  // unable to connect
});
```
## Form

The `Form` class allows you to get the current state of the Content Form as well as subscribe to any changes that take place while editing. This lets you create real time visualizations that are not dependent on the content item being saved.

These methods are not available when the form is not visible, such as the Snapshot Browser or Edition contexts.

By default JSON is returned as it would be from the Content Delivery API (CDv2), you can also choose to use the legacy JSON-LD format (CDv1).

In addition you can set the same parameters that are available in the Delivery APIs. These let you only return just the root content item or all linked items. You can also choose to return references to the items or a fully hydrated tree.

<br/>

### Options for Content Delivery API (CDv2)

| key    |  description                                                                        | value              | default   | 
| ------ |  ---------------------------------------------------------------------------------- | ------------------- | --------- | 
| `format` | Either return an array of all linked content items or have the data inlined.      | `'inlined'`, `'linked'` | `'inlined'` | 
| `depth`  | Either return all linked content or just the root content item.                   | `'all'`, `'root'`       | `'all'`     | 

<br />

### Options for JSON-LD format (CDv1)

| key            | description                                                              | value         | default | 
| -------------- | ------------------------------------------------------------------------ | -------------- | ------- | 
| `isCDv1`         | Needs to be enabled to return the model in the CDv1 format.            | `boolean`        | `false`   |
| `fullBodyObject` | Either return the content for linked items or just an id.              | `boolean`        | `true`    | 
| `scope`          | Either return all linked content or just the root content item.        | `'tree'`, `'root'` | `'tree'`  | 

---

<br />

### form.get()

This method will retrieve the current state of the form.

> Note: this method is only available in the Production Content Form

```typescript
import visualization from 'dc-visualization-sdk';

const options = {
  format: 'linked'
  depth: 'all'
};

visualization.form.get(options).then(model => {
    // handle form model
});
```

### form.changed()

This method is for subscribing to changes that happen within the Content Form while editing. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

By default JSON is returned as it would be from the Content Delivery API (CDv2), you can also choose to use the legacy JSON-LD format (CDv1). See the table above for a full list of options..

> Note: this method is only available in the Production Content Form

```typescript
import visualization from 'dc-visualization-sdk'

const unsubscribe = visualization.form.changed((model) => {
  // handle form model
});
```
## Locale

The `Locale` class allows you to retrieve the currently selected locale in the visualization options and watch for changes to this option.

### locale.get()

This method will retrieve the current locale selected in the visualization options. The method returns a promise that resolves either to the selected locale string e.g. `'en-GB'` or `null` if none are selected.

```typescript
const value = await visualization.locale.get();

console.log(value);
// 'en-GB'
```

### locale.changed()

This method is for subscribing to changes to the selected locale in the visualization options. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = visualization.locale.changed((model) => {
  // handle locale change
});
```

## Delivery Key

The `DeliveryKey` class allows you to retrieve the delivery key of the content item being visualized and watch for changes to this setting.

### deliveryKey.get()

This method will retrieve the current Delivery Key of the content item being visualized. The method returns a promise that resolves to the set delivery key string i.e `carousel-home-page` or `null` if no key is set.

```typescript
const value = await visualization.deliveryKey.get();

console.log(value);
// 'carousel-home-page'
```

### deliveryKey.changed()

This method is for subscribing to changes to the Delivery Key of the content item being visualized. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = visualization.deliveryKey.changed((model) => {
  // handle deliveryKey change
});
```

## Settings

The `Settings` class allows you to retrieve and watch for changes to the currently selected visualization settings for the content item being visualized. This includes the `contentId`, `contentTypeId`, `snapshotId` and the device and visualization settings.

### settings.get()

This method will retrieve the current visualization settings for the content item being visualized. The method returns a promise that resolves to a settings object.

```typescript
const value = await visualization.settings.get();

console.log(value);
```

### settings.changed()

This method is for subscribing to changes to the settings object. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = visualization.settings.changed((model) => {
  // handle settings change
});
```


