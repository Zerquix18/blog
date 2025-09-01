---
title: How to Use Toku's Illumass SDK to Query Pressure Data
description: Querying IoT data using Node.js
date: "2022-05-06 00:00 AST"
tags: api, toku, illumass, nodejs
---

[Toku Systems](https://www.tokusystems.com/) is an IoT company that specializes in devices to measure pressure. These devices can be placed inside tanks, pipelines, wells, etc., and they collect data at a specific interval which goes to their servers.

Typically, you can access this information by accessing their plataform, which includes a user interface presenting you the pressure, temperature and battery of each device, and charts of how those things changed over time.

The other way to access this data is through code. For this, they use the `@illumass/illumass-sdk`, an npm package, for which I did not find a lot of documentation online. The goal of this article is to give a lucky reader an overview of how to use it, and save them time.

I'm going to use a Node.js function to replicate how the communication would look, so you can copy-paste it and see what happens!

## Set up

Their SDK is an npm package called `@illumass/illumass-sdk`, so you can install it by hitting:

```sh
npm install @illumass/illumass-sdk
```

You can then import it in your code like this:

```ts
import { Illumass } from "@illumass/illumass-sdk";

const illumass = new Illumass();

async function main() {
  // ... code
}

main();

```

## Logging in

At the time of writing, it appears that the only way to log in is with a user and a password, just like you log in into their platform. There seems to be code to create API keys but no way to use them. So we'll go ahead and log in with our user and password.

```ts
import { Illumass } from "@illumass/illumass-sdk";

const EMAIL = '';
const PASSWORD = '';
const SESSION_EXPIRATION = '5m'; // this parameter is optional

const illumass = new Illumass();

async function main() {
  try {
    await illumass.connect();
    await illumass.auth.login(EMAIL, PASSWORD, SESSION_EXPIRATION);
    console.log('Successfully connected.');
  } catch (e) {
    console.log(e);
  } finally {
    illumass.disconnect();
    console.log('Disconnected.');
  }
}

main();
```

**This will FAIL if the user and password are incorrect.**

Now that you're logged in, you can start querying! Keep in mind that in order to query data, we need to have a **serial number**, which usually looks like this: TIPXXXXXX.

## Getting the latest pressure, signal strength, battery or temperature

To get the latest measurement, we need to list all measurements for the given serial number.

Here's an example to get all 4 measurements:

```ts
import { Illumass } from "@illumass/illumass-sdk";

const EMAIL = '';
const PASSWORD = '';
const SESSION_EXPIRATION = '5m'; // this parameter is optional
const SERIAL_NUMBER = 'TIPXXXXXX';

const illumass = new Illumass();

async function main() {
  try {
    await illumass.connect();
    await illumass.auth.login(EMAIL, PASSWORD, SESSION_EXPIRATION);
    console.log('Successfully connected.');

    const result = await illumass.signal.listByHolderKey(`/devices/${SERIAL_NUMBER}`);
    const pressure = result.items.find(item => item.data.signalTypeKey === '/signalTypes/processStaticPressure');
    const signalStrength = result.items.find(item => item.data.signalTypeKey === '/signalTypes/signalStrength');
    const temperature = result.items.find(item => item.data.signalTypeKey === '/signalTypes/deviceTemperature');
    const battery = result.items.find(item => item.data.signalTypeKey === '/signalTypes/batteryVoltage');

    if (pressure) {
      console.log(`Last pressure reading ${pressure.data.status.reading}kPa at ${pressure.data.status.timestamp}`);      
    }

    if (signalStrength) {
      console.log(`Last signal strength reading ${signalStrength.data.status.reading}dBa at ${signalStrength.data.status.timestamp}`);      
    }

    if (temperature) {
      console.log(`Last temperature reading ${temperature.data.status.reading}°C at ${temperature.data.status.timestamp}`);      
    }

    if (battery) {
      console.log(`Last battery reading ${battery.data.status.reading}V at ${battery.data.status.timestamp}`);      
    }

  } catch (e) {
    console.log(e);
  } finally {
    illumass.disconnect();
    console.log('Disconnected.');
  }
}

main();
```

This should always give you the information you need and it should match the platform's data!
