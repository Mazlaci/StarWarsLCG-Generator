require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({39:[function(require,module,exports){
(function (global){(function (){
const {getPictureParams, setPictureParams} = require("./card")
const { valueInRange } = require("./helper")
const ValueEvent = require("./valueEvent")

const preview = document.querySelector('#preview')
const cardDiv = preview.querySelector("div")
const pictureImg = cardDiv.querySelector("#picture")

const pictureEditor = document.querySelector("#pictureEditor")
const topInputNumber = pictureEditor.querySelector("#top")
const topInputRange = pictureEditor.querySelector("#topRange")
const leftInputNumber = pictureEditor.querySelector("#left")
const leftInputRange = pictureEditor.querySelector("#leftRange")
const widthInputNumber = pictureEditor.querySelector("#width")
const widthInputRange = pictureEditor.querySelector("#widthRange")
const rotationInputNumber = pictureEditor.querySelector("#rotation")
const rotationInputRange = pictureEditor.querySelector("#rotationRange")

let moving = false
let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0

let top = new ValueEvent(0)
let left = new ValueEvent(0)
let width = new ValueEvent(100)
let rotation = new ValueEvent(0)

top.addEventListener("change", () => {
    topInputNumber.value = top.value
    topInputRange.value = top.value
    setPictureParams(top.value, left.value, width.value, rotation.value)
})
topInputNumber.addEventListener("input", () => {top.value = parseInt(topInputNumber.value)})
topInputRange.addEventListener("input", () => {top.value = parseInt(topInputRange.value)})

left.addEventListener("change", () => {
    leftInputNumber.value = left.value
    leftInputRange.value = left.value
    setPictureParams(top.value, left.value, width.value, rotation.value)
})
leftInputNumber.addEventListener("input", () => {left.value = parseInt(leftInputNumber.value)})
leftInputRange.addEventListener("input", () => {left.value = parseInt(leftInputRange.value)})

width.addEventListener("change", () => {
    widthInputNumber.value = width.value
    widthInputRange.value = width.value
    setPictureParams(top.value, left.value, width.value, rotation.value)
})
widthInputNumber.addEventListener("input", () => {width.value = parseInt(widthInputNumber.value)})
widthInputRange.addEventListener("input", () => {width.value = parseInt(widthInputRange.value)})

rotation.addEventListener("change", () => {
    rotationInputNumber.value = rotation.value
    rotationInputRange.value = rotation.value
    setPictureParams(top.value, left.value, width.value, rotation.value)
})
rotationInputNumber.addEventListener("input", () => {rotation.value = parseInt(rotationInputNumber.value)})
rotationInputRange.addEventListener("input", () => {rotation.value = parseInt(rotationInputRange.value)})

preview.addEventListener("mousedown", (e) => {
    if(e.button === 0) {
        moving = true
        preview.style.cursor = "grabbing"
        startX = e.clientX
        startY = e.clientY
        startLeft = pictureImg.offsetLeft
        startTop = pictureImg.offsetTop
        e.preventDefault()
    } else if(e.button === 1) {
        top.value = 0
        left.value = 0
        width.value = 100
        rotation.value = 0
        e.preventDefault()
    }
})

preview.addEventListener("mouseup", (e) => {
    if(e.button === 0) {
        moving = false
        preview.style.cursor = "grab"
    }
})
preview.addEventListener("mouseleave", (e) => {
    moving = false
    preview.style.cursor = "grab"
})

preview.addEventListener("mousemove", (e) => {
    if(moving) {
        left.value = valueInRange(startLeft + (e.clientX - startX), -2000, 2000)
        top.value = valueInRange(startTop + (e.clientY - startY), -2000, 2000)
    } else {
        preview.style.cursor = "grab"
    }
})

preview.addEventListener("wheel", (e) => {
    let delta = Math.round(-e.deltaY / 10, 0)
    if(!e.altKey) {
        if(delta > 0) {
            preview.style.cursor = "zoom-in"
        } else {
            preview.style.cursor = "zoom-out"
        }
        width.value = valueInRange(width.value + delta, 10, 500)
        e.preventDefault()
    } else {
        preview.style.cursor = "crosshair"
        rotation.value = (rotation.value + delta + 360) % 360
        e.preventDefault()
    }
})

global.ValueEvent = ValueEvent


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./card":38,"./helper":40,"./valueEvent":43}],43:[function(require,module,exports){
class ValueEvent extends EventTarget {
    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.setValue(value);
    }
    
    setValue(value) {
        this.#value = value;
        this.revaluate();
    }

    setValueStatic(value) {
        this.#value = value
    }

    revaluate() {
        this.dispatchEvent(new Event("change"));
    }
}

module.exports = ValueEvent
},{}]},{},[39])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9Qcm9ncmFtb2svU3RhciBXYXJzIExDRy9zcmMvZWRpdFBpY3R1cmUuanMiLCJzcmMvdmFsdWVFdmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxNQUFNLG9DQUFvQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDOUQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzVDLE1BQU0sYUFBYSxPQUFPLENBQUMsY0FBYyxDQUFDOztBQUUxQyxNQUFNLFVBQVUsUUFBUSxjQUFjLENBQUMsVUFBVSxDQUFDO0FBQ2xELE1BQU0sVUFBVSxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUM7QUFDNUMsTUFBTSxhQUFhLE9BQU8sY0FBYyxDQUFDLFVBQVUsQ0FBQzs7QUFFcEQsTUFBTSxnQkFBZ0IsUUFBUSxjQUFjLENBQUMsZ0JBQWdCLENBQUM7QUFDOUQsTUFBTSxpQkFBaUIsYUFBYSxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQzFELE1BQU0sZ0JBQWdCLGFBQWEsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUM5RCxNQUFNLGtCQUFrQixhQUFhLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDNUQsTUFBTSxpQkFBaUIsYUFBYSxjQUFjLENBQUMsWUFBWSxDQUFDO0FBQ2hFLE1BQU0sbUJBQW1CLGFBQWEsY0FBYyxDQUFDLFFBQVEsQ0FBQztBQUM5RCxNQUFNLGtCQUFrQixhQUFhLGNBQWMsQ0FBQyxhQUFhLENBQUM7QUFDbEUsTUFBTSxzQkFBc0IsYUFBYSxjQUFjLENBQUMsV0FBVyxDQUFDO0FBQ3BFLE1BQU0scUJBQXFCLGFBQWEsY0FBYyxDQUFDLGdCQUFnQixDQUFDOztBQUV4RSxJQUFJLFNBQVMsS0FBSztBQUNsQixJQUFJLFNBQVMsQ0FBQztBQUNkLElBQUksU0FBUyxDQUFDO0FBQ2QsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxXQUFXLENB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LENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFO1FBQ1YsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsT0FBTyxNQUFNLE9BQU8sR0FBRyxTQUFTO1NBQ25DLE1BQU07WUFDSCxPQUFPLE1BQU0sT0FBTyxHQUFHLFVBQVU7U0FDcEM7UUFDRCxLQUFLLE1BQU0sR0FBRyxZQUFZLENBQUMsS0FBSyxNQUFNLEdBQUcsS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFDeEQsQ0FBQyxlQUFlLEVBQUU7S0FDckIsTUFBTTtRQUNILE9BQU8sTUFBTSxPQUFPLEdBQUcsV0FBVztRQUNsQyxRQUFRLE1BQU0sR0FBRyxDQUFDLFFBQVEsTUFBTSxHQUFHLEtBQUssR0FBRyxHQUFHLElBQUksR0FBRztRQUNyRCxDQUFDLGVBQWUsRUFBRTtLQUNyQjtDQUNKLENBQUM7O0FBRUYsTUFBTSxXQUFXLEdBQUc7Ozs7OztBQ3BIcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3Qge2dldFBpY3R1cmVQYXJhbXMsIHNldFBpY3R1cmVQYXJhbXN9ID0gcmVxdWlyZShcIi4vY2FyZFwiKVxyXG5jb25zdCB7IHZhbHVlSW5SYW5nZSB9ID0gcmVxdWlyZShcIi4vaGVscGVyXCIpXHJcbmNvbnN0IFZhbHVlRXZlbnQgPSByZXF1aXJlKFwiLi92YWx1ZUV2ZW50XCIpXHJcblxyXG5jb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3ByZXZpZXcnKVxyXG5jb25zdCBjYXJkRGl2ID0gcHJldmlldy5xdWVyeVNlbGVjdG9yKFwiZGl2XCIpXHJcbmNvbnN0IHBpY3R1cmVJbWcgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjcGljdHVyZVwiKVxyXG5cclxuY29uc3QgcGljdHVyZUVkaXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGljdHVyZUVkaXRvclwiKVxyXG5jb25zdCB0b3BJbnB1dE51bWJlciA9IHBpY3R1cmVFZGl0b3IucXVlcnlTZWxlY3RvcihcIiN0b3BcIilcclxuY29uc3QgdG9wSW5wdXRSYW5nZSA9IHBpY3R1cmVFZGl0b3IucXVlcnlTZWxlY3RvcihcIiN0b3BSYW5nZVwiKVxyXG5jb25zdCBsZWZ0SW5wdXROdW1iZXIgPSBwaWN0dXJlRWRpdG9yLnF1ZXJ5U2VsZWN0b3IoXCIjbGVmdFwiKVxyXG5jb25zdCBsZWZ0SW5wdXRSYW5nZSA9IHBpY3R1cmVFZGl0b3IucXVlcnlTZWxlY3RvcihcIiNsZWZ0UmFuZ2VcIilcclxuY29uc3Qgd2lkdGhJbnB1dE51bWJlciA9IHBpY3R1cmVFZGl0b3IucXVlcnlTZWxlY3RvcihcIiN3aWR0aFwiKVxyXG5jb25zdCB3aWR0aElucHV0UmFuZ2UgPSBwaWN0dXJlRWRpdG9yLnF1ZXJ5U2VsZWN0b3IoXCIjd2lkdGhSYW5nZVwiKVxyXG5jb25zdCByb3RhdGlvbklucHV0TnVtYmVyID0gcGljdHVyZUVkaXRvci5xdWVyeVNlbGVjdG9yKFwiI3JvdGF0aW9uXCIpXHJcbmNvbnN0IHJvdGF0aW9uSW5wdXRSYW5nZSA9IHBpY3R1cmVFZGl0b3IucXVlcnlTZWxlY3RvcihcIiNyb3RhdGlvblJhbmdlXCIpXHJcblxyXG5sZXQgbW92aW5nID0gZmFsc2VcclxubGV0IHN0YXJ0WCA9IDBcclxubGV0IHN0YXJ0WSA9IDBcclxubGV0IHN0YXJ0TGVmdCA9IDBcclxubGV0IHN0YXJ0VG9wID0gMFxyXG5cclxubGV0IHRvcCA9IG5ldyBWYWx1ZUV2ZW50KDApXHJcbmxldCBsZWZ0ID0gbmV3IFZhbHVlRXZlbnQoMClcclxubGV0IHdpZHRoID0gbmV3IFZhbHVlRXZlbnQoMTAwKVxyXG5sZXQgcm90YXRpb24gPSBuZXcgVmFsdWVFdmVudCgwKVxyXG5cclxudG9wLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgdG9wSW5wdXROdW1iZXIudmFsdWUgPSB0b3AudmFsdWVcclxuICAgIHRvcElucHV0UmFuZ2UudmFsdWUgPSB0b3AudmFsdWVcclxuICAgIHNldFBpY3R1cmVQYXJhbXModG9wLnZhbHVlLCBsZWZ0LnZhbHVlLCB3aWR0aC52YWx1ZSwgcm90YXRpb24udmFsdWUpXHJcbn0pXHJcbnRvcElucHV0TnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7dG9wLnZhbHVlID0gcGFyc2VJbnQodG9wSW5wdXROdW1iZXIudmFsdWUpfSlcclxudG9wSW5wdXRSYW5nZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge3RvcC52YWx1ZSA9IHBhcnNlSW50KHRvcElucHV0UmFuZ2UudmFsdWUpfSlcclxuXHJcbmxlZnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBsZWZ0SW5wdXROdW1iZXIudmFsdWUgPSBsZWZ0LnZhbHVlXHJcbiAgICBsZWZ0SW5wdXRSYW5nZS52YWx1ZSA9IGxlZnQudmFsdWVcclxuICAgIHNldFBpY3R1cmVQYXJhbXModG9wLnZhbHVlLCBsZWZ0LnZhbHVlLCB3aWR0aC52YWx1ZSwgcm90YXRpb24udmFsdWUpXHJcbn0pXHJcbmxlZnRJbnB1dE51bWJlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge2xlZnQudmFsdWUgPSBwYXJzZUludChsZWZ0SW5wdXROdW1iZXIudmFsdWUpfSlcclxubGVmdElucHV0UmFuZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtsZWZ0LnZhbHVlID0gcGFyc2VJbnQobGVmdElucHV0UmFuZ2UudmFsdWUpfSlcclxuXHJcbndpZHRoLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgd2lkdGhJbnB1dE51bWJlci52YWx1ZSA9IHdpZHRoLnZhbHVlXHJcbiAgICB3aWR0aElucHV0UmFuZ2UudmFsdWUgPSB3aWR0aC52YWx1ZVxyXG4gICAgc2V0UGljdHVyZVBhcmFtcyh0b3AudmFsdWUsIGxlZnQudmFsdWUsIHdpZHRoLnZhbHVlLCByb3RhdGlvbi52YWx1ZSlcclxufSlcclxud2lkdGhJbnB1dE51bWJlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge3dpZHRoLnZhbHVlID0gcGFyc2VJbnQod2lkdGhJbnB1dE51bWJlci52YWx1ZSl9KVxyXG53aWR0aElucHV0UmFuZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHt3aWR0aC52YWx1ZSA9IHBhcnNlSW50KHdpZHRoSW5wdXRSYW5nZS52YWx1ZSl9KVxyXG5cclxucm90YXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICByb3RhdGlvbklucHV0TnVtYmVyLnZhbHVlID0gcm90YXRpb24udmFsdWVcclxuICAgIHJvdGF0aW9uSW5wdXRSYW5nZS52YWx1ZSA9IHJvdGF0aW9uLnZhbHVlXHJcbiAgICBzZXRQaWN0dXJlUGFyYW1zKHRvcC52YWx1ZSwgbGVmdC52YWx1ZSwgd2lkdGgudmFsdWUsIHJvdGF0aW9uLnZhbHVlKVxyXG59KVxyXG5yb3RhdGlvbklucHV0TnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7cm90YXRpb24udmFsdWUgPSBwYXJzZUludChyb3RhdGlvbklucHV0TnVtYmVyLnZhbHVlKX0pXHJcbnJvdGF0aW9uSW5wdXRSYW5nZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge3JvdGF0aW9uLnZhbHVlID0gcGFyc2VJbnQocm90YXRpb25JbnB1dFJhbmdlLnZhbHVlKX0pXHJcblxyXG5wcmV2aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgbW92aW5nID0gdHJ1ZVxyXG4gICAgICAgIHByZXZpZXcuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiXHJcbiAgICAgICAgc3RhcnRYID0gZS5jbGllbnRYXHJcbiAgICAgICAgc3RhcnRZID0gZS5jbGllbnRZXHJcbiAgICAgICAgc3RhcnRMZWZ0ID0gcGljdHVyZUltZy5vZmZzZXRMZWZ0XHJcbiAgICAgICAgc3RhcnRUb3AgPSBwaWN0dXJlSW1nLm9mZnNldFRvcFxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgfSBlbHNlIGlmKGUuYnV0dG9uID09PSAxKSB7XHJcbiAgICAgICAgdG9wLnZhbHVlID0gMFxyXG4gICAgICAgIGxlZnQudmFsdWUgPSAwXHJcbiAgICAgICAgd2lkdGgudmFsdWUgPSAxMDBcclxuICAgICAgICByb3RhdGlvbi52YWx1ZSA9IDBcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH1cclxufSlcclxuXHJcbnByZXZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcclxuICAgIGlmKGUuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgICAgbW92aW5nID0gZmFsc2VcclxuICAgICAgICBwcmV2aWV3LnN0eWxlLmN1cnNvciA9IFwiZ3JhYlwiXHJcbiAgICB9XHJcbn0pXHJcbnByZXZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKGUpID0+IHtcclxuICAgIG1vdmluZyA9IGZhbHNlXHJcbiAgICBwcmV2aWV3LnN0eWxlLmN1cnNvciA9IFwiZ3JhYlwiXHJcbn0pXHJcblxyXG5wcmV2aWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcclxuICAgIGlmKG1vdmluZykge1xyXG4gICAgICAgIGxlZnQudmFsdWUgPSB2YWx1ZUluUmFuZ2Uoc3RhcnRMZWZ0ICsgKGUuY2xpZW50WCAtIHN0YXJ0WCksIC0yMDAwLCAyMDAwKVxyXG4gICAgICAgIHRvcC52YWx1ZSA9IHZhbHVlSW5SYW5nZShzdGFydFRvcCArIChlLmNsaWVudFkgLSBzdGFydFkpLCAtMjAwMCwgMjAwMClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJldmlldy5zdHlsZS5jdXJzb3IgPSBcImdyYWJcIlxyXG4gICAgfVxyXG59KVxyXG5cclxucHJldmlldy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgKGUpID0+IHtcclxuICAgIGxldCBkZWx0YSA9IE1hdGgucm91bmQoLWUuZGVsdGFZIC8gMTAsIDApXHJcbiAgICBpZighZS5hbHRLZXkpIHtcclxuICAgICAgICBpZihkZWx0YSA+IDApIHtcclxuICAgICAgICAgICAgcHJldmlldy5zdHlsZS5jdXJzb3IgPSBcInpvb20taW5cIlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByZXZpZXcuc3R5bGUuY3Vyc29yID0gXCJ6b29tLW91dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpZHRoLnZhbHVlID0gdmFsdWVJblJhbmdlKHdpZHRoLnZhbHVlICsgZGVsdGEsIDEwLCA1MDApXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByZXZpZXcuc3R5bGUuY3Vyc29yID0gXCJjcm9zc2hhaXJcIlxyXG4gICAgICAgIHJvdGF0aW9uLnZhbHVlID0gKHJvdGF0aW9uLnZhbHVlICsgZGVsdGEgKyAzNjApICUgMzYwXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9XHJcbn0pXHJcblxyXG5nbG9iYWwuVmFsdWVFdmVudCA9IFZhbHVlRXZlbnQiLCJjbGFzcyBWYWx1ZUV2ZW50IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xyXG4gICAgI3ZhbHVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLiN2YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4jdmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJldmFsdWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlU3RhdGljKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4jdmFsdWUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldmFsdWF0ZSgpIHtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIpKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWYWx1ZUV2ZW50Il19
