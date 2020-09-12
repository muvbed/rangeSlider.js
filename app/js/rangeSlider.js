function rangeSlider(arg) {
	if (arg.start == undefined || arg.start == null) {
		arg.start = arg.min;
	}

	if (arg.step) {
		for (let i = 0; i < arg.track.children[1].children[0].childElementCount; i++) {
			let step = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * i + arg.min),
				stepPlus = Math.ceil((((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i + 1) + arg.min) - step) / 2),
				stepMinus = Math.ceil((step - ((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i - 1) + arg.min)) / 2);
	
			if (arg.start <= (step + stepMinus) && arg.start >= (step - stepPlus)) {
				arg.thumb.style.left = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + (arg.track.children[1].children[0].children[i].clientWidth / 2) - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
				arg.track.children[1].style.width = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + (arg.track.children[1].children[0].children[i].clientWidth / 2) - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";

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

		arg.thumb.style.left = ((arg.start - arg.min) / ((arg.max - arg.min) / 100)) * (arg.track.clientWidth / 100) - arg.thumb.clientWidth / 2 + "px";
		arg.track.children[1].style.width = ((arg.start - arg.min) / ((arg.max - arg.min) / 100)) * (arg.track.clientWidth / 100) + "px";

		rangeSliderWrite(arg.start);
	}

	arg.input.addEventListener("input", () => {
		if (arg.input.value.match(/[^0-9]/)) {
			arg.input.value = arg.input.value.replace(/[^0-9]/g, "");
		}

		if (arg.input.value < arg.min) {
			arg.thumb.style.left = (0 - arg.thumb.clientWidth / 2) + 'px';
			arg.track.children[1].style.width = 0 + 'px';
		} else if (arg.input.value > arg.max) {
			arg.thumb.style.left = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
			arg.track.children[1].style.width = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
			arg.input.value = arg.max;
		} else {
			if (arg.step) {
				for (let i = 0; i < arg.track.children[1].children[0].childElementCount; i++) {
					let step = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * i + arg.min),
						stepPlus = Math.ceil((((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i + 1) + arg.min) - step) / 2),
						stepMinus = Math.ceil((step - ((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * (i - 1) + arg.min)) / 2);
			
					if (arg.input.value <= (step + stepMinus) && arg.input.value >= (step - stepPlus)) {
						arg.thumb.style.left = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + (arg.track.children[1].children[0].children[i].clientWidth / 2) - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
						arg.track.children[1].style.width = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + (arg.track.children[1].children[0].children[i].clientWidth / 2) - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2 + "px";
			
						break;
					}
				}
			} else {
				arg.thumb.style.left = ((arg.input.value - arg.min) / ((arg.max - arg.min) / 100)) * (arg.track.clientWidth / 100) - arg.thumb.clientWidth / 2 + "px";
				arg.track.children[1].style.width = ((arg.input.value - arg.min) / ((arg.max - arg.min) / 100)) * (arg.track.clientWidth / 100) + "px";
			}
		}

		rangeSliderWrite(arg.input.value);
	})

	arg.input.addEventListener("change", () => {
		if (arg.input.value == "" || arg.input.value < arg.min) {
			arg.thumb.style.left = (0 - arg.thumb.clientWidth / 2) + 'px';
			arg.track.children[1].style.width = 0 + 'px';

			rangeSliderWrite(arg.min);
		}
	})
	
	arg.thumb.addEventListener("mousedown", (e) => {
		let trackCoords = arg.track.getBoundingClientRect().left,
			thumbCoords = e.pageX - arg.thumb.getBoundingClientRect().left;
		
		document.onmousemove = (e) => {
			arg.step ? rangeSliderCycle(e.pageX - thumbCoords - trackCoords) : rangeSliderSmooth(e.pageX - thumbCoords - trackCoords);

			return false;
		}

		document.onmouseup = () => {
			document.onmousemove = document.onmouseup = null;
		};
	})

	arg.thumb.addEventListener("touchstart", (e) => {
		let trackCoords = arg.track.getBoundingClientRect().left,
			thumbCoords = e.changedTouches[0].pageX - arg.thumb.getBoundingClientRect().left;
		
		document.ontouchmove = (e) => {
			arg.step ? rangeSliderCycle(e.pageX - thumbCoords - trackCoords) : rangeSliderSmooth(e.pageX - thumbCoords - trackCoords);

			return false;
		}

		document.ontouchend = () => {
			document.ontouchmove = document.ontouchend = null;
		};
	})

	arg.track.addEventListener("click", (e) => {
		let trackCoords = arg.track.getBoundingClientRect().left;

		arg.step ? rangeSliderCycle(e.pageX - trackCoords - (arg.thumb.clientWidth / 2)) : rangeSliderSmooth(e.pageX - trackCoords - (arg.thumb.clientWidth / 2));

		return false;
	})

	function rangeSliderSmooth(newValue) {
		if (newValue < 0 - arg.thumb.clientWidth / 2) {
			arg.thumb.style.left = (0 - arg.thumb.clientWidth / 2) + 'px';
			arg.track.children[1].style.width = 0 + 'px';

			rangeSliderWrite(arg.min);
		} else if (newValue > arg.track.clientWidth - arg.thumb.clientWidth / 2) {
			arg.thumb.style.left = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';
			arg.track.children[1].style.width = arg.track.clientWidth - arg.thumb.clientWidth / 2 + 'px';

			rangeSliderWrite(arg.max);
		} else {
			arg.thumb.style.left = newValue + 'px';
			arg.track.children[1].style.width = newValue + 'px';

			rangeSliderWrite(Math.ceil(((arg.max - arg.min) / 100) * ((newValue + (arg.thumb.clientWidth / 2)) / (arg.track.clientWidth / 100)) + arg.min));
		}
	}
	
	function rangeSliderCycle(newValue) {
		for (let i = 0; i < arg.track.children[1].children[0].childElementCount; i++) {
			let semiStep = (arg.track.children[1].children[0].children[1].getBoundingClientRect().left - arg.track.children[1].children[0].children[0].getBoundingClientRect().left) / 2,
				step = arg.track.children[1].children[0].children[i].getBoundingClientRect().left + (arg.track.children[1].children[0].children[i].clientWidth / 2) - arg.track.getBoundingClientRect().left - arg.thumb.clientWidth / 2;

			if (newValue <= (step + semiStep) && newValue >= (step - semiStep)) {
				arg.thumb.style.left = step + 'px';
				step <= 0 ? arg.track.children[1].style.width = 0 + 'px' : arg.track.children[1].style.width = step + 'px';
				newValue = Math.ceil((arg.max - arg.min) / (arg.track.children[1].children[0].childElementCount - 1) * i + arg.min);

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
