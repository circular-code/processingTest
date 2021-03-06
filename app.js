"use strict";
/* jshint -W117 */
/* jshint -W098 */

var global = {
  dots: [],
  counter: 0
};

function Dot (speed, width, color) {
  this.x = window.innerWidth / random(1,5);
  this.xDir = this.yDir = 1;
  this.y = window.innerHeight / random(1,5);
  this.speed = speed;
  this.width = width;
  this.radius = width / 2;
  this.color = color;
  this.destroyed = false;
}

function pushDots() {
  if (global.counter < 100) {
    global.dots.push(new Dot(random(3,5), random(5,10), 'rgba(' + floor(random(0,256)) + ',' + floor(random(0,256)) + ',' + floor(random(0,256)) + ',100)'));
    global.counter++;
  }
}

function determinePos (pos, direction, distance, axis, d) {

  d[axis + 'Dir'] = pos >= distance - d.radius ? direction = -1 :
                    pos <= 0 + d.radius ? direction = 1 :
                    direction;

  d[axis] = pos += direction * d.speed;
  return pos;
}

function checkCollision(d) {
  var collidedDots = global.dots.filter(function(dot) {
    return d !== dot && dot.destroyed === false && dist(d.x, d.y, dot.x, dot.y) <= d.radius + dot.radius;
  });

  if (collidedDots.length > 0)
    return collidedDots;
}

function absorb(dots, mainDot) {

  dots.push(mainDot);

  var radius = 0;
  var index = 0;

  for (var i = 0; i < dots.length; i++) {
    if (dots[i].radius > dots[index].radius) {
      index = i;
    }
    radius += dots[i].radius;
  }

  for (var k = 0; k < dots.length; k++) {
    if (dots[k] !== dots[index])
      dots[k].destroyed = true;
  }

  dots[index].radius = radius;
  dots[index].width = radius * 2;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {

  background('#000000');

  global.dots.forEach(function(d) {

    if (d.destroyed)
      return;

    var collidedDots = checkCollision(d);

    if (collidedDots)
      absorb(collidedDots, d);
    else
      fill(d.color);

    if (!d.destroyed)
      ellipse(determinePos(d.x, d.xDir, window.innerWidth, 'x', d), determinePos(d.y, d.yDir, window.innerHeight, 'y', d), d.width);
  });
}

setInterval(pushDots, 100);

// TODO: prevent flickering
