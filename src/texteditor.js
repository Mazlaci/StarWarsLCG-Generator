const editorForm = document.querySelector("#editor")
const textControl = editorForm.querySelector("textarea[name=text]")
const buttonsControl = editorForm.querySelector("#text_buttons")
const boldButton = document.querySelector("#bold")
const italicButton = document.querySelector("#italic")
const newlineButton = document.querySelector("#newline")

let edgePressed = false
exports.loadButtons = function () {
    textControl.selectionStart = 0
    textControl.selectionEnd = 0

    textControl.addEventListener("keydown", (e) => {
        if(e.key === "Tab") {
            e.preventDefault()
            addToText("tab")
        } else if(e.shiftKey && e.key === "Enter") {
            e.preventDefault()
            addToText("newline")
        } /* format */ else if(e.ctrlKey && e.key === "b") {
            e.preventDefault()
            addDoubleToText("bold")
        } else if(e.ctrlKey && e.key === "i") {
            e.preventDefault()
            addDoubleToText("italic")
        } /* combat icons */ else if(e.altKey && e.key === "e") {
            e.preventDefault()
            edgePressed = true
        } else if(e.altKey && e.key === "u") {
            if(edgePressed) {
                addToText("unit_edge")
            } else {
                addToText("unit")
            }
        } else if(e.altKey && e.key === "b") {
            if(edgePressed) {
                addToText("blast_edge")
            } else {
                addToText("blast")
            }
        } else if(e.altKey && e.key === "t") {
            if(edgePressed) {
                addToText("tactics_edge")
            } else {
                addToText("tactics")
            }
        } /* affiliation */ else if(e.altKey && e.key === "1") {
            addToText("sith")
        } else if(e.altKey && e.key === "2") {
            addToText("imperial")
        } else if(e.altKey && e.key === "3") {
            addToText("scum")
        } else if(e.altKey && e.key === "4") {
            addToText("smuggler")
        } else if(e.altKey && e.key === "5") {
            addToText("rebel")
        } else if(e.altKey && e.key === "6") {
            addToText("jedi")
        }
    })
    textControl.addEventListener("keyup", (e) => {
        if(e.key === "e") {
            edgePressed = false
        }
    })

    buttonsControl.addEventListener("click", (e) => {
        if(e.target.tagName === "INPUT" && e.target.classList.contains("img")) {
            addToText(e.target.id)
        }
    })
    boldButton.addEventListener("click", (e) => {
        addDoubleToText("bold")
    })
    italicButton.addEventListener("click", (e) => {
        addDoubleToText("italic")
    })
    newlineButton.addEventListener("click", (e) => {
        addToText("newline")
    })
}

const event = new Event("input")

const textKey = {
    "unit": "[u]",
    "unit_edge": "[ue]",
    "blast": "[b]",
    "blast_edge": "[be]",
    "tactics": "[t]",
    "tactics_edge": "[te]",
    "sith": "[Asi]",
    "imperial": "[Ai]",
    "scum": "[Asc]",
    "smuggler": "[Asm]",
    "rebel": "[Ar]",
    "jedi": "[Aj]",
    "tab": "    ",
    "newline": "<br>"
}
function addToText (key) {
    let str = textKey[key] ?? ""
    let text = textControl.value
    let start = textControl.selectionStart
    let end = textControl.selectionEnd
    let before = text.substring(0, start)
    let after = text.substring(end)
    let newText = before + str + after
    textControl.value = newText
    textControl.selectionStart = start + str.length
    textControl.selectionEnd = start + str.length
    textControl.dispatchEvent(event)
}

const doubleTextKey = {
    "bold": ["**", "**"],
    "italic": ["*", "*"]
}
function addDoubleToText (key) {
    let first = doubleTextKey[key]?.[0] ?? ""
    let second = doubleTextKey[key]?.[1] ?? ""
    let text = textControl.value
    let start = textControl.selectionStart
    let end = textControl.selectionEnd
    let before = text.substring(0, start)
    let selected = text.substring(start, end)
    let after = text.substring(end)
    let newText = before + first + selected + second + after
    textControl.value = newText
    textControl.selectionStart = start + first.length
    textControl.selectionEnd = start + first.length + selected.length
    textControl.dispatchEvent(event)
}