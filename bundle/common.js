require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({40:[function(require,module,exports){
exports.fileNameFromPath = function (path) {
    var fileName = path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
    return fileName;
}

exports.valueInRange = function (value, min, max) {
    return Math.min(Math.max(value, min), max)
}
},{}],38:[function(require,module,exports){
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


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL2xhY2kvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9oZWxwZXIuanMiLCJEOi9Qcm9ncmFtb2svU3RhciBXYXJzIExDRy9zcmMvY2FyZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEEsTUFBTSxVQUFVLFFBQVEsY0FBYyxDQUFDLFVBQVUsQ0FBQztBQUNsRCxNQUFNLFVBQVUsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDOztBQUU1QyxNQUFNLGFBQWEsT0FBTyxjQUFjLENBQUMsVUFBVSxDQUFDO0FBQ3BELE1BQU0sV0FBVyxPQUFPLGNBQWMsQ0FBQyxjQUFjLENBQUM7QUFDdEQsTUFBTSxZQUFZLE9BQU8sY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUNsRCxNQUFNLGNBQWMsT0FBTyxjQUFjLENBQUMsaUJBQWlCLENBQUM7O0FBRTVELE1BQU0sa0JBQWtCLE9BQU8sY0FBYyxDQUFDLGVBQWUsQ0FBQztBQUM5RCxNQUFNLFdBQVcsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDOztBQUVoRCxNQUFNLFFBQVEsT0FBTyxjQUFjLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsTUFBTSxRQUFRLE9BQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQztBQUM1QyxNQUFNLE1BQU0sT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDO0FBQ3hDLE1BQU0sWUFBWSxPQUFPLGNBQWMsQ0FBQyxXQUFXLENBQUM7QUFDcEQsTUFBTSxZQUFZLE9BQU8sY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUNwRCxNQUFNLFVBQVUsT0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ2hELE1BQU0sUUFBUSxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDNUMsTUFBTSxlQUFlLE9BQU8sY0FBYyxDQUFD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QUFpQixHQUFHLFVBQVUsTUFBTSxJQUFJLEVBQUUsT0FBTyxJQUFJLEVBQUUsUUFBUSxJQUFJLEVBQUUsV0FBVyxJQUFJLEVBQUU7SUFDekYsR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLFVBQVUsTUFBTSxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7SUFDdEQsR0FBRyxJQUFJLElBQUksU0FBUyxFQUFFLFVBQVUsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUk7SUFDekQsR0FBRyxLQUFLLElBQUksU0FBUyxFQUFFLFVBQVUsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUc7SUFDM0QsR0FBRyxRQUFRLElBQUksU0FBUyxFQUFFLFVBQVUsTUFBTSxVQUFVLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxNQUFNO0NBQ3ZGOztBQUVELE1BQU0sV0FBVztJQUNiLE9BQU8saUNBQWlDO0lBQ3hDLFFBQVEsc0NBQXNDO0lBQzlDLE9BQU8sa0NBQWtDO0lBQ3pDLFFBQVEsdUNBQXVDO0lBQy9DLE9BQU8sb0NBQW9DO0lBQzNDLFFBQVEseUNBQXlDO0lBQ2pELFNBQVMsaUNBQWlDO0lBQzFDLFFBQVEscUNBQXFDO0lBQzdDLFNBQVMsaUNBQWlDO0lBQzFDLFNBQVMscUNBQXFDO0lBQzlDLFFBQVEsa0NBQWtDO0lBQzFDLFFBQVEsaUNBQWlDO0NBQzVDO0FBQ0QseUJBQXlCO0lBQ3JCLElBQUksU0FBUyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7UUFDckIsU0FBUyxNQUFNLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsT0FBTyxNQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0cy5maWxlTmFtZUZyb21QYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgIHZhciBmaWxlTmFtZSA9IHBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpLnJlcGxhY2UoL1xcLlteLy5dKyQvLCBcIlwiKTtcclxuICAgIHJldHVybiBmaWxlTmFtZTtcclxufVxyXG5cclxuZXhwb3J0cy52YWx1ZUluUmFuZ2UgPSBmdW5jdGlvbiAodmFsdWUsIG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIG1pbiksIG1heClcclxufSIsImNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJldmlldycpXHJcbmNvbnN0IGNhcmREaXYgPSBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoXCJkaXZcIilcclxuXHJcbmNvbnN0IHBpY3R1cmVJbWcgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjcGljdHVyZVwiKVxyXG5jb25zdCBjeWNsZUltZyA9IGNhcmREaXYucXVlcnlTZWxlY3RvcihcIiNjeWNsZV9pbWFnZVwiKVxyXG5jb25zdCBib3JkZXJJbWcgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjYm9yZGVyXCIpXHJcbmNvbnN0IHJlc291cmNlSW1nID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3Jlc291cmNlX2ltYWdlXCIpXHJcblxyXG5jb25zdCBjb21iYXRfaWNvbnNEaXYgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjY29tYmF0X2ljb25zXCIpXHJcbmNvbnN0IGZvcmNlRGl2ID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI2ZvcmNlXCIpXHJcblxyXG5jb25zdCBuYW1lUCA9IGNhcmREaXYucXVlcnlTZWxlY3RvcihcIiNuYW1lICNuYW1lX3RleHRcIilcclxuY29uc3QgY29zdFAgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjY29zdFwiKVxyXG5jb25zdCBocFAgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjaHBcIilcclxuY29uc3QgcmVzb3VyY2VQID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3Jlc291cmNlXCIpXHJcbmNvbnN0IHByaW9yaXR5UCA9IGNhcmREaXYucXVlcnlTZWxlY3RvcihcIiNwcmlvcml0eVwiKVxyXG5jb25zdCB0cmFpdHNQID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3RyYWl0c1wiKVxyXG5jb25zdCB0ZXh0UCA9IGNhcmREaXYucXVlcnlTZWxlY3RvcihcIiN0ZXh0XCIpXHJcbmNvbnN0IGRlc2NyaXB0aW9uUCA9IGNhcmREaXYucXVlcnlTZWxlY3RvcihcIiNkZXNjcmlwdGlvblwiKVxyXG5jb25zdCBzZXROdW1iZXJQID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3NldF9udW1iZXJcIilcclxuY29uc3Qgc2V0T3JkZXJQID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3NldF9vcmRlclwiKVxyXG5cclxuZXhwb3J0cy51cGRhdGVQcmV2aWV3ID0gZnVuY3Rpb24gKGNhcmRUeXBlLCBhZmZpbGlhdGlvbiwgdW5pdE5hbWUsIHVuaXF1ZSwgY29zdCwgZm9yY2UsIGNvbWJhdF9pY29ucywgaHAsIHJlc291cmNlLCBwcmlvcml0eSwgdHJhaXRzLCB0ZXh0LCBkZXNjcmlwdGlvbiwgcGljdHVyZSwgc2V0X251bWJlciwgc2V0X29yZGVyLCBjeWNsZV9pbWFnZSkge1xyXG4gICAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKFwib2JqZWN0aXZlXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJ1bml0XCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJlbmhhbmNlbWVudFwiKVxyXG4gICAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKFwiZXZlbnRcIilcclxuICAgIHByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZShcImZhdGVjYXJkXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJtaXNzaW9uXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoY2FyZFR5cGUpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJuZXV0cmFsXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJzaXRoXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJpbXBlcmlhbFwiKVxyXG4gICAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKFwic2N1bVwiKVxyXG4gICAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKFwic211Z2dsZXJcIilcclxuICAgIHByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZShcInJlYmVsXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJqZWRpXCIpXHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoYWZmaWxpYXRpb24pXHJcbiAgICBpZihwaWN0dXJlKSB7XHJcbiAgICAgICAgcGljdHVyZUltZy5zcmMgPSBwaWN0dXJlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBpY3R1cmVJbWcuc3JjID0gXCJkYXRhL2ltYWdlcy9ub19pbWFnZS5wbmdcIlxyXG4gICAgfVxyXG4gICAgaWYoY3ljbGVfaW1hZ2UpIHtcclxuICAgICAgICBjeWNsZUltZy5zcmMgPSBjeWNsZV9pbWFnZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjeWNsZUltZy5zcmMgPSBcImRhdGEvaW1hZ2VzL25vX2ltYWdlLnBuZ1wiXHJcbiAgICB9XHJcbiAgICBib3JkZXJJbWcuc3JjID0gXCJkYXRhL2ltYWdlcy9ib3JkZXJzL1wiICsgY2FyZFR5cGUgKyBcIi9cIiArIGFmZmlsaWF0aW9uICsgXCIucG5nXCJcclxuICAgIGlmKFtcInVuaXRcIiwgXCJlbmhhbmNlbWVudFwiXS5pbmNsdWRlcyhjYXJkVHlwZSkpIHtcclxuICAgICAgICBpZihyZXNvdXJjZSAhPT0gXCJcIiAmJiByZXNvdXJjZSAhPT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgcmVzb3VyY2VJbWcuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxyXG4gICAgICAgICAgICByZXNvdXJjZVAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc291cmNlSW1nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcclxuICAgICAgICAgICAgcmVzb3VyY2VQLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc291cmNlSW1nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcclxuICAgICAgICByZXNvdXJjZVAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxyXG4gICAgfVxyXG4gICAgY29tYmF0X2ljb25zRGl2LmlubmVySFRNTCA9IFwiXCJcclxuICAgIGlmKGNhcmRUeXBlID09PSBcInVuaXRcIikge1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjb21iYXRfaWNvbnMudW5pdDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCB1bml0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKVxyXG4gICAgICAgICAgICB1bml0LnNyYyA9IFwiZGF0YS9pbWFnZXMvY29tYmF0X2ljb25zL1wiICsgYWZmaWxpYXRpb24gKyBcIi91bml0LnBuZ1wiXHJcbiAgICAgICAgICAgIGNvbWJhdF9pY29uc0Rpdi5hcHBlbmRDaGlsZCh1bml0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY29tYmF0X2ljb25zLmJsYXN0OyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGJsYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKVxyXG4gICAgICAgICAgICBibGFzdC5zcmMgPSBcImRhdGEvaW1hZ2VzL2NvbWJhdF9pY29ucy9cIiArIGFmZmlsaWF0aW9uICsgXCIvYmxhc3QucG5nXCJcclxuICAgICAgICAgICAgY29tYmF0X2ljb25zRGl2LmFwcGVuZENoaWxkKGJsYXN0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY29tYmF0X2ljb25zLnRhY3RpY3M7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdGFjdGljcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIilcclxuICAgICAgICAgICAgdGFjdGljcy5zcmMgPSBcImRhdGEvaW1hZ2VzL2NvbWJhdF9pY29ucy9cIiArIGFmZmlsaWF0aW9uICsgXCIvdGFjdGljcy5wbmdcIlxyXG4gICAgICAgICAgICBjb21iYXRfaWNvbnNEaXYuYXBwZW5kQ2hpbGQodGFjdGljcylcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGNvbWJhdF9pY29ucy51bml0X2VkZ2U7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdW5pdF9lZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKVxyXG4gICAgICAgICAgICB1bml0X2VkZ2Uuc3JjID0gXCJkYXRhL2ltYWdlcy9jb21iYXRfaWNvbnMvXCIgKyBhZmZpbGlhdGlvbiArIFwiL3VuaXRfZWRnZS5wbmdcIlxyXG4gICAgICAgICAgICBjb21iYXRfaWNvbnNEaXYuYXBwZW5kQ2hpbGQodW5pdF9lZGdlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY29tYmF0X2ljb25zLmJsYXN0X2VkZ2U7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYmxhc3RfZWRnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIilcclxuICAgICAgICAgICAgYmxhc3RfZWRnZS5zcmMgPSBcImRhdGEvaW1hZ2VzL2NvbWJhdF9pY29ucy9cIiArIGFmZmlsaWF0aW9uICsgXCIvYmxhc3RfZWRnZS5wbmdcIlxyXG4gICAgICAgICAgICBjb21iYXRfaWNvbnNEaXYuYXBwZW5kQ2hpbGQoYmxhc3RfZWRnZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGNvbWJhdF9pY29ucy50YWN0aWNzX2VkZ2U7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdGFjdGljc19lZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKVxyXG4gICAgICAgICAgICB0YWN0aWNzX2VkZ2Uuc3JjID0gXCJkYXRhL2ltYWdlcy9jb21iYXRfaWNvbnMvXCIgKyBhZmZpbGlhdGlvbiArIFwiL3RhY3RpY3NfZWRnZS5wbmdcIlxyXG4gICAgICAgICAgICBjb21iYXRfaWNvbnNEaXYuYXBwZW5kQ2hpbGQodGFjdGljc19lZGdlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcmNlRGl2LmlubmVySFRNTCA9IFwiXCJcclxuICAgIGlmKGNhcmRUeXBlICE9PSBcIm9iamVjdGl2ZVwiKSB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZvcmNlOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGZvcmNlX2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpXHJcbiAgICAgICAgICAgIGZvcmNlX2ljb24uc3JjID0gXCJkYXRhL2ltYWdlcy9vdGhlci9mb3JjZV9pY29uLnBuZ1wiXHJcbiAgICAgICAgICAgIGZvcmNlRGl2LmFwcGVuZENoaWxkKGZvcmNlX2ljb24pXHJcbiAgICAgICAgICAgIGlmKGNhcmRUeXBlICE9PSBcIm1pc3Npb25cIikge1xyXG4gICAgICAgICAgICAgICAgZm9yY2VEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHVuaXF1ZSkge1xyXG4gICAgICAgIHByZXZpZXcuY2xhc3NMaXN0LmFkZChcInVuaXF1ZVwiKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJ1bmlxdWVcIilcclxuICAgIH1cclxuICAgIG5hbWVQLmlubmVyVGV4dCA9IHVuaXROYW1lXHJcbiAgICBjb3N0UC5pbm5lclRleHQgPSBjb3N0XHJcbiAgICBocFAuaW5uZXJUZXh0ID0gaHBcclxuICAgIHJlc291cmNlUC5pbm5lclRleHQgPSByZXNvdXJjZVxyXG4gICAgcHJpb3JpdHlQLmlubmVyVGV4dCA9IHByaW9yaXR5XHJcbiAgICB0cmFpdHNQLmlubmVyVGV4dCA9IHRyYWl0c1xyXG4gICAgdGV4dFAuaW5uZXJIVE1MID0gcGFyc2VUZXh0KHRleHQpXHJcbiAgICBkZXNjcmlwdGlvblAuaW5uZXJIVE1MID0gcGFyc2VUZXh0KGRlc2NyaXB0aW9uKVxyXG4gICAgc2V0TnVtYmVyUC5pbm5lclRleHQgPSBzZXRfbnVtYmVyXHJcbiAgICBzZXRPcmRlclAuaW5uZXJUZXh0ID0gc2V0X29yZGVyID09IFwiXCIgPyBcIlwiIDogc2V0X29yZGVyICsgXCIgb2YgNlwiXHJcbn1cclxuXHJcbmV4cG9ydHMuZ2V0UGljdHVyZVBhcmFtcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdG9wOiBwYXJzZUludChwaWN0dXJlSW1nLm9mZnNldFRvcCksXHJcbiAgICAgICAgbGVmdDogcGFyc2VJbnQocGljdHVyZUltZy5vZmZzZXRMZWZ0KSxcclxuICAgICAgICB3aWR0aDogcGFyc2VJbnQoTWF0aC5yb3VuZChwaWN0dXJlSW1nLm9mZnNldFdpZHRoIC8gY2FyZERpdi5vZmZzZXRXaWR0aCAqIDEwMCwgMCkpLFxyXG4gICAgICAgIHJvdGF0aW9uOiBwYXJzZUludChwaWN0dXJlSW1nLnN0eWxlLnRyYW5zZm9ybS5yZXBsYWNlKFwicm90YXRlKFwiLCBcIlwiKS5yZXBsYWNlKFwiZGVnKVwiLCBcIlwiKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0cy5zZXRQaWN0dXJlUGFyYW1zID0gZnVuY3Rpb24gKHRvcCA9IG51bGwsIGxlZnQgPSBudWxsLCB3aWR0aCA9IG51bGwsIHJvdGF0aW9uID0gbnVsbCkge1xyXG4gICAgaWYodG9wICE9IHVuZGVmaW5lZCkgcGljdHVyZUltZy5zdHlsZS50b3AgPSB0b3AgKyBcInB4XCJcclxuICAgIGlmKGxlZnQgIT0gdW5kZWZpbmVkKSBwaWN0dXJlSW1nLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiXHJcbiAgICBpZih3aWR0aCAhPSB1bmRlZmluZWQpIHBpY3R1cmVJbWcuc3R5bGUud2lkdGggPSB3aWR0aCArIFwiJVwiXHJcbiAgICBpZihyb3RhdGlvbiAhPSB1bmRlZmluZWQpIHBpY3R1cmVJbWcuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoXCIgKyByb3RhdGlvbiArIFwiZGVnKVwiXHJcbn1cclxuXHJcbmNvbnN0IGltYWdlS2V5ID0ge1xyXG4gICAgXCJbdV1cIjogXCJkYXRhL2ltYWdlcy90ZXh0X2ljb25zL3VuaXQucG5nXCIsXHJcbiAgICBcIlt1ZV1cIjogXCJkYXRhL2ltYWdlcy90ZXh0X2ljb25zL3VuaXRfZWRnZS5wbmdcIixcclxuICAgIFwiW2JdXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy9ibGFzdC5wbmdcIixcclxuICAgIFwiW2JlXVwiOiBcImRhdGEvaW1hZ2VzL3RleHRfaWNvbnMvYmxhc3RfZWRnZS5wbmdcIixcclxuICAgIFwiW3RdXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy90YWN0aWNzLnBuZ1wiLFxyXG4gICAgXCJbdGVdXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy90YWN0aWNzX2VkZ2UucG5nXCIsXHJcbiAgICBcIltBc2ldXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy9zaXRoLnBuZ1wiLFxyXG4gICAgXCJbQWldXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy9pbXBlcmlhbC5wbmdcIixcclxuICAgIFwiW0FzY11cIjogXCJkYXRhL2ltYWdlcy90ZXh0X2ljb25zL3NjdW0ucG5nXCIsXHJcbiAgICBcIltBc21dXCI6IFwiZGF0YS9pbWFnZXMvdGV4dF9pY29ucy9zbXVnZ2xlci5wbmdcIixcclxuICAgIFwiW0FyXVwiOiBcImRhdGEvaW1hZ2VzL3RleHRfaWNvbnMvcmViZWwucG5nXCIsXHJcbiAgICBcIltBal1cIjogXCJkYXRhL2ltYWdlcy90ZXh0X2ljb25zL2plZGkucG5nXCJcclxufVxyXG5mdW5jdGlvbiBwYXJzZVRleHQodGV4dCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG1hcmtlZC5wYXJzZSh0ZXh0KVxyXG4gICAgZm9yKGxldCBrZXkgaW4gaW1hZ2VLZXkpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZUFsbChrZXksIGA8aW1nIHNyYz1cIiR7aW1hZ2VLZXlba2V5XX1cIiAvPmApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbn0iXX0=
