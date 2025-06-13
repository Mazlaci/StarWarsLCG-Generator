const {updatePreview, getPictureParams, setPictureParams} = require("./card")
const htmlToImage = require("html-to-image")
const download = require('downloadjs');
const fs = require('fs');
const Yaml = require('js-yaml');
const textEditor = require("./texteditor");
const { fileNameFromPath } = require("./helper");

const logging = false

const preview = document.querySelector('#preview')
const cardDiv = preview.querySelector("div")

const editorForm = document.querySelector("#editor")
const cardTypesControl = editorForm.querySelectorAll("input[name=cardType]")
const affiliationsControl = editorForm.querySelectorAll("input[name=affiliation]")
const nameControl = editorForm.querySelector("input[name=name]")
const uniqueControl = editorForm.querySelector("input[name=unique]")
const costControl = editorForm.querySelector("input[name=cost]")
const forceControl = editorForm.querySelector("input[name=force]")
const combat_iconsControl = {
    unit: editorForm.querySelector("input[name=unit]"),
    unit_edge: editorForm.querySelector("input[name=unit_edge]"),
    blast: editorForm.querySelector("input[name=blast]"),
    blast_edge: editorForm.querySelector("input[name=blast_edge]"),
    tactics: editorForm.querySelector("input[name=tactics]"),
    tactics_edge: editorForm.querySelector("input[name=tactics_edge]")
}
const hpControl = editorForm.querySelector("input[name=hp]")
const resourceControl = editorForm.querySelector("input[name=resource]")
const priorityControl = editorForm.querySelector("input[name=priority]")
const traitsControl = editorForm.querySelector("textarea[name=traits]")
const textControl = editorForm.querySelector("textarea[name=text]")
const descriptionControl = editorForm.querySelector("textarea[name=description]")
const pictureControl = editorForm.querySelector("input[name=picture]")
const set_numberControl = editorForm.querySelector("input[name=set_number]")
const set_orderControl = editorForm.querySelector("input[name=set_order]")
const cycle_imageControl = editorForm.querySelector("input[name=cycle_image]")

const generateButton = editorForm.querySelector("#generate")
const saveButton = editorForm.querySelector("#save")
const fileNameControl = editorForm.querySelector("input[name=fileName]")
const saveDataButton = editorForm.querySelector("#saveData")
const loadDataButton = editorForm.querySelector("#loadData")
const extractPictureButton = editorForm.querySelector("#extractPicture")
const extractCycleImage = editorForm.querySelector("#extractCycleImage")

const pictureEditor = document.querySelector("#pictureEditor")
const topInputNumber = pictureEditor.querySelector("#top")
const leftInputNumber = pictureEditor.querySelector("#left")
const widthInputNumber = pictureEditor.querySelector("#width")
const rotationInputNumber = pictureEditor.querySelector("#rotation")


const pictureImg = cardDiv.querySelector("#picture")
const cycleImg = cardDiv.querySelector("#cycle_image")

let cardType, affiliation, unitName, unique, cost, force, combat_icons, hp, resource, priority, traits, text, description, picture, set_number, set_order, cycle_image, fileName
cardType = "objective"
affiliation = "neutral"
unitName = ""
unique = false
cost = ""
force = 0
combat_icons = {
    unit: 0, unit_edge: 0, blast: 0, blast_edge: 0, tactics: 0, tactics_edge: 0
}
hp = ""
resource = ""
priority = ""
traits = ""
text = ""
description = ""
picture = null
picture64 = 0
set_number = ""
set_order = ""
cycle_image = null
cycle_image_64 = ""
fileName = "card"

cardTypesControl.forEach(control => {
    control.addEventListener("change", () => {
        cardType = control.id
        if (logging) console.log("cardType:", cardType)
    })
})
affiliationsControl.forEach(control => {
    control.addEventListener("change", () => {
        affiliation = control.id
        if (logging) console.log("affiliation:", affiliation)
    })
})
nameControl.addEventListener("input", () => {
    unitName = nameControl.value
    if (logging) console.log("name:", unitName)
})
uniqueControl.addEventListener("change", () => {
    unique = uniqueControl.checked
    if (logging) console.log("unique:", unique)
})
costControl.addEventListener("change", () => {
    cost = costControl.value
    if (logging) console.log("cost:", cost)
})
forceControl.addEventListener("change", () => {
    force = parseInt(forceControl.value)
    if (logging) console.log("force:", force)
})
combat_iconsControl.unit.addEventListener("change", () => {
    combat_icons.unit = parseInt(combat_iconsControl.unit.value)
    if (logging) console.log("combat_icons.unit:", combat_icons.unit)
}), combat_iconsControl.unit_edge.addEventListener("change", () => {
    combat_icons.unit_edge = parseInt(combat_iconsControl.unit_edge.value)
    if (logging) console.log("combat_icons.unit_edge:", combat_icons.unit_edge)
}), combat_iconsControl.blast.addEventListener("change", () => {
    combat_icons.blast = parseInt(combat_iconsControl.blast.value)
    if (logging) console.log("combat_icons.blast:", combat_icons.blast)
}), combat_iconsControl.blast_edge.addEventListener("change", () => {
    combat_icons.blast_edge = parseInt(combat_iconsControl.blast_edge.value)
    if (logging) console.log("combat_icons.blast_edge:", combat_icons.blast_edge)
}), combat_iconsControl.tactics.addEventListener("change", () => {
    combat_icons.tactics = parseInt(combat_iconsControl.tactics.value)
    if (logging) console.log("combat_icons.tactics:", combat_icons.tactics)
}), combat_iconsControl.tactics_edge.addEventListener("change", () => {
    combat_icons.tactics_edge = parseInt(combat_iconsControl.tactics_edge.value)
    if (logging) console.log("combat_icons.tactics_edge:", combat_icons.tactics_edge)
})
hpControl.addEventListener("change", () => {
    hp = hpControl.value
    if (logging) console.log("hp:", hp)
})
resourceControl.addEventListener("change", () => {
    resource = resourceControl.value
    if (logging) console.log("resource:", resource)
})
priorityControl.addEventListener("change", () => {
    priority = priorityControl.value
    if (logging) console.log("priority:", priority)
})
traitsControl.addEventListener("input", () => {
    traits = traitsControl.value
    if (logging) console.log("traits:", traits)
})

textControl.addEventListener("input", () => {
    text = textControl.value
    if (logging) console.log("text:", text)
})
textEditor.loadButtons()

descriptionControl.addEventListener("input", () => {
    description = descriptionControl.value
    if (logging) console.log("description:", description)
})

let pictureReader = new FileReader();
pictureReader.onloadend = function() {
    picture64 = pictureReader.result
}
pictureControl.addEventListener("change", () => {
    let files = pictureControl.files
    picture = files.length !== 0 ? URL.createObjectURL(files[0]) : null
    if(files.length !== 0) {
        pictureReader.readAsDataURL(files[0])
    } else {
        picture64 = ""
    }
    if (logging) console.log("picture:", picture)
})

set_numberControl.addEventListener("input", () => {
    set_number = set_numberControl.value
    if (logging) console.log("set_number:", set_number)
})
set_orderControl.addEventListener("change", () => {
    set_order = set_orderControl.value
    if (logging) console.log("set_order:", set_order)
})

let cycle_imageReader = new FileReader();
cycle_imageReader.onloadend = function() {
    cycle_image_64 = cycle_imageReader.result
}
cycle_imageControl.addEventListener("change", () => {
    let files = cycle_imageControl.files
    cycle_image = files.length !== 0 ? URL.createObjectURL(files[0]) : null
    if(files.length !== 0) {
        cycle_imageReader.readAsDataURL(files[0])
    } else {
        cycle_image_64 = ""
    }
    if (logging) console.log("cycle_image:", cycle_image)
})
fileNameControl.addEventListener("input", () => {
    fileName = fileNameControl.value
    if (logging) console.log("fileName:", fileName)
})

const generateCard = () => {
    preview.classList.remove("hidden")
    updatePreview(cardType, affiliation, unitName, unique, cost, force, combat_icons, hp, resource, priority, traits, text, description, picture, set_number, set_order, cycle_image)
}
const saveCard = () => {
    htmlToImage.toPng(cardDiv).then(function (dataUrl) {
        download(dataUrl, fileName + ".png")
    })
}

const saveData = () => {
    const pictureParams = getPictureParams()
    const data = {
        cardType: cardType,
        affiliation: affiliation,
        unitName: unitName,
        unique: unique,
        cost: cost,
        force: force,
        combat_icons: combat_icons,
        hp: hp,
        resource: resource,
        priority: priority,
        traits: traits,
        text: text,
        description: description,
        set_number: set_number,
        set_order: set_order,
        pictureTop: pictureParams.top,
        pictureLeft: pictureParams.left,
        pictureWidth: pictureParams.width,
        pictureRotation: pictureParams.rotation,
        picture: picture64,
        cycle_image: cycle_image_64
    }
    if (logging) console.log("data:", data)
    const dataString = Yaml.dump(data)
    download(dataString, fileName + ".swlcg")
}

const loadData = (dataObj) => {
    cardType = dataObj.cardType
    cardTypesControl.forEach(radio => {if(radio.id === cardType) radio.checked = true; else radio.checked = false; })
    affiliation = dataObj.affiliation
    affiliationsControl.forEach(radio => {if(radio.id === affiliation) radio.checked = true; else radio.checked = false; })
    affiliationsControl.value = affiliation
    unitName = dataObj.unitName
    nameControl.value = unitName
    unique = dataObj.unique
    uniqueControl.checked = unique
    cost = dataObj.cost
    costControl.value = cost
    force = dataObj.force
    forceControl.value = force
    combat_icons = dataObj.combat_icons
    combat_iconsControl.unit.value = combat_icons.unit
    combat_iconsControl.unit_edge.value = combat_icons.unit_edge
    combat_iconsControl.blast.value = combat_icons.blast
    combat_iconsControl.blast_edge.value = combat_icons.blast_edge
    combat_iconsControl.tactics.value = combat_icons.tactics
    combat_iconsControl.tactics_edge.value = combat_icons.tactics_edge
    hp = dataObj.hp
    hpControl.value = hp
    resource = dataObj.resource
    resourceControl.value = resource
    priority = dataObj.priority
    priorityControl.value = priority
    traits = dataObj.traits
    traitsControl.value = traits
    text = dataObj.text
    textControl.value = text
    description = dataObj.description
    descriptionControl.value = description
    set_number = dataObj.set_number
    set_numberControl.value = set_number
    set_order = dataObj.set_order
    set_orderControl.value = set_order
    
    picture = dataObj.picture
    picture64 = picture
    pictureControl.value = ""
    cycle_image = dataObj.cycle_image
    cycle_image_64 = cycle_image
    cycle_imageControl.value = ""
    
    topInputNumber.value = dataObj.pictureTop ?? 0
    leftInputNumber.value = dataObj.pictureLeft ?? 0
    widthInputNumber.value = dataObj.pictureWidth ?? 100
    rotationInputNumber.value = dataObj.pictureRotation ?? 0
    let inputEvent = new Event("input", {bubbles: true, cancelable: true})
    topInputNumber.dispatchEvent(inputEvent)
    leftInputNumber.dispatchEvent(inputEvent)
    widthInputNumber.dispatchEvent(inputEvent)
    rotationInputNumber.dispatchEvent(inputEvent)
}

generateButton.addEventListener("click", () => {
    generateCard()
})

saveButton.addEventListener("click", () => {
    saveCard()   
})

saveDataButton.addEventListener("click", () => {
    saveData()
})

loadDataButton.addEventListener("change", () => {
    if(loadDataButton.files.length !== 0) {
        const reader = new FileReader()
        reader.onload = function(e) {
            fileNameControl.value = fileNameFromPath(loadDataButton.value)
            fileName = fileNameControl.value
            const data = Yaml.load(reader.result)
            loadData(data)
            generateCard()
        }
        reader.readAsText(loadDataButton.files[0])
    }
})

extractPictureButton.addEventListener("click", () => {
    htmlToImage.toPng(pictureImg).then(function (dataUrl) {
        download(dataUrl, fileName + "_picture.png")
    })
})

extractCycleImage.addEventListener("click", () => {
    console.log("cycle_image:", cycleImg)
    htmlToImage.toPng(cycleImg).then(function (dataUrl) {
        download(dataUrl, fileName + "_cycle.png")
    })
})


document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        generateCard()
    } else if (e.ctrlKey && e.key === "s") {
        saveCard()
        e.preventDefault()
    } else if (e.altKey && e.key === "c") {
        saveData()
    } else if (e.altKey && e.key === "v") {
        loadDataButton.click()
    }
})