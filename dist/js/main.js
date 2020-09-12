"use strict";

window.onload = function () {
  rangeSlider({
    track: document.getElementById('track'),
    thumb: document.getElementById('thumb'),
    input: document.getElementById("input"),
    text: document.getElementById('text'),
    min: 1000,
    max: 5000,
    start: 1600
  });
  rangeSlider({
    track: document.getElementById('trackStep'),
    thumb: document.getElementById('thumbStep'),
    input: document.getElementById("inputStep"),
    text: document.getElementById('textStep'),
    min: 100,
    max: 190,
    start: 135,
    step: true
  });
};