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

In order to create a connection to DC you first need to initiate the SDK with `init()` method. Once connected you are given an [SDK object]() you can use to subscribe to change events in the content form `<sdk>.form.changed(<callback>)`, amongst other things.

Examples of this are shown below:

```typescript
import { init } from 'dc-visualization-sdk';
const sdk = await init();
const unsubscribe = sdk.form.changed((model) => {
  // handle form model change
});
```

or

```javascript
const visSDK = require('dc-visualization-sdk');
visSDK.init().then((sdk) => {
  const unsubscribe = sdk.form.changed((model) => {
    // handle form model change
  });
});
```
## Form

The [Form class]() allows you to get the current state of the Content Form as well as subscribe to changes that take place while editing. This lets you create real time visualizations that are not dependent on the content item being saved.

>Note: **These methods will only return content when the form content is valid (e.g. if a required field is missing no content will be returned).** Additionally methods are not available when the form is not visible, such as the Snapshot Browser or Edition contexts.

In addition you can set the same parameters that are available in the Delivery API, see the table below for more information.

<br/>

### Options
These options are shared between `form.get()`, `form.change()` and `form.save()`.

| key    |  description                                                                        | value              | default   | 
| ------ |  ---------------------------------------------------------------------------------- | ------------------- | --------- | 
| `format` | Either return an array of all linked content items or have the data inlined.      | `'inlined'`, `'linked'` | `'inlined'` | 
| `depth`  | Either return all linked content or just the root content item.                   | `'all'`, `'root'`       | `'all'`     | 

<br />


### form.get()

This method will retrieve the current state of the form. By default JSON is returned as a fully hydrated tree, to change this see the table above for a full list of options.

> Note: this method is only available in the Production Content Form

```typescript
const options = {
  format: 'linked'
  depth: 'all'
};

sdk.form.get(options).then(model => {
    // handle form model
});
```

### form.saved()

This method is for subscribing to the save event in the Content Form while editing. You provide a callback which will execute on every save. The method returns an unsubscribe function that when called will stop any further executions of the callback.

By default JSON is returned as a fully hydrated tree, to change this see the table above for a full list of options.

> Note: this method is only available in the Production Content Form

```typescript
const unsubscribe = sdk.form.saved((model) => {
  // handle form model
});
```

### form.changed()

This method is for subscribing to changes that happen within the Content Form while editing. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

By default JSON is returned as it would be from the Content Delivery API (CDv2), you can also choose to use the legacy JSON-LD format (CDv1). See the table above for a full list of options..

> Note: this method is only available in the Production Content Form

```typescript
const unsubscribe = sdk.form.changed((model) => {
  // handle form model
});
```
## Locale

The [Locale class]() allows you to retrieve the currently selected locale in the visualization options and watch for changes to this option.

### locale.get()

This method will retrieve the current locale selected in the visualization options. The method returns a promise that resolves either to the selected locale string e.g. `'en-GB'` or `null` if none are selected.

```typescript
const value = await sdk.locale.get();

console.log(value);
// 'en-GB'
```

### locale.changed()

This method is for subscribing to changes to the selected locale in the visualization options. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = sdk.locale.changed((model) => {
  // handle locale change
});
```

## Delivery Key

The `DeliveryKey` class allows you to retrieve the delivery key of the content item being visualized and watch for changes to this setting.

### deliveryKey.get()

This method will retrieve the current Delivery Key of the content item being visualized. The method returns a promise that resolves to the set delivery key string i.e `'carousel-home-page'` or `null` if no key is set.

```typescript
const value = await sdk.deliveryKey.get();

console.log(value);
// 'carousel-home-page'
```

### deliveryKey.changed()

This method is for subscribing to changes to the Delivery Key of the content item being visualized. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = sdk.deliveryKey.changed((model) => {
  // handle deliveryKey change
});
```
## Device

The [Device class]() allows you to retrieve the currently selected device in the visualization options and watch for changes to this option.

### device.get()

This method will retrieve the current device selected in the visualization options. The method returns a promise that resolves to the selected device.

```typescript
const device = await sdk.device.get();
```

### device.changed()

This method is for subscribing to changes to the selected device in the visualization options. You provide a callback which will execute on every change. The method returns an unsubscribe function that when called will stop any further executions of the callback.

```typescript
const unsubscribe = sdk.device.changed((model) => {
  // handle settings change
});
```
## Settings

The [Settings class]() allows you to retrieve your DC visualization settings.

### settings.get()

This method will retrieve the current visualization settings for the hub that the content item being visualized is in. The method returns a promise that resolves to a settings object.

```typescript
const settings = await sdk.settings.get();
```

```json
{
  "vse":"fasdfasdfasdf",
  "devices" : [{
    "name" : "Desktop",
    "width" : 1024,
    "height" : 768,
    "orientate" : true
  }, {
    "name" : "Tablet",
    "width" : 640,
    "height" : 768,
    "orientate" : true
  }, {
    "name" : "Mobile",
    "width" : 320,
    "height" : 512,
    "orientate" : true
  }, {
    "name" : "Desktop Large",
    "width" : 1440,
    "height" : 900,
    "orientate" : true
  }]
}
```

## Context

The [Context class]() allows you to the retrive the current context the visualisation is in.

### context.get()

This method will retrieve the current context object. The method returns a promise that resolves to a context object.

```typescript
const context = await sdk.context.get();
```

```json
{
  "contentId": "<uuid>",
  "snapshotId": "<uuid>",
  "contentTypeId": "<uri>"
}
```



