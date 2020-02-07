---
title: Let's play with Google Maps and React - Making a Car move through the road, like on Uber - Part 1
description: Let's pretend you're an engineer who works at Uber.
date: "2019-06-26T00:00:00.000Z"
tags: react, google, maps, phyisics
---

Let's pretend you're an engineer who works at Uber (unless you're an engineer who works at Uber). You have the task to animate a car, moving through the road, as it reaches its destination. So you're going to use React (Uber in the web uses React). How to do it?

https://codesandbox.io/s/youthful-hermann-k3zfi


## Our tools

For this guide, I'm going to use Create React App with `react-google-maps`, which is a wrapper for the Google Maps library, so you know what to do:

`npm install react-google-maps`

## Basic map

Let's start off with a basic map. The Google Maps library can be initialized like this:

```javascript
import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap } from 'react-google-maps'

class Map extends React.Component {
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
        >
      </GoogleMap>
    )
  }
}

const MapComponent = withScriptjs(withGoogleMap(Map))

export default () => (
  <MapComponent
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px`, width: '500px' }} />}
  mapElement={<div style={{ height: `100%` }} />}
  />
)
```

https://codesandbox.io/s/unruffled-water-y81f1

I'm not going to go into the details of how to initialize `react-google-maps`, but instead I'll focus on the logic for the movement. If you want to learn how to set it up, you can [read their guide](https://tomchentw.github.io/react-google-maps/).

The main props I'm using are `defaultZoom`, which sets the zoom for Google Maps. The higher the zoom the closer to the ground, and `defaultCenter`, which sets the main geolocation for the map.

That should load a basic map at the Punta Cana's roundabout (close to where I live).

## Latitude and Longitude

Before starting to draw on the map, we need to understand what latitude and longitude are. Latitude and Longitude are units to represent a geographical location. The latitude number can go from 90 to -90, where 0 is the equator, and the longitude number can go from 180 to -180, where 0 is the primer meridian.

Basically, with the latitude you control your vertical position, with the equator in the center, and with the longitude you control your horizontal position, with the prime meridian in the center.

You don't really need to understand how coordinates work in order to manipulate Google Maps (thanks Google!). Google provides you with tools to measure distances, calculate where an object is facing and more, and you just pass them the coordinates. If you're interested in digging deeper, you can read more in [Wikipedia's article](https://en.wikipedia.org/wiki/Geographic_coordinate_system).

## Markers

A marker identifies a location on the map and usually uses the icon we all know for locations:

![](https://thepracticaldev.s3.amazonaws.com/i/zxvirf8utpydrjja0kb8.png)

A marker can be placed at a specific location, knowing its latitude and logitude. We can place a marker in the middle of the roundabout like this:


```javascript
import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps'

class Map extends React.Component {
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
        >
          <Marker position={{
            lat: 18.559024,
            lng: -68.388886,
          }} />
      </GoogleMap>
    )
  }
}

const MapComponent = withScriptjs(withGoogleMap(Map))

export default () => (
  <MapComponent
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px`, width: '500px' }} />}
  mapElement={<div style={{ height: `100%` }} />}
  />
)

```

https://codesandbox.io/s/zealous-rhodes-n9fjz


# Polyline

The Polyline component draws a line on the map based on the `path` prop, which is a list of coordinates. We can draw a straight line, using two coordinates, which would be the ends of our line.

```javascript
import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline
} from "react-google-maps";

class Map extends React.Component {
  path = [
    { lat: 18.55996, lng: -68.388832 },
    { lat: 18.558028, lng: -68.388971 }
  ];
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
      >
        <Polyline path={this.path} options={{ strokeColor: "#FF0000 " }} />
      </GoogleMap>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, width: "500px" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

```

https://codesandbox.io/s/nervous-goodall-0r4h4

We just drew a straight line across the roundabout! I wouldn't recommend doing this while driving though.

But what about a curvy line? Well, I have bad news. **Curves don't exist**. They're just a bunch of straight lines together, giving you the illusion that there is a curve. If you zoom enough, they will always become visible. So let's make a curve, by adding enough coordinates.

```javascript
import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline
} from "react-google-maps";

class Map extends React.Component {
  path = [
    { lat: 18.558908, lng: -68.389916 },
    { lat: 18.558853, lng: -68.389922 },
    { lat: 18.558375, lng: -68.389729 },
    { lat: 18.558032, lng: -68.389182 },
    { lat: 18.55805, lng: -68.388613 },
    { lat: 18.558256, lng: -68.388213 },
    { lat: 18.558744, lng: -68.387929 }
  ];
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
      >
        <Polyline path={this.path} options={{ strokeColor: "#FF0000 " }} />
      </GoogleMap>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, width: "500px" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

```

https://codesandbox.io/s/floral-glitter-1er3s

And that's how you draw a curve! By adding even more coordinates we can make the straight lines less noticeable.

## Animating

This is where the fun starts. Let's add a marker at the end of the `path`. That would represent our car and the path that it progressed.

```javascript
import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";

class Map extends React.Component {
  path = [
    { lat: 18.558908, lng: -68.389916 },
    { lat: 18.558853, lng: -68.389922 },
    { lat: 18.558375, lng: -68.389729 },
    { lat: 18.558032, lng: -68.389182 },
    { lat: 18.55805, lng: -68.388613 },
    { lat: 18.558256, lng: -68.388213 },
    { lat: 18.558744, lng: -68.387929 }
  ];
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
      >
        <Polyline path={this.path} options={{ strokeColor: "#FF0000 " }} />
        <Marker position={this.path[this.path.length - 1]} />
      </GoogleMap>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default () => (
  <MapComponent
    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px`, width: "500px" }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

```

https://codesandbox.io/s/rough-night-k2j81

Now we need to prepare the logic for our animation. We will have a bunch of straight lines and we need to place the car inside the path. We can separe the logic into 4 steps. 

1. Calculate the distances between the first point and each coordinate. **This assumes that the coordinates in the path are ordered**.
2. Set a velocity, and calculate the distance that the car has progressed over time.
3. Using the calculate distance, we can use the full path and get the path which the car passed.
4. Animate the last straight line, where the car is currently on.

### Calculating distances

Google provides us with tools to calculate distances between 2 coordinates. The function in question is `google.maps.geometry.spherical.computeDistanceBetween`

We can perform this step before mounting our component. It'll calculate the distances between each coordinate and the first element in the path:

```javascript
  componentWillMount = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 } // it begins here! 
      }
      const { lat: lat1, lng: lng1 } = coordinates
      const latLong1 = new window.google.maps.LatLng(lat1, lng1)

      const { lat: lat2, lng: lng2 } = array[0]
      const latLong2 = new window.google.maps.LatLng(lat2, lng2)

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      )

      return { ...coordinates, distance }
    })

    console.log(this.path)
  }

```

### Setting a velocity and calculating the distance every second.

Now into physics. Let's say we want our object to go 5 meters per second. To do that, we need an initial time, and a velocity. Let's console.log this distance every second.

```javascript
  velocity = 5
  initialDate = new Date()

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000 // pass to seconds
    return differentInTime * this.velocity // d = v*t -- thanks Newton!
  }

  componentDidMount = () => {
    this.interval = window.setInterval(this.consoleDistance, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  consoleDistance = () => {
    console.log(this.getDistance())
  }
```

This will console.log a number that increases by 5 every second, just like the velocity of our car.

Let's put or current progress together:

```javascript
import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Polyline, Marker } from 'react-google-maps'

class Map extends React.Component {
  path = [
    { lat: 18.558908, lng: -68.389916 },
    { lat: 18.558853, lng: -68.389922 },
    { lat: 18.558375, lng: -68.389729 },
    { lat: 18.558032, lng: -68.389182 },
    { lat: 18.558050, lng: -68.388613 },
    { lat: 18.558256, lng: -68.388213 },
    { lat: 18.558744, lng: -68.387929 },
  ]

  velocity = 5
  initialDate = new Date()

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000 // pass to seconds
    return differentInTime * this.velocity // d = v*t -- thanks Newton!
  }

  componentDidMount = () => {
    this.interval = window.setInterval(this.consoleDistance, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  consoleDistance = () => {
    console.log(this.getDistance())
  }

  componentWillMount = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 } // it begins here! 
      }
      const { lat: lat1, lng: lng1 } = coordinates
      const latLong1 = new window.google.maps.LatLng(lat1, lng1)

      const { lat: lat2, lng: lng2 } = array[0]
      const latLong2 = new window.google.maps.LatLng(lat2, lng2)

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      )

      return { ...coordinates, distance }
    })

    console.log(this.path)
  }

  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
        >
          <Polyline path={this.path} options={{ strokeColor: "#FF0000 "}} />
          <Marker position={this.path[this.path.length - 1]} />
      </GoogleMap>
    )
  }
}

const MapComponent = withScriptjs(withGoogleMap(Map))

export default () => (
  <MapComponent
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px`, width: '500px' }} />}
  mapElement={<div style={{ height: `100%` }} />}
  />
)

```

https://codesandbox.io/s/small-bird-5tibj


### Rendering the trail in real time

Now we need to render the car in real time. We have a bunch of straight lines, and the car will be within two of them. So we will move some logic to our state and update it every second.

First, let's add `progress` to our state and make our Polyline and Marker follow that state.

```javascript
  state = {
    progress: [],
  }
``` 

```javascript
  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
        >
          { this.state.progress && (
            <>
              <Polyline path={this.state.progress} options={{ strokeColor: "#FF0000 "}} />
              <Marker position={this.state.progress[this.state.progress.length - 1]} />
            </>
          )}
      </GoogleMap>
    )
  }
}
```

Now we can change or `consoleDistance` to `moveObject` and extract the part of the path that the car already passed:

```
  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000)
  }
```

```
  moveObject = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }
    const progress = this.path.filter(coordinates => coordinates.distance < distance)
    this.setState({ progress })
  }
```

Putting it all together we have:

https://codesandbox.io/s/jolly-sky-3ez0m

As you notice, the car "jumps", because we're adding the lines that were already passed, but the car is within the last element of `progress` and the remaining elements of `this.path`. So to make the animation smoother, we have to know the progress within those two lines, and then find the coordinates within those two lines. Google offers us a function to do that, found at `google.maps.geometry.spherical.interpolate`.

Completing our `moveObject` function, we have:

```javascript
  moveObject = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.path.find(coordinates => coordinates.distance > distance)
    if (! nextLine) {
      this.setState({ progress })
      return // it's the end!
    }
    const lastLine = progress[progress.length - 1]

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    )

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    )

    // distance of this line 
    const totalDistance = nextLine.distance - lastLine.distance
    const percentage = (distance - lastLine.distance) / totalDistance

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    )

    progress = progress.concat(position)
    this.setState({ progress })
  }
```

And now it looks smooth!

https://codesandbox.io/s/unruffled-robinson-l2k4p

Our result would be:

```javascript
import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Polyline, Marker } from 'react-google-maps'

class Map extends React.Component {
  state = {
    progress: [],
  }

  path = [
    { lat: 18.558908, lng: -68.389916 },
    { lat: 18.558853, lng: -68.389922 },
    { lat: 18.558375, lng: -68.389729 },
    { lat: 18.558032, lng: -68.389182 },
    { lat: 18.558050, lng: -68.388613 },
    { lat: 18.558256, lng: -68.388213 },
    { lat: 18.558744, lng: -68.387929 },
  ]

  velocity = 5
  initialDate = new Date()

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000 // pass to seconds
    return differentInTime * this.velocity // d = v*t -- thanks Newton!
  }

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  moveObject = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.path.find(coordinates => coordinates.distance > distance)
    if (! nextLine) {
      this.setState({ progress })
      return // it's the end!
    }
    const lastLine = progress[progress.length - 1]

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    )

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    )

    // distance of this line 
    const totalDistance = nextLine.distance - lastLine.distance
    const percentage = (distance - lastLine.distance) / totalDistance

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    )

    progress = progress.concat(position)
    this.setState({ progress })
  }

  componentWillMount = () => {
    this.path = this.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 } // it begins here! 
      }
      const { lat: lat1, lng: lng1 } = coordinates
      const latLong1 = new window.google.maps.LatLng(lat1, lng1)

      const { lat: lat2, lng: lng2 } = array[0]
      const latLong2 = new window.google.maps.LatLng(lat2, lng2)

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      )

      return { ...coordinates, distance }
    })

    console.log(this.path)
  }

  render = () => {
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 18.559008, lng: -68.388881 }}
        >
          { this.state.progress && (
            <>
              <Polyline path={this.state.progress} options={{ strokeColor: "#FF0000 "}} />
              <Marker position={this.state.progress[this.state.progress.length - 1]} />
            </>
          )}
      </GoogleMap>
    )
  }
}

const MapComponent = withScriptjs(withGoogleMap(Map))

export default () => (
  <MapComponent
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px`, width: '500px' }} />}
  mapElement={<div style={{ height: `100%` }} />}
  />
)

```

Now we only have to change our path and our velocity to make it look even better. This is what would change depending on the route and the driver.

With a better path (generated with [this](https://www.doogal.co.uk/polylines.php) amazing tool), at 100km/h, we have:

https://codesandbox.io/s/youthful-hermann-k3zfi

For Part 2 we will customize the car icon and make it face the direction where it's going!

Let me know if you have any questions :D 