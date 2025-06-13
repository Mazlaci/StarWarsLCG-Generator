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