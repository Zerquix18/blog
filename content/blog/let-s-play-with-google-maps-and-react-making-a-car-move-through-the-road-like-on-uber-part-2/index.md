---
title: Let's play with Google Maps and React - Making a Car move through the road, like on Uber - Part 2
description: Followup.
date: "2019-07-02 00:00 AST"
tags: 
---

In my [previous article](let-s-play-with-google-maps-and-react-making-a-car-move-through-the-road-like-on-uber-part-1), I explained how to make a marker move through Google Maps. In this one, I'd like to explain how to customize the icon and make it face the direction it's going on the road.

Here's where we left:

https://codesandbox.io/s/youthful-hermann-k3zfi

# Customizing the icon

In order to customize the icon, we need to use the `icon` property, which allows us to set the url, size and anchor.

```javascript
    const icon = {
      url: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png',
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: { x: 10, y: 10 }
    }
```

The `url` prop is a link to the image. If it has a transparent background, much better.
The `scaledSize` prop will scale the image. In this case, to 20x20 pixels (where the first parameter is the width and the second is the height). In addition, the `size` prop can be used, but it won't scale the image proportionally.
The `anchor` image will determine specifically where in that point the image will be displayed. Picture this as a Cardesian coordinate system, where the center is your lat/long, and you can move the marker using the `x` and `y` keys. Now the car appears on the road!

https://codesandbox.io/s/beautiful-bhabha-mvr2q

## Orientation

Now we need to make the car face the direction where it's headed. Right now, it does move, but it still look kinda static, right?

I apologize in advance, but I'm about to show you a hack. The Google Maps SDK for Javascript doesn't have a property where you can change the rotation of the marker. Instead, you'll have to modify the image and rotate it with CSS. Not very funny, but it's not that bad!

### The degrees

Before rotating, we need to calculate how much we should rotate the image in degrees. The [image that I'm using](https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png) already has 90 degrees of rotation, so that needs to be taken into consideration. Google has a function that does the job for us. It's `window.google.maps.geometry.spherical.computeHeading`.

As a reminder, we're rendering the car, which is between two lines, so we will use those two lines to determine where it's headed.

As a second reminder, we will update the marker's CSS, so we need to use `componentDidUpdate` to update the marker once its position has been set.

```javascript
  componentDidUpdate = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.path.find(coordinates => coordinates.distance > distance)

    let point1, point2

    if (nextLine) {
      point1 = progress[progress.length -1]
      point2 = nextLine
    } else {
      // it's the end, so use the latest 2
      point1 = progress[progress.length - 2]
      point2 = progress[progress.length - 1]
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng)
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng)

    const angle = window.google.maps.geometry.spherical.computeHeading(point1LatLng, point2LatLng)
    console.log(angle)
  }
```

Now we need to find the marker's element and rotate it. Remembering that the marker already had 90 degrees of rotation.

```javascript
  componentDidUpdate = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.path.find(coordinates => coordinates.distance > distance)

    let point1, point2

    if (nextLine) {
      point1 = progress[progress.length -1]
      point2 = nextLine
    } else {
      // it's the end, so use the latest 2
      point1 = progress[progress.length - 2]
      point2 = progress[progress.length - 1]
    }

    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng)
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng)

    const angle = window.google.maps.geometry.spherical.computeHeading(point1LatLng, point2LatLng)
    const actualAngle = angle - 90

    const markerUrl = 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png'
    const marker = document.querySelector(`[src="${markerUrl}"]`)

    if (marker) { // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`
    }

  }

}
```

https://codesandbox.io/s/blissful-silence-ibo7c

Thank you for reading! 
