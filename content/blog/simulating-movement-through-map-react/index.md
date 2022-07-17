---
title: Simulating movement through a Map using React
description: How to make things move on a map
date: "2022-07-16T00:00:00.000Z"
tags: react, google, maps, phyisics
---

Almost exactly 3 years ago, I wrote an [article](/let-s-play-with-google-maps-and-react-making-a-car-move-through-the-road-like-on-uber-part-1) explaining how to move a car on a map, like if you were an engineer at Uber. In part 1, I explained how to make the movement happen, and in part two I explained how to rotate the icon to make it look more realistic, so it always points in the direction the car is going.

I've written a lot of code since then, so I thought I'd make a series of articles explaining how I'd implement those things today. I no longer use React classes very often, I tend to use TypeScript more often, and I even wrote my own [library](https://github.com/Zerquix18/react-maps-suite) for working with maps, which I'll use for this tutorial. The end result will look like this:

<iframe src="https://codesandbox.io/embed/ecstatic-johnson-yfu8ll?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ecstatic-johnson-yfu8ll"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

  
I will cover:

* Rendering a map
* Preparing a path and its distances
* Finding the current distance
* Finding the appropiate coordinates for that distance

All with examples!

## A basic map

So let's start with a basic map. In my previous tutorial, I used a wrapper for Google Maps, but the library I wrote is a wrapper for 3 popular libraries: Google Maps, Mapbox and Leaflet. You can choose the one that fits best for your project, or you can use your own.

```npm install react-maps-suite```

Once installed, you can render a basic map. We'll render a map using Google Maps, with a default center and a zoom level of 15.

```typescript
import Maps from "react-maps-suite";

const defaultCenter = {
  lat: 18.562663708833288,
  lng: -68.3960594399559
};

const defaultZoom = 15;

function App() {
  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    />
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/frosty-chihiro-bgsbdd?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="frosty-chihiro-bgsbdd"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

The default center are the coordinates of the Punta Cana roundabout, in the Dominican Republic, and the default zoom is close to 21 which is the maximum zoom level that Google Maps allows.

## The Path

We need a path for our marker to run through. A path will be a list of coordinates (an array of lat/lng). You may already have this in your application, so you can skip to the next step.

You can generate a line with [this tool](https://www.doogal.co.uk/polylines), or we can create one manually by clicking on the map and putting together the list of coordinates. Let's add an `onClick` on the map and log the pair of latitude / longitude of that place we clicked:

```typescript
import Maps from "react-maps-suite";

const defaultCenter = {
  lat: 18.562663708833288,
  lng: -68.3960594399559
};

const defaultZoom = 15;

function App() {
  const onClick = ({ position }) => {
    console.log("clicked on", position);
  };

  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      onClick={onClick}
    />
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/affectionate-water-j0lum9?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="affectionate-water-j0lum9"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Once we have a list of coordinates, we can put them together in an array:

```typescript
import Maps from "react-maps-suite";

const defaultCenter = {
  lat: 18.562663708833288,
  lng: -68.3960594399559
};

const defaultZoom = 15;

const defaultPath = [
  { lat: 18.562093938563784, lng: -68.40836660716829 },
  { lat: 18.560995497953385, lng: -68.40230123938906 },
  { lat: 18.56022251698875, lng: -68.39839594306338 },
  { lat: 18.559408849032664, lng: -68.39431898536074 },
  { lat: 18.55916474788931, lng: -68.39187281073916 },
  { lat: 18.558920646396807, lng: -68.39049951972353 },
  { lat: 18.557984920774317, lng: -68.38942663611758 },
  { lat: 18.55794423693522, lng: -68.3884395832001 },
];

function App() {
  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    />
  );
}

export default App;
```

These coordinates are now ordered in the way we put them together, meaning that we start at index `0` and end in `path.length`. As time progresses, we need to store something to do a lookup and find where we're supposed to be (for instance time or distance). If you have times at specific coordinates you can use time, but I'll use distance for this tutorial. Let's calculate the distances for all of the coordinates from index 0:

```javascript
import Maps, { computeDistance } from "react-maps-suite";

const defaultCenter = {
  lat: 18.562663708833288,
  lng: -68.3960594399559
};

const defaultZoom = 15;

const defaultPath = [
  { lat: 18.562093938563784, lng: -68.40836660716829 },
  { lat: 18.560995497953385, lng: -68.40230123938906 },
  { lat: 18.56022251698875, lng: -68.39839594306338 },
  { lat: 18.559408849032664, lng: -68.39431898536074 },
  { lat: 18.55916474788931, lng: -68.39187281073916 },
  { lat: 18.558920646396807, lng: -68.39049951972353 },
  { lat: 18.557984920774317, lng: -68.38942663611758 },
  { lat: 18.55794423693522, lng: -68.3884395832001 }
].reduce((result, item, index, array) => {
  if (index === 0) {
    result.push({ ...item, distance: 0 });
    return result;
  }

  const { distance: lastDistance } = result[index - 1];
  const previous = array[index - 1];
  const distance = lastDistance + computeDistance(previous, item);

  result.push({ ...item, distance });
  return result;
}, []);

console.log(defaultPath);

function App() {
  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    />
  );
}

export default App;
```

<iframe src="https://codesandbox.io/embed/thirsty-voice-i0k9pn?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="thirsty-voice-i0k9pn"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Basically, index `0` will have distance 0 (we begin here), and then we add up the distances between each index. Now we can calculate the current position, since our array has distance 0 and the distance goes up progressively. This distance is calculated in **meters**.

For the sake of testing, you can draw this path on the screen using Maps.Polyline. To render things on the map, we place its subcomponents as children:

```javascript
function App() {
  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    >
      <Maps.Polyline path={defaultPath} strokeColor="#4287f5" />
    </Maps>
  );
}
```

## Calculating the current position

Our array of coordinates has distances, so we need a distance to find the progress across the path. In order to calculate a distance, you need time and speed (remember `d = v*t`?). Our speed will be hardcoded, but it can also come from your app. We can have the time in the state and a `setInterval` to make it increase every second:

```javascript
const DEFAULT_SPEED = 5; // m/s

function App() {
  const [time, setTime] = useState(0);

  const increaseTime = useCallback(() => {
    setTime(time => time + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(increaseTime, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [increaseTime]);

  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    ></Maps>
  );
}
```

Now that we have time and speed, we can calculate the distance where in at every moment:

```javascript
  const distance = DEFAULT_SPEED * time;
  console.log(distance);
```

As you can see, every second the distance goes up by 5 (check the console):

<iframe src="https://codesandbox.io/embed/naughty-ellis-rc87c3?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="naughty-ellis-rc87c3"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Now we can make a function to take a `distance` and a `path` and find the appropiate coordinates. We will have a path that looks roughly like this:

```typescript
const path = [
{ position: ..., distance : 0 }, // index = 0
{ position: ..., distance : 10 }, // index = 1
{ position: ..., distance : 20 }, // index = 2
{ position: ..., distance : 30 }, // index = 3
{ position: ..., distance : 40 }, // index = 4
];
```

If our `distance` is 25, it means we are between index `2` and `3`. **We can't use the coordinates of index `2` or `3` though**, because we already passed index 2, and we haven't reached index 3 yet. So we need to **interpolate** the current position, by calculating the progress between the two coordinates of index `2` and `3`. There's a utility function called "interpolate" that allows you to do that. Here's the full code:

```javascript
import { interpolate } from "react-maps-suite";

function getPositionAt(path, distance) {
  const indexesPassed = path.filter((position) => position.distance < distance);
  if (indexesPassed.length === 0) {
    return path[0];// starting position
  }

  const lastIndexPassed = indexesPassed.length - 1;
  const nextIndexToPass = lastIndexPassed + 1;

  const lastPosition = path[lastIndexPassed];
  const nextPosition = path[nextIndexToPass];

  if (!nextPosition) {
    return lastPosition; // distance is greater than the ones we have in the array
  }

  const progressUntilNext = // a number from 0 to 1
    (distance - lastPosition.distance) / nextPosition.distance;

  const currentPosition = interpolate(
    lastPosition,
    nextPosition,
    progressUntilNext
  );

  return currentPosition;
}
```

Now we can use the calculated position to render the items on the map. The React Maps Suite allows you to render markers using the `Maps.Marker` component. Putting it all together we should have:

```javascript
function App() {
  const [time, setTime] = useState(0);

  const increaseTime = useCallback(() => {
    setTime((time) => time + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(increaseTime, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [increaseTime]);

  const distance = DEFAULT_SPEED * time;

  const position = getPositionAt(defaultPath, distance);

  return (
    <Maps
      provider="google"
      height={400}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
    >
      <Maps.Marker position={position} />
    </Maps>
  );
}

function getPositionAt(path, distance) {
  const indexesPassed = path.filter((position) => position.distance < distance);
  if (indexesPassed.length === 0) {
    return path[0]; // starting position
  }

  const lastIndexPassed = indexesPassed.length - 1;
  const nextIndexToPass = lastIndexPassed + 1;

  const lastPosition = path[lastIndexPassed];
  const nextPosition = path[nextIndexToPass];

  if (!nextPosition) {
    return lastPosition; // distance is greater than the ones we have in the array
  }

  const progressUntilNext =
    (distance - lastPosition.distance) / nextPosition.distance;

  const currentPosition = interpolate(
    lastPosition,
    nextPosition,
    progressUntilNext
  );

  return currentPosition;
}

export default App;
```

<iframe src="https://codesandbox.io/embed/ecstatic-johnson-yfu8ll?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ecstatic-johnson-yfu8ll"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

This should make the marker render on the map and move at 5 m/s.

## Final thoughts

Playing with maps is fun! I learned all this while building a simulation engine that was running on Google Maps.

My future articles will cover:
- Customizing the icon
- Pausing, adjusting refresh rate (frames per second), speed, direction (forward or backwards), jumping in time.
- Dragging new items on to the map from a sidebar using React DnD
- Shape manipulation
- Line of sight

I hope you found this useful :)
