const preview = document.querySelector('#preview')
const cardDiv = preview.querySelector("div")

const pictureImg = cardDiv.querySelector("#picture")
const cycleImg = cardDiv.querySelector("#cycle_image")
const borderImg = cardDiv.querySelector("#border")
const resourceImg = cardDiv.querySelector("#resource_image")

const combat_iconsDiv = cardDiv.querySelector("#combat_icons")
const forceDiv = cardDiv.querySelector("#force")

const nameP = cardDiv.querySelector("#name #name_text")
const costP = cardDiv.querySelector("#cost")
const hpP = cardDiv.querySelector("#hp")
const resourceP = cardDiv.querySelector("#resource")
const priorityP = cardDiv.querySelector("#priority")
const traitsP = cardDiv.querySelector("#traits")
const textP = cardDiv.querySelector("#text")
const descriptionP = cardDiv.querySelector("#description")
const setNumberP = cardDiv.querySelector("#set_number")
const setOrderP = cardDiv.querySelector("#set_order")

exports.updatePreview = function (cardType, affiliation, unitName, unique, cost, force, combat_icons, hp, resource, priority, traits, text, description, picture, set_number, set_order, cycle_image) {
    preview.classList.remove("objective")
    preview.classList.remove("unit")
    preview.classList.remove("enhancement")
    preview.classList.remove("event")
    preview.classList.remove("fatecard")
    preview.classList.remove("mission")
    preview.classList.add(cardType)
    preview.classList.remove("neutral")
    preview.classList.remove("sith")
    preview.classList.remove("imperial")
    preview.classList.remove("scum")
    preview.classList.remove("smuggler")
    preview.classList.remove("rebel")
    preview.classList.remove("jedi")
    preview.classList.add(affiliation)
    if(picture) {
        pictureImg.src = picture
    } else {
        pictureImg.src = "data/images/no_image.png"
    }
    if(cycle_image) {
        cycleImg.src = cycle_image
    } else {
        cycleImg.src = "data/images/no_image.png"
    }
    borderImg.src = "data/images/borders/" + cardType + "/" + affiliation + ".png"
    if(["unit", "enhancement"].includes(cardType)) {
        if(resource !== "" && resource !== "0") {
            resourceImg.classList.remove("hidden")
            resourceP.classList.remove("hidden")
        } else {
            resourceImg.classList.add("hidden")
            resourceP.classList.add("hidden")
        }
    } else {
        resourceImg.classList.add("hidden")
        resourceP.classList.remove("hidden")
    }
    combat_iconsDiv.innerHTML = ""
    if(cardType === "unit") {
        for(let i = 0; i < combat_icons.unit; i++) {
            let unit = document.createElement("img")
            unit.src = "data/images/combat_icons/" + affiliation + "/unit.png"
            combat_iconsDiv.appendChild(unit)
        }
        for(let i = 0; i < combat_icons.blast; i++) {
            let blast = document.createElement("img")
            blast.src = "data/images/combat_icons/" + affiliation + "/blast.png"
            combat_iconsDiv.appendChild(blast)
        }
        for(let i = 0; i < combat_icons.tactics; i++) {
            let tactics = document.createElement("img")
            tactics.src = "data/images/combat_icons/" + affiliation + "/tactics.png"
            combat_iconsDiv.appendChild(tactics)
        }
        for(let i = 0; i < combat_icons.unit_edge; i++) {
            let unit_edge = document.createElement("img")
            unit_edge.src = "data/images/combat_icons/" + affiliation + "/unit_edge.png"
            combat_iconsDiv.appendChild(unit_edge)
        }
        for(let i = 0; i < combat_icons.blast_edge; i++) {
            let blast_edge = document.createElement("img")
            blast_edge.src = "data/images/combat_icons/" + affiliation + "/blast_edge.png"
            combat_iconsDiv.appendChild(blast_edge)
        }
        for(let i = 0; i < combat_icons.tactics_edge; i++) {
            let tactics_edge = document.createElement("img")
            tactics_edge.src = "data/images/combat_icons/" + affiliation + "/tactics_edge.png"
            combat_iconsDiv.appendChild(tactics_edge)
        }
    }
    forceDiv.innerHTML = ""
    if(cardType !== "objective") {
        for(let i = 0; i < force; i++) {
            let force_icon = document.createElement("img")
            force_icon.src = "data/images/other/force_icon.png"
            forceDiv.appendChild(force_icon)
            if(cardType !== "mission") {
                forceDiv.appendChild(document.createElement("br"))
            }
        }
    }
    if (unique) {
        preview.classList.add("unique")
    } else {
        preview.classList.remove("unique")
    }
    nameP.innerText = unitName
    costP.innerText = cost
    hpP.innerText = hp
    resourceP.innerText = resource
    priorityP.innerText = priority
    traitsP.innerText = traits
    textP.innerHTML = parseText(text)
    descriptionP.innerHTML = parseText(description)
    setNumberP.innerText = set_number
    setOrderP.innerText = set_order == "" ? "" : set_order + " of 6"
}

exports.getPictureParams = function () {
    return {
        top: parseInt(pictureImg.offsetTop),
        left: parseInt(pictureImg.offsetLeft),
        width: parseInt(Math.round(pictureImg.offsetWidth / cardDiv.offsetWidth * 100, 0)),
        rotation: parseInt(pictureImg.style.transform.replace("rotate(", "").replace("deg)", ""))
    }
}

exports.setPictureParams = function (top = null, left = null, width = null, rotation = null) {
    if(top != undefined) pictureImg.style.top = top + "px"
    if(left != undefined) pictureImg.style.left = left + "px"
    if(width != undefined) pictureImg.style.width = width + "%"
    if(rotation != undefined) pictureImg.style.transform = "rotate(" + rotation + "deg)"
}

const imageKey = {
    "[u]": "data/images/text_icons/unit.png",
    "[ue]": "data/images/text_icons/unit_edge.png",
    "[b]": "data/images/text_icons/blast.png",
    "[be]": "data/images/text_icons/blast_edge.png",
    "[t]": "data/images/text_icons/tactics.png",
    "[te]": "data/images/text_icons/tactics_edge.png",
    "[Asi]": "data/images/text_icons/sith.png",
    "[Ai]": "data/images/text_icons/imperial.png",
    "[Asc]": "data/images/text_icons/scum.png",
    "[Asm]": "data/images/text_icons/smuggler.png",
    "[Ar]": "data/images/text_icons/rebel.png",
    "[Aj]": "data/images/text_icons/jedi.png"
}
function parseText(text) {
    let result = marked.parse(text)
    for(let key in imageKey) {
        result = result.replaceAll(key, `<img src="${imageKey[key]}" />`)
    }
    return result
}