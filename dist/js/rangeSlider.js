"use strict";

function rangeSlider(arg) {
  if (arg.start == undefined || arg.start == null) {
    arg.start = arg.min;
  }

  if (arg.step) {
    for (var i = 0; i < arg.track.children[1].children[0].childElementCount; i++) {
      var step = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * i + arg.min),
          stepPlus = Math.ceil(((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i + 1) + arg.min - step) / 2),
          stepMinus = Math.ceil((step - ((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i - 1) + arg.min)) / 2);

      if (arg.start <= step + stepMinus && arg.start >= step - stepPlus) {
        arg.thumb.style.left = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + arg.track.children[1].children[0].children[i].clientWidth / 2 - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
        arg.track.children[1].style.width = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + arg.track.children[1].children[0].children[i].clientWidth / 2 - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
        rangeSliderWrite(step);
        break;
      }
    }
  } else {
    if (arg.start < arg.min) {
      arg.start = arg.min;
    } else if (arg.start > arg.max) {
      arg.start = arg.max;
    }

    arg.thumb.style.left = (arg.start - arg.min) / ((arg.max - arg.min) / 100) * (arg.track.clientWidth / 100) - arg.thumb.clientWidth / 2 + "px";
    arg.track.children[1].style.width = (arg.start - arg.min) / ((arg.max - arg.min) / 100) * (arg.track.clientWidth / 100) + "px";
    rangeSliderWrite(arg.start);
  }

  arg.input.addEventListener("input", function () {
    if (arg.input.value.match(/[^0-9]/)) {
      arg.input.value = arg.input.value.replace(/[^0-9]/g, "");
    }

    if (arg.input.value < arg.min) {
      arg.thumb.style.left = 0 - arg.thumb.clientWidth / 2 + 'px';
      arg.track.children[1].style.width = 0 + 'px';
    } else if (arg.input.value > arg.max) {
      arg.thumb.style.left = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
      arg.track.children[1].style.width = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
      arg.input.value = arg.max;
    } else {
      if (arg.step) {
        for (var _i = 0; _i < arg.track.children[1].children[0].childElementCount; _i++) {
          var _step = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * _i + arg.min),
              _stepPlus = Math.ceil(((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (_i + 1) + arg.min - _step) / 2),
              _stepMinus = Math.ceil((_step - ((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (_i - 1) + arg.min)) / 2);

          if (arg.input.value <= _step + _stepMinus && arg.input.value >= _step - _stepPlus) {
            arg.thumb.style.left = arg.track.children[1].children[0].children[_i].getBoundingClientRect().left + arg.track.children[1].children[0].children[_i].clientWidth / 2 - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
            arg.track.children[1].style.width = arg.track.children[1].children[0].children[_i].getBoundingClientRect().left + arg.track.children[1].children[0].children[_i].clientWidth / 2 - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
            break;
          }
        }
      } else {
        arg.thumb.style.left = (arg.input.value - arg.min) / ((arg.max - arg.min) / 100) * (arg.track.clientWidth / 100) - arg.thumb.clientWidth / 2 + "px";
        arg.track.children[1].style.width = (arg.input.value - arg.min) / ((arg.max - arg.min) / 100) * (arg.track.clientWidth / 100) + "px";
      }
    }

    rangeSliderWrite(arg.input.value);
  });
  arg.input.addEventListener("change", function () {
    if (arg.input.value == "" || arg.input.value < arg.min) {
      arg.thumb.style.left = 0 - arg.thumb.clientWidth / 2 + 'px';
      arg.track.children[1].style.width = 0 + 'px';
      rangeSliderWrite(arg.min);
    }
  });
  arg.thumb.addEventListener("mousedown", function (e) {
    var trackCoords = arg.track.getBoundingClientRect().left,
        thumbCoords = e.pageX - arg.thumb.getBoundingClientRect().left;

    document.onmousemove = function (e) {
      arg.step ? rangeSliderCycle(e.pageX - thumbCoords - trackCoords) : rangeSliderSmooth(e.pageX - thumbCoords - trackCoords);
      return false;
    };

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };
  });
  arg.thumb.addEventListener("touchstart", function (e) {
    var trackCoords = arg.track.getBoundingClientRect().left,
        thumbCoords = e.changedTouches[0].pageX - arg.thumb.getBoundingClientRect().left;

    document.ontouchmove = function (e) {
      arg.step ? rangeSliderCycle(e.pageX - thumbCoords - trackCoords) : rangeSliderSmooth(e.pageX - thumbCoords - trackCoords);
      return false;
    };

    document.ontouchend = function () {
      document.ontouchmove = document.ontouchend = null;
    };
  });
  arg.track.addEventListener("click", function (e) {
    var trackCoords = arg.track.getBoundingClientRect().left;
    arg.step ? rangeSliderCycle(e.pageX - trackCoords - arg.thumb.clientWidth / 2) : rangeSliderSmooth(e.pageX - trackCoords - arg.thumb.clientWidth / 2);
    return false;
  });

  function rangeSliderSmooth(newValue) {
    if (newValue < 0 - arg.thumb.clientWidth / 2) {
      arg.thumb.style.left = 0 - arg.thumb.clientWidth / 2 + 'px';
      arg.track.children[1].style.width = 0 + 'px';
      rangeSliderWrite(arg.min);
    } else if (newValue > arg.track.clientWidth - arg.thumb.clientWidth / 2) {
      arg.thumb.style.left = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
      arg.track.children[1].style.width = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
      rangeSliderWrite(arg.max);
    } else {
      arg.thumb.style.left = newValue + 'px';
      arg.track.children[1].style.width = newValue + 'px';
      rangeSliderWrite(Math.ceil((arg.max - arg.min) / 100 * ((newValue + arg.thumb.clientWidth / 2) / (arg.track.clientWidth / 100)) + arg.min));
    }
  }

  function rangeSliderCycle(newValue) {
    for (var _i2 = 0; _i2 < arg.track.children[1].children[0].childElementCount; _i2++) {
      var semiStep = (arg.track.children[1].children[0].children[1].getBoundingClientRect().left - arg.track.children[1].children[0].children[0].getBoundingClientRect().left) / 2,
          _step2 = arg.track.children[1].children[0].children[_i2].getBoundingClientRect().left + arg.track.children[1].children[0].children[_i2].clientWidth / 2 - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2;

      if (newValue <= _step2 + semiStep && newValue >= _step2 - semiStep) {
        arg.thumb.style.left = _step2 + 'px';
        _step2 <= 0 ? arg.track.children[1].style.width = 0 + 'px' : arg.track.children[1].style.width = _step2 + 'px';
        newValue = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * _i2 + arg.min);
        rangeSliderWrite(newValue);
        break;
      }
    }
  }

  function rangeSliderWrite(newValue) {
    if (newValue.length > 1 && newValue[0] == 0) {
      newValue = newValue.replace(/^0+/, '');
    }

    newValue = String(newValue).replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");

    if (arg.text != undefined && arg.text != null) {
      arg.text.innerHTML = newValue;
    }

    arg.input.value = newValue;
  }
}