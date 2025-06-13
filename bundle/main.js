require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({41:[function(require,module,exports){
const {updatePreview, getPictureParams, setPictureParams} = require("./card")
const htmlToImage = require("html-to-image")
const download = require('downloadjs');

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


},{"./card":38,"./helper":40,"./texteditor":42,"downloadjs":2,"html-to-image":10,"js-yaml":13}],42:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
'use strict';


var loader = require('./lib/loader');
var dumper = require('./lib/dumper');


function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' +
      'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}


module.exports.Type                = require('./lib/type');
module.exports.Schema              = require('./lib/schema');
module.exports.FAILSAFE_SCHEMA     = require('./lib/schema/failsafe');
module.exports.JSON_SCHEMA         = require('./lib/schema/json');
module.exports.CORE_SCHEMA         = require('./lib/schema/core');
module.exports.DEFAULT_SCHEMA      = require('./lib/schema/default');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.dump                = dumper.dump;
module.exports.YAMLException       = require('./lib/exception');

// Re-export all types in case user wants to create custom schema
module.exports.types = {
  binary:    require('./lib/type/binary'),
  float:     require('./lib/type/float'),
  map:       require('./lib/type/map'),
  null:      require('./lib/type/null'),
  pairs:     require('./lib/type/pairs'),
  set:       require('./lib/type/set'),
  timestamp: require('./lib/type/timestamp'),
  bool:      require('./lib/type/bool'),
  int:       require('./lib/type/int'),
  merge:     require('./lib/type/merge'),
  omap:      require('./lib/type/omap'),
  seq:       require('./lib/type/seq'),
  str:       require('./lib/type/str')
};

// Removed functions from JS-YAML 3.0.x
module.exports.safeLoad            = renamed('safeLoad', 'load');
module.exports.safeLoadAll         = renamed('safeLoadAll', 'loadAll');
module.exports.safeDump            = renamed('safeDump', 'dump');

},{"./lib/dumper":15,"./lib/exception":16,"./lib/loader":17,"./lib/schema":18,"./lib/schema/core":19,"./lib/schema/default":20,"./lib/schema/failsafe":21,"./lib/schema/json":22,"./lib/type":24,"./lib/type/binary":25,"./lib/type/bool":26,"./lib/type/float":27,"./lib/type/int":28,"./lib/type/map":29,"./lib/type/merge":30,"./lib/type/null":31,"./lib/type/omap":32,"./lib/type/pairs":33,"./lib/type/seq":34,"./lib/type/set":35,"./lib/type/str":36,"./lib/type/timestamp":37}],17:[function(require,module,exports){
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var makeSnippet         = require('./snippet');
var DEFAULT_SCHEMA      = require('./schema/default');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy    = options['legacy']    || false;

  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  var mark = {
    name:     state.filename,
    buffer:   state.input.slice(0, -1), // omit trailing \0
    position: state.position,
    line:     state.line,
    column:   state.position - state.lineStart
  };

  mark.snippet = makeSnippet(mark);

  return new YAMLException(message, mark);
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
  startLine, startLineStart, startPos) {

  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _lineStart,
      _pos,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = Object.create(null),
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C/* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }

  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }

    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];

      if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];

      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }

    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }

    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }

    if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  var nullpos = input.indexOf('\0');

  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }

  var documents = loadDocuments(input, options);

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


module.exports.loadAll = loadAll;
module.exports.load    = load;

},{"./common":14,"./exception":16,"./schema/default":20,"./snippet":23}],23:[function(require,module,exports){
'use strict';


var common = require('./common');


// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }

  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }

  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}


function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}


function makeSnippet(mark, options) {
  options = Object.create(options || null);

  if (!mark.buffer) return null;

  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent      !== 'number') options.indent      = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

  var re = /\r?\n|\r|\0/g;
  var lineStarts = [ 0 ];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;

  while ((match = re.exec(mark.buffer))) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);

    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }

  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

  var result = '', i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n' + result;
  }

  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
    ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
  }

  return result.replace(/\n$/, '');
}


module.exports = makeSnippet;

},{"./common":14}],15:[function(require,module,exports){
'use strict';

/*eslint-disable no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var DEFAULT_SCHEMA      = require('./schema/default');

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_BOM                  = 0xFEFF;
var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


var QUOTING_TYPE_SINGLE = 1,
    QUOTING_TYPE_DOUBLE = 2;

function State(options) {
  this.schema        = options['schema'] || DEFAULT_SCHEMA;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;
  this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes   = options['forceQuotes'] || false;
  this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c)
    && c !== CHAR_BOM
    // - b-char
    && c !== CHAR_CARRIAGE_RETURN
    && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    inblock ? // c = flow-in
      cIsNsCharOrWhitespace
      : cIsNsCharOrWhitespace
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
  )
    // ns-plain-char
    && c !== CHAR_SHARP // false on '#'
    && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
    || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
    || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_EQUALS
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
  testAmbiguousType, quotingType, forceQuotes, inblock) {

  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0))
          && isPlainSafeLast(codePointAt(string, string.length - 1));

  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
      }
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
      testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;

  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];

    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) ||
        (typeof value === 'undefined' &&
         writeNode(state, level, null, false, false))) {

      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) ||
        (typeof value === 'undefined' &&
         writeNode(state, level + 1, null, true, true, false, true))) {

      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {

    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';

    if (state.condenseFlow) pairBuffer += '"';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(
        state.tag[0] === '!' ? state.tag.slice(1) : state.tag
      ).replace(/!/g, '%21');

      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }

      state.dump = tagStr + ' ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  var value = input;

  if (state.replacer) {
    value = state.replacer.call({ '': value }, '', value);
  }

  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

  return '';
}

module.exports.dump = dump;

},{"./common":14,"./exception":16,"./schema/default":20}],20:[function(require,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


module.exports = require('./core').extend({
  implicit: [
    require('../type/timestamp'),
    require('../type/merge')
  ],
  explicit: [
    require('../type/binary'),
    require('../type/omap'),
    require('../type/pairs'),
    require('../type/set')
  ]
});

},{"../type/binary":25,"../type/merge":30,"../type/omap":32,"../type/pairs":33,"../type/set":35,"../type/timestamp":37,"./core":19}],37:[function(require,module,exports){
'use strict';

var Type = require('../type');

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":24}],35:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

},{"../type":24}],33:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":24}],32:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

},{"../type":24}],30:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

},{"../type":24}],25:[function(require,module,exports){
'use strict';

/*eslint-disable no-bitwise*/


var Type = require('../type');


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(obj) {
  return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":24}],19:[function(require,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


module.exports = require('./json');

},{"./json":22}],22:[function(require,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


module.exports = require('./failsafe').extend({
  implicit: [
    require('../type/null'),
    require('../type/bool'),
    require('../type/int'),
    require('../type/float')
  ]
});

},{"../type/bool":26,"../type/float":27,"../type/int":28,"../type/null":31,"./failsafe":21}],31:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});

},{"../type":24}],28:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'o') {
      // base 8
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  return true;
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch;

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":14,"../type":24}],27:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":14,"../type":24}],26:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":24}],21:[function(require,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  explicit: [
    require('../type/str'),
    require('../type/seq'),
    require('../type/map')
  ]
});

},{"../schema":18,"../type/map":29,"../type/seq":34,"../type/str":36}],36:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});

},{"../type":24}],34:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});

},{"../type":24}],29:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});

},{"../type":24}],18:[function(require,module,exports){
'use strict';

/*eslint-disable max-len*/

var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  return this.extend(definition);
}


Schema.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof Type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new YAMLException('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type.multi) {
      throw new YAMLException('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type) {
    if (!(type instanceof Type)) {
      throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


module.exports = Schema;

},{"./exception":16,"./type":24}],24:[function(require,module,exports){
'use strict';

var YAMLException = require('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'multi',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'representName',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options       = options; // keep original options in case user wants to extend this type later
  this.tag           = tag;
  this.kind          = options['kind']          || null;
  this.resolve       = options['resolve']       || function () { return true; };
  this.construct     = options['construct']     || function (data) { return data; };
  this.instanceOf    = options['instanceOf']    || null;
  this.predicate     = options['predicate']     || null;
  this.represent     = options['represent']     || null;
  this.representName = options['representName'] || null;
  this.defaultStyle  = options['defaultStyle']  || null;
  this.multi         = options['multi']         || false;
  this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":16}],16:[function(require,module,exports){
// YAML error class. http://stackoverflow.com/questions/8458984
//
'use strict';


function formatError(exception, compact) {
  var where = '', message = exception.reason || '(unknown reason)';

  if (!exception.mark) return message;

  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }

  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }

  return message + ' ' + where;
}


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};


module.exports = YAMLException;

},{}],14:[function(require,module,exports){
'use strict';


function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontEmbedCSS = exports.toBlob = exports.toJpeg = exports.toPng = exports.toPixelData = exports.toCanvas = exports.toSvg = void 0;
var clone_node_1 = require("./clone-node");
var embed_images_1 = require("./embed-images");
var apply_style_1 = require("./apply-style");
var embed_webfonts_1 = require("./embed-webfonts");
var util_1 = require("./util");
function toSvg(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, clonedNode, datauri;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, (0, clone_node_1.cloneNode)(node, options, true)];
                case 1:
                    clonedNode = (_b.sent());
                    return [4 /*yield*/, (0, embed_webfonts_1.embedWebFonts)(clonedNode, options)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, embed_images_1.embedImages)(clonedNode, options)];
                case 3:
                    _b.sent();
                    (0, apply_style_1.applyStyle)(clonedNode, options);
                    return [4 /*yield*/, (0, util_1.nodeToDataURL)(clonedNode, width, height)];
                case 4:
                    datauri = _b.sent();
                    return [2 /*return*/, datauri];
            }
        });
    });
}
exports.toSvg = toSvg;
function toCanvas(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, svg, img, canvas, context, ratio, canvasWidth, canvasHeight;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, toSvg(node, options)];
                case 1:
                    svg = _b.sent();
                    return [4 /*yield*/, (0, util_1.createImage)(svg)];
                case 2:
                    img = _b.sent();
                    canvas = document.createElement('canvas');
                    context = canvas.getContext('2d');
                    ratio = options.pixelRatio || (0, util_1.getPixelRatio)();
                    canvasWidth = options.canvasWidth || width;
                    canvasHeight = options.canvasHeight || height;
                    canvas.width = canvasWidth * ratio;
                    canvas.height = canvasHeight * ratio;
                    if (!options.skipAutoScale) {
                        (0, util_1.checkCanvasDimensions)(canvas);
                    }
                    canvas.style.width = "".concat(canvasWidth);
                    canvas.style.height = "".concat(canvasHeight);
                    if (options.backgroundColor) {
                        context.fillStyle = options.backgroundColor;
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    return [2 /*return*/, canvas];
            }
        });
    });
}
exports.toCanvas = toCanvas;
function toPixelData(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, width, height, canvas, ctx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
                    return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _b.sent();
                    ctx = canvas.getContext('2d');
                    return [2 /*return*/, ctx.getImageData(0, 0, width, height).data];
            }
        });
    });
}
exports.toPixelData = toPixelData;
function toPng(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [2 /*return*/, canvas.toDataURL()];
            }
        });
    });
}
exports.toPng = toPng;
function toJpeg(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [2 /*return*/, canvas.toDataURL('image/jpeg', options.quality || 1)];
            }
        });
    });
}
exports.toJpeg = toJpeg;
function toBlob(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toCanvas(node, options)];
                case 1:
                    canvas = _a.sent();
                    return [4 /*yield*/, (0, util_1.canvasToBlob)(canvas)];
                case 2:
                    blob = _a.sent();
                    return [2 /*return*/, blob];
            }
        });
    });
}
exports.toBlob = toBlob;
function getFontEmbedCSS(node, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, embed_webfonts_1.getWebFontCSS)(node, options)];
        });
    });
}
exports.getFontEmbedCSS = getFontEmbedCSS;

},{"./apply-style":3,"./clone-node":4,"./embed-images":7,"./embed-webfonts":9,"./util":12}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedWebFonts = exports.getWebFontCSS = void 0;
var util_1 = require("./util");
var dataurl_1 = require("./dataurl");
var embed_resources_1 = require("./embed-resources");
var cssFetchCache = {};
function fetchCSS(url) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, res, cssText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = cssFetchCache[url];
                    if (cache != null) {
                        return [2 /*return*/, cache];
                    }
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    cssText = _a.sent();
                    cache = { url: url, cssText: cssText };
                    cssFetchCache[url] = cache;
                    return [2 /*return*/, cache];
            }
        });
    });
}
function embedFonts(data, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cssText, regexUrl, fontLocs, loadFonts;
        var _this = this;
        return __generator(this, function (_a) {
            cssText = data.cssText;
            regexUrl = /url\(["']?([^"')]+)["']?\)/g;
            fontLocs = cssText.match(/url\([^)]+\)/g) || [];
            loadFonts = fontLocs.map(function (loc) { return __awaiter(_this, void 0, void 0, function () {
                var url;
                return __generator(this, function (_a) {
                    url = loc.replace(regexUrl, '$1');
                    if (!url.startsWith('https://')) {
                        url = new URL(url, data.url).href;
                    }
                    return [2 /*return*/, (0, dataurl_1.fetchAsDataURL)(url, options.fetchRequestInit, function (_a) {
                            var result = _a.result;
                            cssText = cssText.replace(loc, "url(".concat(result, ")"));
                            return [loc, result];
                        })];
                });
            }); });
            return [2 /*return*/, Promise.all(loadFonts).then(function () { return cssText; })];
        });
    });
}
function parseCSS(source) {
    if (source == null) {
        return [];
    }
    var result = [];
    var commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    // strip out comments
    var cssText = source.replace(commentsRegex, '');
    // eslint-disable-next-line prefer-regex-literals
    var keyframesRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        var matches = keyframesRegex.exec(cssText);
        if (matches === null) {
            break;
        }
        result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, '');
    var importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    // to match css & media queries together
    var combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]' +
        '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})';
    // unified regex
    var unifiedRegex = new RegExp(combinedCSSRegex, 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        var matches = importRegex.exec(cssText);
        if (matches === null) {
            matches = unifiedRegex.exec(cssText);
            if (matches === null) {
                break;
            }
            else {
                importRegex.lastIndex = unifiedRegex.lastIndex;
            }
        }
        else {
            unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
    }
    return result;
}
function getCSSRules(styleSheets, options) {
    return __awaiter(this, void 0, void 0, function () {
        var ret, deferreds;
        return __generator(this, function (_a) {
            ret = [];
            deferreds = [];
            // First loop inlines imports
            styleSheets.forEach(function (sheet) {
                if ('cssRules' in sheet) {
                    try {
                        (0, util_1.toArray)(sheet.cssRules || []).forEach(function (item, index) {
                            if (item.type === CSSRule.IMPORT_RULE) {
                                var importIndex_1 = index + 1;
                                var url = item.href;
                                var deferred = fetchCSS(url)
                                    .then(function (metadata) { return embedFonts(metadata, options); })
                                    .then(function (cssText) {
                                    return parseCSS(cssText).forEach(function (rule) {
                                        try {
                                            sheet.insertRule(rule, rule.startsWith('@import')
                                                ? (importIndex_1 += 1)
                                                : sheet.cssRules.length);
                                        }
                                        catch (error) {
                                            console.error('Error inserting rule from remote css', {
                                                rule: rule,
                                                error: error,
                                            });
                                        }
                                    });
                                })
                                    .catch(function (e) {
                                    console.error('Error loading remote css', e.toString());
                                });
                                deferreds.push(deferred);
                            }
                        });
                    }
                    catch (e) {
                        var inline_1 = styleSheets.find(function (a) { return a.href == null; }) || document.styleSheets[0];
                        if (sheet.href != null) {
                            deferreds.push(fetchCSS(sheet.href)
                                .then(function (metadata) { return embedFonts(metadata, options); })
                                .then(function (cssText) {
                                return parseCSS(cssText).forEach(function (rule) {
                                    inline_1.insertRule(rule, sheet.cssRules.length);
                                });
                            })
                                .catch(function (err) {
                                console.error('Error loading remote stylesheet', err.toString());
                            }));
                        }
                        console.error('Error inlining remote css file', e.toString());
                    }
                }
            });
            return [2 /*return*/, Promise.all(deferreds).then(function () {
                    // Second loop parses rules
                    styleSheets.forEach(function (sheet) {
                        if ('cssRules' in sheet) {
                            try {
                                (0, util_1.toArray)(sheet.cssRules || []).forEach(function (item) {
                                    ret.push(item);
                                });
                            }
                            catch (e) {
                                console.error("Error while reading CSS rules from ".concat(sheet.href), e.toString());
                            }
                        }
                    });
                    return ret;
                })];
        });
    });
}
function getWebFontRules(cssRules) {
    return cssRules
        .filter(function (rule) { return rule.type === CSSRule.FONT_FACE_RULE; })
        .filter(function (rule) { return (0, embed_resources_1.shouldEmbed)(rule.style.getPropertyValue('src')); });
}
function parseWebFontRules(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        var styleSheets, cssRules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (node.ownerDocument == null) {
                        throw new Error('Provided element is not within a Document');
                    }
                    styleSheets = (0, util_1.toArray)(node.ownerDocument.styleSheets);
                    return [4 /*yield*/, getCSSRules(styleSheets, options)];
                case 1:
                    cssRules = _a.sent();
                    return [2 /*return*/, getWebFontRules(cssRules)];
            }
        });
    });
}
function getWebFontCSS(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        var rules, cssTexts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseWebFontRules(node, options)];
                case 1:
                    rules = _a.sent();
                    return [4 /*yield*/, Promise.all(rules.map(function (rule) {
                            var baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
                            return (0, embed_resources_1.embedResources)(rule.cssText, baseUrl, options);
                        }))];
                case 2:
                    cssTexts = _a.sent();
                    return [2 /*return*/, cssTexts.join('\n')];
            }
        });
    });
}
exports.getWebFontCSS = getWebFontCSS;
function embedWebFonts(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cssText, _a, _b, styleNode, sytleContent;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(options.fontEmbedCSS != null)) return [3 /*break*/, 1];
                    _a = options.fontEmbedCSS;
                    return [3 /*break*/, 5];
                case 1:
                    if (!options.skipFonts) return [3 /*break*/, 2];
                    _b = null;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getWebFontCSS(clonedNode, options)];
                case 3:
                    _b = _c.sent();
                    _c.label = 4;
                case 4:
                    _a = _b;
                    _c.label = 5;
                case 5:
                    cssText = _a;
                    if (cssText) {
                        styleNode = document.createElement('style');
                        sytleContent = document.createTextNode(cssText);
                        styleNode.appendChild(sytleContent);
                        if (clonedNode.firstChild) {
                            clonedNode.insertBefore(styleNode, clonedNode.firstChild);
                        }
                        else {
                            clonedNode.appendChild(styleNode);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.embedWebFonts = embedWebFonts;

},{"./dataurl":6,"./embed-resources":8,"./util":12}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedImages = void 0;
var embed_resources_1 = require("./embed-resources");
var util_1 = require("./util");
var dataurl_1 = require("./dataurl");
var mimes_1 = require("./mimes");
function embedBackground(clonedNode, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var background, cssString;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    background = (_a = clonedNode.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue('background');
                    if (!background) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, embed_resources_1.embedResources)(background, null, options)];
                case 1:
                    cssString = _b.sent();
                    clonedNode.style.setProperty('background', cssString, clonedNode.style.getPropertyPriority('background'));
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function embedImageNode(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var url, dataURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(clonedNode instanceof HTMLImageElement && !(0, dataurl_1.isDataUrl)(clonedNode.src)) &&
                        !(clonedNode instanceof SVGImageElement &&
                            !(0, dataurl_1.isDataUrl)(clonedNode.href.baseVal))) {
                        return [2 /*return*/];
                    }
                    url = clonedNode instanceof HTMLImageElement
                        ? clonedNode.src
                        : clonedNode.href.baseVal;
                    return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(url, (0, mimes_1.getMimeType)(url), options)];
                case 1:
                    dataURL = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            clonedNode.onload = resolve;
                            clonedNode.onerror = reject;
                            if (clonedNode instanceof HTMLImageElement) {
                                clonedNode.srcset = '';
                                clonedNode.src = dataURL;
                            }
                            else {
                                clonedNode.href.baseVal = dataURL;
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function embedChildren(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        var children, deferreds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    children = (0, util_1.toArray)(clonedNode.childNodes);
                    deferreds = children.map(function (child) { return embedImages(child, options); });
                    return [4 /*yield*/, Promise.all(deferreds).then(function () { return clonedNode; })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function embedImages(clonedNode, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(clonedNode instanceof Element)) return [3 /*break*/, 4];
                    return [4 /*yield*/, embedBackground(clonedNode, options)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, embedImageNode(clonedNode, options)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, embedChildren(clonedNode, options)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.embedImages = embedImages;

},{"./dataurl":6,"./embed-resources":8,"./mimes":11,"./util":12}],8:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedResources = exports.shouldEmbed = exports.embed = exports.parseURLs = void 0;
var util_1 = require("./util");
var mimes_1 = require("./mimes");
var dataurl_1 = require("./dataurl");
var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
    // eslint-disable-next-line no-useless-escape
    var escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp("(url\\(['\"]?)(".concat(escaped, ")(['\"]?\\))"), 'g');
}
function parseURLs(cssText) {
    var urls = [];
    cssText.replace(URL_REGEX, function (raw, quotation, url) {
        urls.push(url);
        return raw;
    });
    return urls.filter(function (url) { return !(0, dataurl_1.isDataUrl)(url); });
}
exports.parseURLs = parseURLs;
function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedURL, contentType, dataURL, content, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    resolvedURL = baseURL ? (0, util_1.resolveUrl)(resourceURL, baseURL) : resourceURL;
                    contentType = (0, mimes_1.getMimeType)(resourceURL);
                    dataURL = void 0;
                    if (!getContentFromUrl) return [3 /*break*/, 2];
                    return [4 /*yield*/, getContentFromUrl(resolvedURL)];
                case 1:
                    content = _a.sent();
                    dataURL = (0, dataurl_1.makeDataUrl)(content, contentType);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(resolvedURL, contentType, options)];
                case 3:
                    dataURL = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, cssText.replace(toRegex(resourceURL), "$1".concat(dataURL, "$3"))];
                case 5:
                    error_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, cssText];
            }
        });
    });
}
exports.embed = embed;
function filterPreferredFontFormat(str, _a) {
    var preferredFontFormat = _a.preferredFontFormat;
    return !preferredFontFormat
        ? str
        : str.replace(FONT_SRC_REGEX, function (match) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                var _a = URL_WITH_FORMAT_REGEX.exec(match) || [], src = _a[0], format = _a[2];
                if (!format) {
                    return '';
                }
                if (format === preferredFontFormat) {
                    return "src: ".concat(src, ";");
                }
            }
        });
}
function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
}
exports.shouldEmbed = shouldEmbed;
function embedResources(cssText, baseUrl, options) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredCSSText, urls;
        return __generator(this, function (_a) {
            if (!shouldEmbed(cssText)) {
                return [2 /*return*/, cssText];
            }
            filteredCSSText = filterPreferredFontFormat(cssText, options);
            urls = parseURLs(filteredCSSText);
            return [2 /*return*/, urls.reduce(function (deferred, url) {
                    return deferred.then(function (css) { return embed(css, url, baseUrl, options); });
                }, Promise.resolve(filteredCSSText))];
        });
    });
}
exports.embedResources = embedResources;

},{"./dataurl":6,"./mimes":11,"./util":12}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneNode = void 0;
var mimes_1 = require("./mimes");
var dataurl_1 = require("./dataurl");
var clone_pseudos_1 = require("./clone-pseudos");
var util_1 = require("./util");
function cloneCanvasElement(canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var dataURL;
        return __generator(this, function (_a) {
            dataURL = canvas.toDataURL();
            if (dataURL === 'data:,') {
                return [2 /*return*/, canvas.cloneNode(false)];
            }
            return [2 /*return*/, (0, util_1.createImage)(dataURL)];
        });
    });
}
function cloneVideoElement(video, options) {
    return __awaiter(this, void 0, void 0, function () {
        var poster, contentType, dataURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poster = video.poster;
                    contentType = (0, mimes_1.getMimeType)(poster);
                    return [4 /*yield*/, (0, dataurl_1.resourceToDataURL)(poster, contentType, options)];
                case 1:
                    dataURL = _a.sent();
                    return [2 /*return*/, (0, util_1.createImage)(dataURL)];
            }
        });
    });
}
function cloneSingleNode(node, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (node instanceof HTMLCanvasElement) {
                return [2 /*return*/, cloneCanvasElement(node)];
            }
            if (node instanceof HTMLVideoElement && node.poster) {
                return [2 /*return*/, cloneVideoElement(node, options)];
            }
            return [2 /*return*/, node.cloneNode(false)];
        });
    });
}
var isSlotElement = function (node) {
    return node.tagName != null && node.tagName.toUpperCase() === 'SLOT';
};
function cloneChildren(nativeNode, clonedNode, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var children;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    children = isSlotElement(nativeNode) && nativeNode.assignedNodes
                        ? (0, util_1.toArray)(nativeNode.assignedNodes())
                        : (0, util_1.toArray)(((_a = nativeNode.shadowRoot) !== null && _a !== void 0 ? _a : nativeNode).childNodes);
                    if (children.length === 0 || nativeNode instanceof HTMLVideoElement) {
                        return [2 /*return*/, clonedNode];
                    }
                    return [4 /*yield*/, children.reduce(function (deferred, child) {
                            return deferred
                                .then(function () { return cloneNode(child, options); })
                                .then(function (clonedChild) {
                                if (clonedChild) {
                                    clonedNode.appendChild(clonedChild);
                                }
                            });
                        }, Promise.resolve())];
                case 1:
                    _b.sent();
                    return [2 /*return*/, clonedNode];
            }
        });
    });
}
function cloneCSSStyle(nativeNode, clonedNode) {
    var targetStyle = clonedNode.style;
    if (!targetStyle) {
        return;
    }
    var sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
    }
    else {
        (0, util_1.toArray)(sourceStyle).forEach(function (name) {
            var value = sourceStyle.getPropertyValue(name);
            if (name === 'font-size' && value.endsWith('px')) {
                var reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
                value = "".concat(reducedFont, "px");
            }
            targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
    }
}
function cloneInputValue(nativeNode, clonedNode) {
    if (nativeNode instanceof HTMLTextAreaElement) {
        clonedNode.innerHTML = nativeNode.value;
    }
    if (nativeNode instanceof HTMLInputElement) {
        clonedNode.setAttribute('value', nativeNode.value);
    }
}
function cloneSelectValue(nativeNode, clonedNode) {
    if (nativeNode instanceof HTMLSelectElement) {
        var clonedSelect = clonedNode;
        var selectedOption = Array.from(clonedSelect.children).find(function (child) { return nativeNode.value === child.getAttribute('value'); });
        if (selectedOption) {
            selectedOption.setAttribute('selected', '');
        }
    }
}
function decorate(nativeNode, clonedNode) {
    if (clonedNode instanceof Element) {
        cloneCSSStyle(nativeNode, clonedNode);
        (0, clone_pseudos_1.clonePseudoElements)(nativeNode, clonedNode);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
}
function cloneNode(node, options, isRoot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!isRoot && options.filter && !options.filter(node)) {
                return [2 /*return*/, null];
            }
            return [2 /*return*/, Promise.resolve(node)
                    .then(function (clonedNode) { return cloneSingleNode(clonedNode, options); })
                    .then(function (clonedNode) { return cloneChildren(node, clonedNode, options); })
                    .then(function (clonedNode) { return decorate(node, clonedNode); })];
        });
    });
}
exports.cloneNode = cloneNode;

},{"./clone-pseudos":5,"./dataurl":6,"./mimes":11,"./util":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMimeType = void 0;
var WOFF = 'application/font-woff';
var JPEG = 'image/jpeg';
var mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
};
function getExtension(url) {
    var match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : '';
}
function getMimeType(url) {
    var extension = getExtension(url).toLowerCase();
    return mimes[extension] || '';
}
exports.getMimeType = getMimeType;

},{}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceToDataURL = exports.fetchAsDataURL = exports.makeDataUrl = exports.isDataUrl = void 0;
function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
}
exports.isDataUrl = isDataUrl;
function makeDataUrl(content, mimeType) {
    return "data:".concat(mimeType, ";base64,").concat(content);
}
exports.makeDataUrl = makeDataUrl;
function fetchAsDataURL(url, init, process) {
    return __awaiter(this, void 0, void 0, function () {
        var res, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, init)];
                case 1:
                    res = _a.sent();
                    if (res.status === 404) {
                        throw new Error("Resource \"".concat(res.url, "\" not found"));
                    }
                    return [4 /*yield*/, res.blob()];
                case 2:
                    blob = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.onerror = reject;
                            reader.onloadend = function () {
                                try {
                                    resolve(process({ res: res, result: reader.result }));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            };
                            reader.readAsDataURL(blob);
                        })];
            }
        });
    });
}
exports.fetchAsDataURL = fetchAsDataURL;
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
    var key = url.replace(/\?.*/, '');
    if (includeQueryParams) {
        key = url;
    }
    // font resource
    if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, '');
    }
    return contentType ? "[".concat(contentType, "]").concat(key) : key;
}
function resourceToDataURL(resourceUrl, contentType, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, dataURL, content, error_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
                    if (cache[cacheKey] != null) {
                        return [2 /*return*/, cache[cacheKey]];
                    }
                    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
                    if (options.cacheBust) {
                        // eslint-disable-next-line no-param-reassign
                        resourceUrl += (/\?/.test(resourceUrl) ? '&' : '?') + new Date().getTime();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchAsDataURL(resourceUrl, options.fetchRequestInit, function (_a) {
                            var res = _a.res, result = _a.result;
                            if (!contentType) {
                                // eslint-disable-next-line no-param-reassign
                                contentType = res.headers.get('Content-Type') || '';
                            }
                            return getContentFromDataUrl(result);
                        })];
                case 2:
                    content = _a.sent();
                    dataURL = makeDataUrl(content, contentType);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    dataURL = options.imagePlaceholder || '';
                    msg = "Failed to fetch resource: ".concat(resourceUrl);
                    if (error_1) {
                        msg = typeof error_1 === 'string' ? error_1 : error_1.message;
                    }
                    if (msg) {
                        console.warn(msg);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    cache[cacheKey] = dataURL;
                    return [2 /*return*/, dataURL];
            }
        });
    });
}
exports.resourceToDataURL = resourceToDataURL;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clonePseudoElements = void 0;
var util_1 = require("./util");
function formatCSSText(style) {
    var content = style.getPropertyValue('content');
    return "".concat(style.cssText, " content: '").concat(content.replace(/'|"/g, ''), "';");
}
function formatCSSProperties(style) {
    return (0, util_1.toArray)(style)
        .map(function (name) {
        var value = style.getPropertyValue(name);
        var priority = style.getPropertyPriority(name);
        return "".concat(name, ": ").concat(value).concat(priority ? ' !important' : '', ";");
    })
        .join(' ');
}
function getPseudoElementStyle(className, pseudo, style) {
    var selector = ".".concat(className, ":").concat(pseudo);
    var cssText = style.cssText
        ? formatCSSText(style)
        : formatCSSProperties(style);
    return document.createTextNode("".concat(selector, "{").concat(cssText, "}"));
}
function clonePseudoElement(nativeNode, clonedNode, pseudo) {
    var style = window.getComputedStyle(nativeNode, pseudo);
    var content = style.getPropertyValue('content');
    if (content === '' || content === 'none') {
        return;
    }
    var className = (0, util_1.uuid)();
    try {
        clonedNode.className = "".concat(clonedNode.className, " ").concat(className);
    }
    catch (err) {
        return;
    }
    var styleElement = document.createElement('style');
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style));
    clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode) {
    clonePseudoElement(nativeNode, clonedNode, ':before');
    clonePseudoElement(nativeNode, clonedNode, ':after');
}
exports.clonePseudoElements = clonePseudoElements;

},{"./util":12}],12:[function(require,module,exports){
(function (process){(function (){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeToDataURL = exports.svgToDataURL = exports.createImage = exports.canvasToBlob = exports.checkCanvasDimensions = exports.getPixelRatio = exports.getImageSize = exports.toArray = exports.delay = exports.uuid = exports.resolveUrl = void 0;
function resolveUrl(url, baseUrl) {
    // url is absolute already
    if (url.match(/^[a-z]+:\/\//i)) {
        return url;
    }
    // url is absolute already, without protocol
    if (url.match(/^\/\//)) {
        return window.location.protocol + url;
    }
    // dataURI, mailto:, tel:, etc.
    if (url.match(/^[a-z]+:/i)) {
        return url;
    }
    var doc = document.implementation.createHTMLDocument();
    var base = doc.createElement('base');
    var a = doc.createElement('a');
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
        base.href = baseUrl;
    }
    a.href = url;
    return a.href;
}
exports.resolveUrl = resolveUrl;
exports.uuid = (function () {
    // generate uuid for className of pseudo elements.
    // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
    var counter = 0;
    // ref: http://stackoverflow.com/a/6248722/2519373
    var random = function () {
        // eslint-disable-next-line no-bitwise
        return "0000".concat(((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    };
    return function () {
        counter += 1;
        return "u".concat(random()).concat(counter);
    };
})();
function delay(ms) {
    return function (args) {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(args); }, ms);
        });
    };
}
exports.delay = delay;
function toArray(arrayLike) {
    var arr = [];
    for (var i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}
exports.toArray = toArray;
function px(node, styleProperty) {
    var win = node.ownerDocument.defaultView || window;
    var val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace('px', '')) : 0;
}
function getNodeWidth(node) {
    var leftBorder = px(node, 'border-left-width');
    var rightBorder = px(node, 'border-right-width');
    return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
    var topBorder = px(node, 'border-top-width');
    var bottomBorder = px(node, 'border-bottom-width');
    return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options) {
    if (options === void 0) { options = {}; }
    var width = options.width || getNodeWidth(targetNode);
    var height = options.height || getNodeHeight(targetNode);
    return { width: width, height: height };
}
exports.getImageSize = getImageSize;
function getPixelRatio() {
    var ratio;
    var FINAL_PROCESS;
    try {
        FINAL_PROCESS = process;
    }
    catch (e) {
        // pass
    }
    var val = FINAL_PROCESS && FINAL_PROCESS.env
        ? FINAL_PROCESS.env.devicePixelRatio
        : null;
    if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
            ratio = 1;
        }
    }
    return ratio || window.devicePixelRatio || 1;
}
exports.getPixelRatio = getPixelRatio;
// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit ||
        canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit &&
            canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvas.height) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            }
            else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
        else if (canvas.width > canvasDimensionLimit) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
        }
        else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
        }
    }
}
exports.checkCanvasDimensions = checkCanvasDimensions;
function canvasToBlob(canvas, options) {
    if (options === void 0) { options = {}; }
    if (canvas.toBlob) {
        return new Promise(function (resolve) {
            canvas.toBlob(resolve, options.type ? options.type : 'image/png', options.quality ? options.quality : 1);
        });
    }
    return new Promise(function (resolve) {
        var binaryString = window.atob(canvas
            .toDataURL(options.type ? options.type : undefined, options.quality ? options.quality : undefined)
            .split(',')[1]);
        var len = binaryString.length;
        var binaryArray = new Uint8Array(len);
        for (var i = 0; i < len; i += 1) {
            binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
            type: options.type ? options.type : 'image/png',
        }));
    });
}
exports.canvasToBlob = canvasToBlob;
function createImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { return resolve(img); };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.decoding = 'sync';
        img.src = url;
    });
}
exports.createImage = createImage;
function svgToDataURL(svg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve()
                    .then(function () { return new XMLSerializer().serializeToString(svg); })
                    .then(encodeURIComponent)
                    .then(function (html) { return "data:image/svg+xml;charset=utf-8,".concat(html); })];
        });
    });
}
exports.svgToDataURL = svgToDataURL;
function nodeToDataURL(node, width, height) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlns, svg, foreignObject;
        return __generator(this, function (_a) {
            xmlns = 'http://www.w3.org/2000/svg';
            svg = document.createElementNS(xmlns, 'svg');
            foreignObject = document.createElementNS(xmlns, 'foreignObject');
            svg.setAttribute('width', "".concat(width));
            svg.setAttribute('height', "".concat(height));
            svg.setAttribute('viewBox', "0 0 ".concat(width, " ").concat(height));
            foreignObject.setAttribute('width', '100%');
            foreignObject.setAttribute('height', '100%');
            foreignObject.setAttribute('x', '0');
            foreignObject.setAttribute('y', '0');
            foreignObject.setAttribute('externalResourcesRequired', 'true');
            svg.appendChild(foreignObject);
            foreignObject.appendChild(node);
            return [2 /*return*/, svgToDataURL(svg)];
        });
    });
}
exports.nodeToDataURL = nodeToDataURL;

}).call(this)}).call(this,require('_process'))

},{"_process":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStyle = void 0;
function applyStyle(node, options) {
    var style = node.style;
    if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
        style.width = "".concat(options.width, "px");
    }
    if (options.height) {
        style.height = "".concat(options.height, "px");
    }
    var manual = options.style;
    if (manual != null) {
        Object.keys(manual).forEach(function (key) {
            style[key] = manual[key];
        });
    }
    return node;
}
exports.applyStyle = applyStyle;

},{}],2:[function(require,module,exports){
//download.js v4.2, by dandavis; 2008-2016. [MIT] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.download = factory();
  }
}(this, function () {

	return function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function(a){return String(a);},
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
			myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
	  
		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload=[payload, mimeType];
			mimeType=payload[0];
			payload=payload[1];
		}


		if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
		  	if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
        		var ajax=new XMLHttpRequest();
        		ajax.open( "GET", url, true);
        		ajax.responseType = 'blob';
        		ajax.onload= function(e){ 
				  download(e.target.response, fileName, defaultMime);
				};
        		setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
			    return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)){
		
			if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
				payload=dataUrlToBlob(payload);
				mimeType=payload.type || defaultMime;
			}else{			
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload) ; // everyone else can save dataURLs un-processed
			}
			
		}else{//not data url, is it a string with special needs?
			if(/([\x80-\xff])/.test(payload)){			  
				var i=0, tempUiArr= new Uint8Array(payload.length), mx=tempUiArr.length;
				for(i;i<mx;++i) tempUiArr[i]= payload.charCodeAt(i);
			 	payload=new myBlob([tempUiArr], {type: mimeType});
			}		  
		}
		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], {type: mimeType}) ;


		function dataUrlToBlob(strUrl) {
			var parts= strUrl.split(/[:;,]/),
			type= parts[1],
			decoder= parts[2] == "base64" ? atob : decodeURIComponent,
			binData= decoder( parts.pop() ),
			mx= binData.length,
			i= 0,
			uiArr= new Uint8Array(mx);

			for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

			return new myBlob([uiArr], {type: type});
		 }

		function saver(url, winMode){

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
				document.body.appendChild(anchor);
				setTimeout(function() {
					anchor.click();
					document.body.removeChild(anchor);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
				}, 66);
				return true;
			}

			// handle non-a[download] safari as best we can:
			if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
				if(/^data:/.test(url))	url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if(!winMode && /^data:/.test(url)){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			}
			f.src=url;
			setTimeout(function(){ document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===toString ){
				try{
					return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL support:
			reader=new FileReader();
			reader.onload=function(e){
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */
}));

},{}],1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[41])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9Qcm9ncmFtb2svU3RhciBXYXJzIExDRy9zcmMvbWFpbi5qcyIsInNyYy90ZXh0ZWRpdG9yLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvbG9hZGVyLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3NuaXBwZXQuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvZHVtcGVyLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3NjaGVtYS9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvdGltZXN0YW1wLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvcGFpcnMuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvdHlwZS9vbWFwLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvbWVyZ2UuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvdHlwZS9iaW5hcnkuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvc2NoZW1hL2NvcmUuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvc2NoZW1hL2pzb24uanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvdHlwZS9udWxsLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvaW50LmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3R5cGUvZmxvYXQuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvdHlwZS9ib29sLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL3NjaGVtYS9mYWlsc2FmZS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi90eXBlL3N0ci5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi90eXBlL3NlcS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi90eXBlL21hcC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9zY2hlbWEuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9leGNlcHRpb24uanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvY29tbW9uLmpzIiwibm9kZV9tb2R1bGVzL2h0bWwtdG8taW1hZ2UvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2h0bWwtdG8taW1hZ2UvbGliL2VtYmVkLXdlYmZvbnRzLmpzIiwibm9kZV9tb2R1bGVzL2h0bWwtdG8taW1hZ2UvbGliL2VtYmVkLWltYWdlcy5qcyIsIm5vZGVfbW9kdWxlcy9odG1sLXRvLWltYWdlL2xpYi9lbWJlZC1yZXNvdXJjZXMuanMiLCJub2RlX21vZHVsZXMvaHRtbC10by1pbWFnZS9saWIvY2xvbmUtbm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9odG1sLXRvLWltYWdlL2xpYi9taW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9odG1sLXRvLWltYWdlL2xpYi9kYXRhdXJsLmpzIiwibm9kZV9tb2R1bGVzL2h0bWwtdG8taW1hZ2UvbGliL2Nsb25lLXBzZXVkb3MuanMiLCJub2RlX21vZHVsZXMvaHRtbC10by1pbWFnZS9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9odG1sLXRvLWltYWdlL2xpYi9hcHBseS1zdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy9kb3dubG9hZGpzL2Rvd25sb2FkLmpzIiwiQzovVXNlcnMvbGFjaS9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsTUFBTSxtREFBbUQsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQzdFLE1BQU0sY0FBYyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQzVDLE1BQU0sV0FBVyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkMsQUFBeUI7QUFDekIsTUFBTSxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoQyxNQUFNLGFBQWEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqRCxNQUFNLFVBQVUsS0FBSzs7QUFFckIsTUFBTSxVQUFVLFFBQVEsY0FBYyxDQUFDLFVBQVUsQ0FBQztBQUNsRCxNQUFNLFVBQVUsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDOztBQUU1QyxNQUFNLGFBQWEsUUFBUSxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ3BELE1BQU0sbUJBQW1CLFVBQVUsaUJBQWlCLENBQUMsc0JBQXNCLENBQUM7QUFDNUUsTUFBTSxzQkFBc0IsVUFBVSxpQkFBaUIsQ0FBQyx5QkFBeUIsQ0FBQztBQUNsRixNQUFNLGNBQWMsVUFBVSxjQUFjLENBQUMsa0JBQWtCLENBQUM7QUFDaEUsTUFBTSxnQkFBZ0IsVUFBVSxjQUFjLENBQUMsb0JBQW9CLENBQUM7QUFDcEUsTUFBTSxjQUFjLFVBQVUsY0FBYyxDQUFDLGtCQUFrQixDQUFDO0FBQ2hFLE1BQU0sZUFBZSxVQUFVLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQztBQUNsRSxNQUFNLHNCQUFzQjtJQUN4QixNQUFNLFVBQVUsY0FBYyxDQUFDLGtCQUFrQixDQUFDO0lBQ2xELFdBQVcsVUFBVSxjQUFjLENBQUMsdUJBQXVCLENBQUM7SUFDNUQsT0FBTyxVQUFVLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQztJQUNwRCxZQUFZLFVBQVUsY0FBYyxDQUFDLHdCQUF3QixDQUFDO0lBQzlELFNBQVMsVUFBVSxjQUFjLENBQUMscUJBQXFCLENBQUM7SUFDeEQsY0FBYyxVQUFVLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztDQUNyRTtBQUNELE1BQU0sWUFBWSxVQUFVLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUM1RCxNQUFNLGtCQUFrQixVQUFVLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQztBQUN4RSxNQUFNLGtCQUFrQixVQUFVLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQztBQUN4RSxNQUFNLGdCQUFnQixVQUFVLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztBQUN2RSxNQUFNLGNBQWMsVUFBVSxjQUFjLENBQUMscUJBQXFCLENBQUM7QUFDbkUsTUFBTSxxQkFBcUIsVUFBVSxjQUFjLENBQUMsNEJBQTRCLENBQUM7QUFDakYsTUFBTSxpQkFBaUIsVUFBVSxjQUFjLENBQUMscUJBQXFCLENBQUM7QUFDdEUsTUFBTSxvQkFBb0IsVUFBVSxjQUFjLENBQUMsd0JBQXdCLENBQUM7QUFDNUUsTUFBTSxtQkFBbUIsVUFBVSxjQUFjLENBQUMsdUJBQXVCLENBQUM7QUFDMUUsTUFBTSxxQkFBcUIsVUFBVSxjQUFjLENBQUMseUJBQXlCLENBQUM7O0FBRTlFLE1BQU0saUJBQWlCLFVBQVUsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUM1RCxNQUFNLGFBQWEsVUFBVSxjQUFjLENBQUMsT0FBTyxDQUFDO0FBQ3BELE1BQU0sa0JBQWtCLFVBQVUsY0FBYyxDQUFDLHNCQUFzQixDQUFDO0FBQ3hFLE1BQU0saUJBQWlCLFVBQVUsY0FBYyxDQUFDLFdBQVcsQ0FBQztBQUM1RCxNQUFNLGlCQUFpQixVQUFVLGNBQWMsQ0FBQyxXQUFXLENBQUM7QUFDNUQsTUFBTSx1QkFBdUIsVUFBVSxjQUFjLENBQUMsaUJBQWlCLENBQUM7QUFDeEUsTUFBTSxvQkFBb0IsVUFBVSxjQUFjLENBQUMsb0JBQW9CLENBQUM7O0FBRXhFLE1BQU0sZ0JBQWdCLFFBQVEsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0FBQzlELE1BQU0saUJBQWlCLGFBQWEsY0FBYyxDQUFDLE1BQU0sQ0FBQztBQUMxRCxNQUFNLGtCQUFrQixhQUFhLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDNUQsTUFBTSxtQkFBbUIsYUFBYSxjQUFjLENBQUMsUUFBUSxDQUFDO0FBQzlELE1BQU0sc0JBQXNCLGFBQWEsY0FBYyxDQUFDLFdBQVcsQ0FBQzs7O0FBR3BFLE1BQU0sYUFBYSxPQUFPLGNBQWMsQ0FBQyxVQUFVLENBQUM7QUFDcEQsTUFBTSxXQUFXLE9BQU8sY0FBYyxDQUFDLGNBQWMsQ0FBQzs7QUFFdEQsSUFBSSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVE7QUFDaEwsV0FBVyxXQUFXO0FBQ3RCLGNBQWMsU0FBUztBQUN2QixXQUFXLEVBQUU7QUFDYixTQUFTLEtBQUs7QUFDZCxPQUFPLEVBQUU7QUFDVCxRQUFRLENBQUM7QUFDVCxlQUFlO0lBQ1gsTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUUsY0FBYyxDQUFDO0NBQzlFO0FBQ0QsS0FBSyxFQUFFO0FBQ1AsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsU0FBUyxFQUFFO0FBQ1gsT0FBTyxFQUFFO0FBQ1QsY0FBYyxFQUFFO0FBQ2hCLFVBQVUsSUFBSTtBQUNkLFlBQVksQ0FBQztBQUNiLGFBQWEsRUFBRTtBQUNmLFlBQVksRUFBRTtBQUNkLGNBQWMsSUFBSTtBQUNsQixpQkFBaUIsRUFBRTtBQUNuQixXQUFXLE1BQU07O0FBRWpCLGdCQUFnQixRQUFRLENBQUMsV0FBVztJQUNoQyxPQUFPLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNO1FBQ3JDLFdBQVcsT0FBTyxHQUFHO1FBQ3JCLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7S0FDbEQsQ0FBQztDQUNMLENBQUM7QUFDRixtQkFBbUIsUUFBUSxDQUFDLFdBQVc7SUFDbkMsT0FBTyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNyQyxjQUFjLE9BQU8sR0FBRztRQUN4QixJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDO0tBQ3hELENBQUM7Q0FDTCxDQUFDO0FBQ0YsV0FBVyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUN4QyxXQUFXLFdBQVcsTUFBTTtJQUM1QixJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0NBQzlDLENBQUM7QUFDRixhQUFhLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNO0lBQzNDLFNBQVMsYUFBYSxRQUFRO0lBQzlCLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Q0FDOUMsQ0FBQztBQUNGLFdBQVcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU07SUFDekMsT0FBTyxXQUFXLE1BQU07SUFDeEIsSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztDQUMxQyxDQUFDO0FBQ0YsWUFBWSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUMxQyxRQUFRLFFBQVEsQ0FBQyxZQUFZLE1BQU0sQ0FBQztJQUNwQyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDO0NBQzVDLENBQUM7QUFDRixtQkFBbUIsS0FBSyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUN0RCxZQUFZLEtBQUssR0FBRyxRQUFRLENBQUMsbUJBQW1CLEtBQUssTUFBTSxDQUFDO0lBQzVELElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixFQUFFLFlBQVksS0FBSyxDQUFDO0NBQ3BFLENBQUMsRUFBRSxtQkFBbUIsVUFBVSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUMvRCxZQUFZLFVBQVUsR0FBRyxRQUFRLENBQUMsbUJBQW1CLFVBQVUsTUFBTSxDQUFDO0lBQ3RFLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixFQUFFLFlBQVksVUFBVSxDQUFDO0NBQzlFLENBQUMsRUFBRSxtQkFBbUIsTUFBTSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUMzRCxZQUFZLE1BQU0sR0FBRyxRQUFRLENBQUMsbUJBQW1CLE1BQU0sTUFBTSxDQUFDO0lBQzlELElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFLFlBQVksTUFBTSxDQUFDO0NBQ3RFLENBQUMsRUFBRSxtQkFBbUIsV0FBVyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUNoRSxZQUFZLFdBQVcsR0FBRyxRQUFRLENBQUMsbUJBQW1CLFdBQVcsTUFBTSxDQUFDO0lBQ3hFLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLFlBQVksV0FBVyxDQUFDO0NBQ2hGLENBQUMsRUFBRSxtQkFBbUIsUUFBUSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUM3RCxZQUFZLFFBQVEsR0FBRyxRQUFRLENBQUMsbUJBQW1CLFFBQVEsTUFBTSxDQUFDO0lBQ2xFLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixFQUFFLFlBQVksUUFBUSxDQUFDO0NBQzFFLENBQUMsRUFBRSxtQkFBbUIsYUFBYSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUNsRSxZQUFZLGFBQWEsR0FBRyxRQUFRLENBQUMsbUJBQW1CLGFBQWEsTUFBTSxDQUFDO0lBQzVFLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixFQUFFLFlBQVksYUFBYSxDQUFDO0NBQ3BGLENBQUM7QUFDRixTQUFTLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNO0lBQ3ZDLEtBQUssU0FBUyxNQUFNO0lBQ3BCLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Q0FDdEMsQ0FBQztBQUNGLGVBQWUsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU07SUFDN0MsV0FBVyxlQUFlLE1BQU07SUFDaEMsSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQztDQUNsRCxDQUFDO0FBQ0YsZUFBZSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUM3QyxXQUFXLGVBQWUsTUFBTTtJQUNoQyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO0NBQ2xELENBQUM7QUFDRixhQUFhLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQzFDLFNBQVMsYUFBYSxNQUFNO0lBQzVCLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Q0FDOUMsQ0FBQzs7QUFFRixXQUFXLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ3hDLE9BQU8sV0FBVyxNQUFNO0lBQ3hCLElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7Q0FDMUMsQ0FBQztBQUNGLFVBQVUsWUFBWSxFQUFFOztBQUV4QixrQkFBa0IsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDL0MsY0FBYyxrQkFBa0IsTUFBTTtJQUN0QyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDO0NBQ3hELENBQUM7O0FBRUYsSUFBSSxnQkFBZ0IsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNyQyxhQUFhLFVBQVUsR0FBRyxXQUFXO0lBQ2pDLFlBQVksYUFBYSxPQUFPO0NBQ25DO0FBQ0QsY0FBYyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUM1QyxJQUFJLFFBQVEsY0FBYyxNQUFNO0lBQ2hDLFVBQVUsS0FBSyxPQUFPLEtBQUssQ0FBQyxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtJQUNuRSxHQUFHLEtBQUssT0FBTyxLQUFLLENBQUMsRUFBRTtRQUNuQixhQUFhLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEMsTUFBTTtRQUNILFlBQVksRUFBRTtLQUNqQjtJQUNELElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7Q0FDaEQsQ0FBQzs7QUFFRixpQkFBaUIsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDOUMsYUFBYSxpQkFBaUIsTUFBTTtJQUNwQyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDO0NBQ3RELENBQUM7QUFDRixnQkFBZ0IsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU07SUFDOUMsWUFBWSxnQkFBZ0IsTUFBTTtJQUNsQyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDO0NBQ3BELENBQUM7O0FBRUYsSUFBSSxvQkFBb0IsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUN6QyxpQkFBaUIsVUFBVSxHQUFHLFdBQVc7SUFDckMsaUJBQWlCLGlCQUFpQixPQUFPO0NBQzVDO0FBQ0Qsa0JBQWtCLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNO0lBQ2hELElBQUksUUFBUSxrQkFBa0IsTUFBTTtJQUNwQyxjQUFjLEtBQUssT0FBTyxLQUFLLENBQUMsR0FBRyxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7SUFDdkUsR0FBRyxLQUFLLE9BQU8sS0FBSyxDQUFDLEVBQUU7UUFDbkIsaUJBQWlCLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUMsTUFBTTtRQUNILGlCQUFpQixFQUFFO0tBQ3RCO0lBQ0QsSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQztDQUN4RCxDQUFDO0FBQ0YsZUFBZSxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUM1QyxXQUFXLGVBQWUsTUFBTTtJQUNoQyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO0NBQ2xELENBQUM7O0FBRUYsTUFBTSxlQUFlLE1BQU07SUFDdkIsT0FBTyxVQUFVLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDbEMsYUFBYSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7Q0FDcEw7QUFDRCxNQUFNLFdBQVcsTUFBTTtJQUNuQixXQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQjtRQUMvQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsR0FBRyxNQUFNLENBQUM7S0FDdkMsQ0FBQztDQUNMOztBQUVELE1BQU0sV0FBVyxNQUFNO0lBQ25CLE1BQU0sZ0JBQWdCLGdCQUFnQixFQUFFO0lBQ3hDLE1BQU0sT0FBTztRQUNULFVBQVUsUUFBUTtRQUNsQixhQUFhLFdBQVc7UUFDeEIsVUFBVSxRQUFRO1FBQ2xCLFFBQVEsTUFBTTtRQUNkLE1BQU0sSUFBSTtRQUNWLE9BQU8sS0FBSztRQUNaLGNBQWMsWUFBWTtRQUMxQixJQUFJLEVBQUU7UUFDTixVQUFVLFFBQVE7UUFDbEIsVUFBVSxRQUFRO1FBQ2xCLFFBQVEsTUFBTTtRQUNkLE1BQU0sSUFBSTtRQUNWLGFBQWEsV0FBVztRQUN4QixZQUFZLFVBQVU7UUFDdEIsV0FBVyxTQUFTO1FBQ3BCLFlBQVksYUFBYSxJQUFJO1FBQzdCLGFBQWEsYUFBYSxLQUFLO1FBQy9CLGNBQWMsYUFBYSxNQUFNO1FBQ2pDLGlCQUFpQixhQUFhLFNBQVM7UUFDdkMsU0FBUyxTQUFTO1FBQ2xCLGFBQWEsY0FBYztLQUM5QjtJQUNELElBQUksT0FBTyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7SUFDdkMsTUFBTSxhQUFhLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQztJQUNsQyxRQUFRLENBQUMsVUFBVSxFQUFFLFFBQVEsR0FBRyxRQUFRLENBQUM7Q0FDNUM7O0FBRUQsTUFBTSxXQUFXLGFBQWE7SUFDMUIsV0FBVyxPQUFPLFNBQVM7SUFDM0IsZ0JBQWdCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxRQUFRLEVBQUUsS0FBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNqSCxjQUFjLE9BQU8sWUFBWTtJQUNqQyxtQkFBbUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLFdBQVcsRUFBRSxLQUFLLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3ZILG1CQUFtQixNQUFNLEdBQUcsV0FBVztJQUN2QyxXQUFXLE9BQU8sU0FBUztJQUMzQixXQUFXLE1BQU0sR0FBRyxRQUFRO0lBQzVCLFNBQVMsT0FBTyxPQUFPO0lBQ3ZCLGFBQWEsUUFBUSxHQUFHLE1BQU07SUFDOUIsT0FBTyxPQUFPLEtBQUs7SUFDbkIsV0FBVyxNQUFNLEdBQUcsSUFBSTtJQUN4QixRQUFRLE9BQU8sTUFBTTtJQUNyQixZQUFZLE1BQU0sR0FBRyxLQUFLO0lBQzFCLGVBQWUsT0FBTyxhQUFhO0lBQ25DLG1CQUFtQixLQUFLLE1BQU0sR0FBRyxZQUFZLEtBQUs7SUFDbEQsbUJBQW1CLFVBQVUsTUFBTSxHQUFHLFlBQVksVUFBVTtJQUM1RCxtQkFBbUIsTUFBTSxNQUFNLEdBQUcsWUFBWSxNQUFNO0lBQ3BELG1CQUFtQixXQUFXLE1BQU0sR0FBRyxZQUFZLFdBQVc7SUFDOUQsbUJBQW1CLFFBQVEsTUFBTSxHQUFHLFlBQVksUUFBUTtJQUN4RCxtQkFBbUIsYUFBYSxNQUFNLEdBQUcsWUFBWSxhQUFhO0lBQ2xFLEtBQUssT0FBTyxHQUFHO0lBQ2YsU0FBUyxNQUFNLEdBQUcsRUFBRTtJQUNwQixXQUFXLE9BQU8sU0FBUztJQUMzQixlQUFlLE1BQU0sR0FBRyxRQUFRO0lBQ2hDLFdBQVcsT0FBTyxTQUFTO0lBQzNCLGVBQWUsTUFBTSxHQUFHLFFBQVE7SUFDaEMsU0FBUyxPQUFPLE9BQU87SUFDdkIsYUFBYSxNQUFNLEdBQUcsTUFBTTtJQUM1QixPQUFPLE9BQU8sS0FBSztJQUNuQixXQUFXLE1BQU0sR0FBRyxJQUFJO0lBQ3hCLGNBQWMsT0FBTyxZQUFZO0lBQ2pDLGtCQUFrQixNQUFNLEdBQUcsV0FBVztJQUN0QyxhQUFhLE9BQU8sV0FBVztJQUMvQixpQkFBaUIsTUFBTSxHQUFHLFVBQVU7SUFDcEMsWUFBWSxPQUFPLFVBQVU7SUFDN0IsZ0JBQWdCLE1BQU0sR0FBRyxTQUFTOztJQUVsQyxVQUFVLE9BQU8sUUFBUTtJQUN6QixZQUFZLE9BQU87SUFDbkIsY0FBYyxNQUFNLEdBQUcsRUFBRTtJQUN6QixjQUFjLE9BQU8sWUFBWTtJQUNqQyxpQkFBaUIsV0FBVztJQUM1QixrQkFBa0IsTUFBTSxHQUFHLEVBQUU7O0lBRTdCLGNBQWMsTUFBTSxHQUFHLE9BQU8sV0FBVyxJQUFJLENBQUM7SUFDOUMsZUFBZSxNQUFNLEdBQUcsT0FBTyxZQUFZLElBQUksQ0FBQztJQUNoRCxnQkFBZ0IsTUFBTSxHQUFHLE9BQU8sYUFBYSxJQUFJLEdBQUc7SUFDcEQsbUJBQW1CLE1BQU0sR0FBRyxPQUFPLGdCQUFnQixJQUFJLENBQUM7SUFDeEQsSUFBSSxhQUFhLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFLFlBQVksSUFBSSxDQUFDLENBQUM7SUFDdEUsY0FBYyxjQUFjLENBQUMsVUFBVSxDQUFDO0lBQ3hDLGVBQWUsY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUN6QyxnQkFBZ0IsY0FBYyxDQUFDLFVBQVUsQ0FBQztJQUMxQyxtQkFBbUIsY0FBYyxDQUFDLFVBQVUsQ0FBQztDQUNoRDs7QUFFRCxjQUFjLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQzNDLFlBQVksRUFBRTtDQUNqQixDQUFDOztBQUVGLFVBQVUsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDdkMsUUFBUSxFQUFFO0NBQ2IsQ0FBQzs7QUFFRixjQUFjLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQzNDLFFBQVEsRUFBRTtDQUNiLENBQUM7O0FBRUYsY0FBYyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTTtJQUM1QyxHQUFHLGNBQWMsTUFBTSxPQUFPLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtRQUMvQixNQUFNLE9BQU8sR0FBRyxZQUFZO1lBQ3hCLGVBQWUsTUFBTSxHQUFHLGdCQUFnQixDQUFDLGNBQWMsTUFBTSxDQUFDO1lBQzlELFdBQVcsZUFBZSxNQUFNO1lBQ2hDLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLE9BQU8sQ0FBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2QsWUFBWSxFQUFFO1NBQ2pCO1FBQ0QsTUFBTSxXQUFXLENBQUMsY0FBYyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0M7Q0FDSixDQUFDOztBQUVGLG9CQUFvQixpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNqRCxXQUFXLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQjtRQUNsRCxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsR0FBRyxjQUFjLENBQUM7S0FDL0MsQ0FBQztDQUNMLENBQUM7O0FBRUYsaUJBQWlCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQzlDLE9BQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUM7SUFDckMsV0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxtQkFBbUI7UUFDaEQsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEdBQUcsWUFBWSxDQUFDO0tBQzdDLENBQUM7Q0FDTCxDQUFDOzs7QUFHRixRQUFRLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPO0lBQ3hDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1FBQ2hDLFlBQVksRUFBRTtLQUNqQixNQUFNLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1FBQ25DLFFBQVEsRUFBRTtRQUNWLENBQUMsZUFBZSxFQUFFO0tBQ3JCLE1BQU0sSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7UUFDbEMsUUFBUSxFQUFFO0tBQ2IsTUFBTSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtRQUNsQyxjQUFjLE1BQU0sRUFBRTtLQUN6QjtDQUNKOzs7O0FDMVZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3I4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IHt1cGRhdGVQcmV2aWV3LCBnZXRQaWN0dXJlUGFyYW1zLCBzZXRQaWN0dXJlUGFyYW1zfSA9IHJlcXVpcmUoXCIuL2NhcmRcIilcclxuY29uc3QgaHRtbFRvSW1hZ2UgPSByZXF1aXJlKFwiaHRtbC10by1pbWFnZVwiKVxyXG5jb25zdCBkb3dubG9hZCA9IHJlcXVpcmUoJ2Rvd25sb2FkanMnKTtcclxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5jb25zdCBZYW1sID0gcmVxdWlyZSgnanMteWFtbCcpO1xyXG5jb25zdCB0ZXh0RWRpdG9yID0gcmVxdWlyZShcIi4vdGV4dGVkaXRvclwiKTtcclxuY29uc3QgeyBmaWxlTmFtZUZyb21QYXRoIH0gPSByZXF1aXJlKFwiLi9oZWxwZXJcIik7XHJcblxyXG5jb25zdCBsb2dnaW5nID0gZmFsc2VcclxuXHJcbmNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJldmlldycpXHJcbmNvbnN0IGNhcmREaXYgPSBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoXCJkaXZcIilcclxuXHJcbmNvbnN0IGVkaXRvckZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VkaXRvclwiKVxyXG5jb25zdCBjYXJkVHlwZXNDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZT1jYXJkVHlwZV1cIilcclxuY29uc3QgYWZmaWxpYXRpb25zQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0W25hbWU9YWZmaWxpYXRpb25dXCIpXHJcbmNvbnN0IG5hbWVDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT1uYW1lXVwiKVxyXG5jb25zdCB1bmlxdWVDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT11bmlxdWVdXCIpXHJcbmNvbnN0IGNvc3RDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT1jb3N0XVwiKVxyXG5jb25zdCBmb3JjZUNvbnRyb2wgPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPWZvcmNlXVwiKVxyXG5jb25zdCBjb21iYXRfaWNvbnNDb250cm9sID0ge1xyXG4gICAgdW5pdDogZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT11bml0XVwiKSxcclxuICAgIHVuaXRfZWRnZTogZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT11bml0X2VkZ2VdXCIpLFxyXG4gICAgYmxhc3Q6IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9Ymxhc3RdXCIpLFxyXG4gICAgYmxhc3RfZWRnZTogZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT1ibGFzdF9lZGdlXVwiKSxcclxuICAgIHRhY3RpY3M6IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9dGFjdGljc11cIiksXHJcbiAgICB0YWN0aWNzX2VkZ2U6IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9dGFjdGljc19lZGdlXVwiKVxyXG59XHJcbmNvbnN0IGhwQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9aHBdXCIpXHJcbmNvbnN0IHJlc291cmNlQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9cmVzb3VyY2VdXCIpXHJcbmNvbnN0IHByaW9yaXR5Q29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9cHJpb3JpdHldXCIpXHJcbmNvbnN0IHRyYWl0c0NvbnRyb2wgPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVtuYW1lPXRyYWl0c11cIilcclxuY29uc3QgdGV4dENvbnRyb2wgPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVtuYW1lPXRleHRdXCIpXHJcbmNvbnN0IGRlc2NyaXB0aW9uQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcInRleHRhcmVhW25hbWU9ZGVzY3JpcHRpb25dXCIpXHJcbmNvbnN0IHBpY3R1cmVDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbbmFtZT1waWN0dXJlXVwiKVxyXG5jb25zdCBzZXRfbnVtYmVyQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9c2V0X251bWJlcl1cIilcclxuY29uc3Qgc2V0X29yZGVyQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9c2V0X29yZGVyXVwiKVxyXG5jb25zdCBjeWNsZV9pbWFnZUNvbnRyb2wgPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPWN5Y2xlX2ltYWdlXVwiKVxyXG5cclxuY29uc3QgZ2VuZXJhdGVCdXR0b24gPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCIjZ2VuZXJhdGVcIilcclxuY29uc3Qgc2F2ZUJ1dHRvbiA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcIiNzYXZlXCIpXHJcbmNvbnN0IGZpbGVOYW1lQ29udHJvbCA9IGVkaXRvckZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0W25hbWU9ZmlsZU5hbWVdXCIpXHJcbmNvbnN0IHNhdmVEYXRhQnV0dG9uID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiI3NhdmVEYXRhXCIpXHJcbmNvbnN0IGxvYWREYXRhQnV0dG9uID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiI2xvYWREYXRhXCIpXHJcbmNvbnN0IGV4dHJhY3RQaWN0dXJlQnV0dG9uID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiI2V4dHJhY3RQaWN0dXJlXCIpXHJcbmNvbnN0IGV4dHJhY3RDeWNsZUltYWdlID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiI2V4dHJhY3RDeWNsZUltYWdlXCIpXHJcblxyXG5jb25zdCBwaWN0dXJlRWRpdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwaWN0dXJlRWRpdG9yXCIpXHJcbmNvbnN0IHRvcElucHV0TnVtYmVyID0gcGljdHVyZUVkaXRvci5xdWVyeVNlbGVjdG9yKFwiI3RvcFwiKVxyXG5jb25zdCBsZWZ0SW5wdXROdW1iZXIgPSBwaWN0dXJlRWRpdG9yLnF1ZXJ5U2VsZWN0b3IoXCIjbGVmdFwiKVxyXG5jb25zdCB3aWR0aElucHV0TnVtYmVyID0gcGljdHVyZUVkaXRvci5xdWVyeVNlbGVjdG9yKFwiI3dpZHRoXCIpXHJcbmNvbnN0IHJvdGF0aW9uSW5wdXROdW1iZXIgPSBwaWN0dXJlRWRpdG9yLnF1ZXJ5U2VsZWN0b3IoXCIjcm90YXRpb25cIilcclxuXHJcblxyXG5jb25zdCBwaWN0dXJlSW1nID0gY2FyZERpdi5xdWVyeVNlbGVjdG9yKFwiI3BpY3R1cmVcIilcclxuY29uc3QgY3ljbGVJbWcgPSBjYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjY3ljbGVfaW1hZ2VcIilcclxuXHJcbmxldCBjYXJkVHlwZSwgYWZmaWxpYXRpb24sIHVuaXROYW1lLCB1bmlxdWUsIGNvc3QsIGZvcmNlLCBjb21iYXRfaWNvbnMsIGhwLCByZXNvdXJjZSwgcHJpb3JpdHksIHRyYWl0cywgdGV4dCwgZGVzY3JpcHRpb24sIHBpY3R1cmUsIHNldF9udW1iZXIsIHNldF9vcmRlciwgY3ljbGVfaW1hZ2UsIGZpbGVOYW1lXHJcbmNhcmRUeXBlID0gXCJvYmplY3RpdmVcIlxyXG5hZmZpbGlhdGlvbiA9IFwibmV1dHJhbFwiXHJcbnVuaXROYW1lID0gXCJcIlxyXG51bmlxdWUgPSBmYWxzZVxyXG5jb3N0ID0gXCJcIlxyXG5mb3JjZSA9IDBcclxuY29tYmF0X2ljb25zID0ge1xyXG4gICAgdW5pdDogMCwgdW5pdF9lZGdlOiAwLCBibGFzdDogMCwgYmxhc3RfZWRnZTogMCwgdGFjdGljczogMCwgdGFjdGljc19lZGdlOiAwXHJcbn1cclxuaHAgPSBcIlwiXHJcbnJlc291cmNlID0gXCJcIlxyXG5wcmlvcml0eSA9IFwiXCJcclxudHJhaXRzID0gXCJcIlxyXG50ZXh0ID0gXCJcIlxyXG5kZXNjcmlwdGlvbiA9IFwiXCJcclxucGljdHVyZSA9IG51bGxcclxucGljdHVyZTY0ID0gMFxyXG5zZXRfbnVtYmVyID0gXCJcIlxyXG5zZXRfb3JkZXIgPSBcIlwiXHJcbmN5Y2xlX2ltYWdlID0gbnVsbFxyXG5jeWNsZV9pbWFnZV82NCA9IFwiXCJcclxuZmlsZU5hbWUgPSBcImNhcmRcIlxyXG5cclxuY2FyZFR5cGVzQ29udHJvbC5mb3JFYWNoKGNvbnRyb2wgPT4ge1xyXG4gICAgY29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICBjYXJkVHlwZSA9IGNvbnRyb2wuaWRcclxuICAgICAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJjYXJkVHlwZTpcIiwgY2FyZFR5cGUpXHJcbiAgICB9KVxyXG59KVxyXG5hZmZpbGlhdGlvbnNDb250cm9sLmZvckVhY2goY29udHJvbCA9PiB7XHJcbiAgICBjb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgIGFmZmlsaWF0aW9uID0gY29udHJvbC5pZFxyXG4gICAgICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImFmZmlsaWF0aW9uOlwiLCBhZmZpbGlhdGlvbilcclxuICAgIH0pXHJcbn0pXHJcbm5hbWVDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICB1bml0TmFtZSA9IG5hbWVDb250cm9sLnZhbHVlXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJuYW1lOlwiLCB1bml0TmFtZSlcclxufSlcclxudW5pcXVlQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIHVuaXF1ZSA9IHVuaXF1ZUNvbnRyb2wuY2hlY2tlZFxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwidW5pcXVlOlwiLCB1bmlxdWUpXHJcbn0pXHJcbmNvc3RDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29zdCA9IGNvc3RDb250cm9sLnZhbHVlXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJjb3N0OlwiLCBjb3N0KVxyXG59KVxyXG5mb3JjZUNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBmb3JjZSA9IHBhcnNlSW50KGZvcmNlQ29udHJvbC52YWx1ZSlcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImZvcmNlOlwiLCBmb3JjZSlcclxufSlcclxuY29tYmF0X2ljb25zQ29udHJvbC51bml0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29tYmF0X2ljb25zLnVuaXQgPSBwYXJzZUludChjb21iYXRfaWNvbnNDb250cm9sLnVuaXQudmFsdWUpXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJjb21iYXRfaWNvbnMudW5pdDpcIiwgY29tYmF0X2ljb25zLnVuaXQpXHJcbn0pLCBjb21iYXRfaWNvbnNDb250cm9sLnVuaXRfZWRnZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIGNvbWJhdF9pY29ucy51bml0X2VkZ2UgPSBwYXJzZUludChjb21iYXRfaWNvbnNDb250cm9sLnVuaXRfZWRnZS52YWx1ZSlcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImNvbWJhdF9pY29ucy51bml0X2VkZ2U6XCIsIGNvbWJhdF9pY29ucy51bml0X2VkZ2UpXHJcbn0pLCBjb21iYXRfaWNvbnNDb250cm9sLmJsYXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29tYmF0X2ljb25zLmJsYXN0ID0gcGFyc2VJbnQoY29tYmF0X2ljb25zQ29udHJvbC5ibGFzdC52YWx1ZSlcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImNvbWJhdF9pY29ucy5ibGFzdDpcIiwgY29tYmF0X2ljb25zLmJsYXN0KVxyXG59KSwgY29tYmF0X2ljb25zQ29udHJvbC5ibGFzdF9lZGdlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29tYmF0X2ljb25zLmJsYXN0X2VkZ2UgPSBwYXJzZUludChjb21iYXRfaWNvbnNDb250cm9sLmJsYXN0X2VkZ2UudmFsdWUpXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJjb21iYXRfaWNvbnMuYmxhc3RfZWRnZTpcIiwgY29tYmF0X2ljb25zLmJsYXN0X2VkZ2UpXHJcbn0pLCBjb21iYXRfaWNvbnNDb250cm9sLnRhY3RpY3MuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBjb21iYXRfaWNvbnMudGFjdGljcyA9IHBhcnNlSW50KGNvbWJhdF9pY29uc0NvbnRyb2wudGFjdGljcy52YWx1ZSlcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImNvbWJhdF9pY29ucy50YWN0aWNzOlwiLCBjb21iYXRfaWNvbnMudGFjdGljcylcclxufSksIGNvbWJhdF9pY29uc0NvbnRyb2wudGFjdGljc19lZGdlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgY29tYmF0X2ljb25zLnRhY3RpY3NfZWRnZSA9IHBhcnNlSW50KGNvbWJhdF9pY29uc0NvbnRyb2wudGFjdGljc19lZGdlLnZhbHVlKVxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwiY29tYmF0X2ljb25zLnRhY3RpY3NfZWRnZTpcIiwgY29tYmF0X2ljb25zLnRhY3RpY3NfZWRnZSlcclxufSlcclxuaHBDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgaHAgPSBocENvbnRyb2wudmFsdWVcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImhwOlwiLCBocClcclxufSlcclxucmVzb3VyY2VDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgcmVzb3VyY2UgPSByZXNvdXJjZUNvbnRyb2wudmFsdWVcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcInJlc291cmNlOlwiLCByZXNvdXJjZSlcclxufSlcclxucHJpb3JpdHlDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgcHJpb3JpdHkgPSBwcmlvcml0eUNvbnRyb2wudmFsdWVcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcInByaW9yaXR5OlwiLCBwcmlvcml0eSlcclxufSlcclxudHJhaXRzQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgdHJhaXRzID0gdHJhaXRzQ29udHJvbC52YWx1ZVxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwidHJhaXRzOlwiLCB0cmFpdHMpXHJcbn0pXHJcblxyXG50ZXh0Q29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgdGV4dCA9IHRleHRDb250cm9sLnZhbHVlXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJ0ZXh0OlwiLCB0ZXh0KVxyXG59KVxyXG50ZXh0RWRpdG9yLmxvYWRCdXR0b25zKClcclxuXHJcbmRlc2NyaXB0aW9uQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xyXG4gICAgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbkNvbnRyb2wudmFsdWVcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcImRlc2NyaXB0aW9uOlwiLCBkZXNjcmlwdGlvbilcclxufSlcclxuXHJcbmxldCBwaWN0dXJlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxucGljdHVyZVJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcclxuICAgIHBpY3R1cmU2NCA9IHBpY3R1cmVSZWFkZXIucmVzdWx0XHJcbn1cclxucGljdHVyZUNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICBsZXQgZmlsZXMgPSBwaWN0dXJlQ29udHJvbC5maWxlc1xyXG4gICAgcGljdHVyZSA9IGZpbGVzLmxlbmd0aCAhPT0gMCA/IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZXNbMF0pIDogbnVsbFxyXG4gICAgaWYoZmlsZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgcGljdHVyZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVzWzBdKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwaWN0dXJlNjQgPSBcIlwiXHJcbiAgICB9XHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJwaWN0dXJlOlwiLCBwaWN0dXJlKVxyXG59KVxyXG5cclxuc2V0X251bWJlckNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgIHNldF9udW1iZXIgPSBzZXRfbnVtYmVyQ29udHJvbC52YWx1ZVxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwic2V0X251bWJlcjpcIiwgc2V0X251bWJlcilcclxufSlcclxuc2V0X29yZGVyQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIHNldF9vcmRlciA9IHNldF9vcmRlckNvbnRyb2wudmFsdWVcclxuICAgIGlmIChsb2dnaW5nKSBjb25zb2xlLmxvZyhcInNldF9vcmRlcjpcIiwgc2V0X29yZGVyKVxyXG59KVxyXG5cclxubGV0IGN5Y2xlX2ltYWdlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuY3ljbGVfaW1hZ2VSZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjeWNsZV9pbWFnZV82NCA9IGN5Y2xlX2ltYWdlUmVhZGVyLnJlc3VsdFxyXG59XHJcbmN5Y2xlX2ltYWdlQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgIGxldCBmaWxlcyA9IGN5Y2xlX2ltYWdlQ29udHJvbC5maWxlc1xyXG4gICAgY3ljbGVfaW1hZ2UgPSBmaWxlcy5sZW5ndGggIT09IDAgPyBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKSA6IG51bGxcclxuICAgIGlmKGZpbGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGN5Y2xlX2ltYWdlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZXNbMF0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN5Y2xlX2ltYWdlXzY0ID0gXCJcIlxyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwiY3ljbGVfaW1hZ2U6XCIsIGN5Y2xlX2ltYWdlKVxyXG59KVxyXG5maWxlTmFtZUNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcclxuICAgIGZpbGVOYW1lID0gZmlsZU5hbWVDb250cm9sLnZhbHVlXHJcbiAgICBpZiAobG9nZ2luZykgY29uc29sZS5sb2coXCJmaWxlTmFtZTpcIiwgZmlsZU5hbWUpXHJcbn0pXHJcblxyXG5jb25zdCBnZW5lcmF0ZUNhcmQgPSAoKSA9PiB7XHJcbiAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIilcclxuICAgIHVwZGF0ZVByZXZpZXcoY2FyZFR5cGUsIGFmZmlsaWF0aW9uLCB1bml0TmFtZSwgdW5pcXVlLCBjb3N0LCBmb3JjZSwgY29tYmF0X2ljb25zLCBocCwgcmVzb3VyY2UsIHByaW9yaXR5LCB0cmFpdHMsIHRleHQsIGRlc2NyaXB0aW9uLCBwaWN0dXJlLCBzZXRfbnVtYmVyLCBzZXRfb3JkZXIsIGN5Y2xlX2ltYWdlKVxyXG59XHJcbmNvbnN0IHNhdmVDYXJkID0gKCkgPT4ge1xyXG4gICAgaHRtbFRvSW1hZ2UudG9QbmcoY2FyZERpdikudGhlbihmdW5jdGlvbiAoZGF0YVVybCkge1xyXG4gICAgICAgIGRvd25sb2FkKGRhdGFVcmwsIGZpbGVOYW1lICsgXCIucG5nXCIpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBzYXZlRGF0YSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHBpY3R1cmVQYXJhbXMgPSBnZXRQaWN0dXJlUGFyYW1zKClcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgY2FyZFR5cGU6IGNhcmRUeXBlLFxyXG4gICAgICAgIGFmZmlsaWF0aW9uOiBhZmZpbGlhdGlvbixcclxuICAgICAgICB1bml0TmFtZTogdW5pdE5hbWUsXHJcbiAgICAgICAgdW5pcXVlOiB1bmlxdWUsXHJcbiAgICAgICAgY29zdDogY29zdCxcclxuICAgICAgICBmb3JjZTogZm9yY2UsXHJcbiAgICAgICAgY29tYmF0X2ljb25zOiBjb21iYXRfaWNvbnMsXHJcbiAgICAgICAgaHA6IGhwLFxyXG4gICAgICAgIHJlc291cmNlOiByZXNvdXJjZSxcclxuICAgICAgICBwcmlvcml0eTogcHJpb3JpdHksXHJcbiAgICAgICAgdHJhaXRzOiB0cmFpdHMsXHJcbiAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgICAgICAgc2V0X251bWJlcjogc2V0X251bWJlcixcclxuICAgICAgICBzZXRfb3JkZXI6IHNldF9vcmRlcixcclxuICAgICAgICBwaWN0dXJlVG9wOiBwaWN0dXJlUGFyYW1zLnRvcCxcclxuICAgICAgICBwaWN0dXJlTGVmdDogcGljdHVyZVBhcmFtcy5sZWZ0LFxyXG4gICAgICAgIHBpY3R1cmVXaWR0aDogcGljdHVyZVBhcmFtcy53aWR0aCxcclxuICAgICAgICBwaWN0dXJlUm90YXRpb246IHBpY3R1cmVQYXJhbXMucm90YXRpb24sXHJcbiAgICAgICAgcGljdHVyZTogcGljdHVyZTY0LFxyXG4gICAgICAgIGN5Y2xlX2ltYWdlOiBjeWNsZV9pbWFnZV82NFxyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2dpbmcpIGNvbnNvbGUubG9nKFwiZGF0YTpcIiwgZGF0YSlcclxuICAgIGNvbnN0IGRhdGFTdHJpbmcgPSBZYW1sLmR1bXAoZGF0YSlcclxuICAgIGRvd25sb2FkKGRhdGFTdHJpbmcsIGZpbGVOYW1lICsgXCIuc3dsY2dcIilcclxufVxyXG5cclxuY29uc3QgbG9hZERhdGEgPSAoZGF0YU9iaikgPT4ge1xyXG4gICAgY2FyZFR5cGUgPSBkYXRhT2JqLmNhcmRUeXBlXHJcbiAgICBjYXJkVHlwZXNDb250cm9sLmZvckVhY2gocmFkaW8gPT4ge2lmKHJhZGlvLmlkID09PSBjYXJkVHlwZSkgcmFkaW8uY2hlY2tlZCA9IHRydWU7IGVsc2UgcmFkaW8uY2hlY2tlZCA9IGZhbHNlOyB9KVxyXG4gICAgYWZmaWxpYXRpb24gPSBkYXRhT2JqLmFmZmlsaWF0aW9uXHJcbiAgICBhZmZpbGlhdGlvbnNDb250cm9sLmZvckVhY2gocmFkaW8gPT4ge2lmKHJhZGlvLmlkID09PSBhZmZpbGlhdGlvbikgcmFkaW8uY2hlY2tlZCA9IHRydWU7IGVsc2UgcmFkaW8uY2hlY2tlZCA9IGZhbHNlOyB9KVxyXG4gICAgYWZmaWxpYXRpb25zQ29udHJvbC52YWx1ZSA9IGFmZmlsaWF0aW9uXHJcbiAgICB1bml0TmFtZSA9IGRhdGFPYmoudW5pdE5hbWVcclxuICAgIG5hbWVDb250cm9sLnZhbHVlID0gdW5pdE5hbWVcclxuICAgIHVuaXF1ZSA9IGRhdGFPYmoudW5pcXVlXHJcbiAgICB1bmlxdWVDb250cm9sLmNoZWNrZWQgPSB1bmlxdWVcclxuICAgIGNvc3QgPSBkYXRhT2JqLmNvc3RcclxuICAgIGNvc3RDb250cm9sLnZhbHVlID0gY29zdFxyXG4gICAgZm9yY2UgPSBkYXRhT2JqLmZvcmNlXHJcbiAgICBmb3JjZUNvbnRyb2wudmFsdWUgPSBmb3JjZVxyXG4gICAgY29tYmF0X2ljb25zID0gZGF0YU9iai5jb21iYXRfaWNvbnNcclxuICAgIGNvbWJhdF9pY29uc0NvbnRyb2wudW5pdC52YWx1ZSA9IGNvbWJhdF9pY29ucy51bml0XHJcbiAgICBjb21iYXRfaWNvbnNDb250cm9sLnVuaXRfZWRnZS52YWx1ZSA9IGNvbWJhdF9pY29ucy51bml0X2VkZ2VcclxuICAgIGNvbWJhdF9pY29uc0NvbnRyb2wuYmxhc3QudmFsdWUgPSBjb21iYXRfaWNvbnMuYmxhc3RcclxuICAgIGNvbWJhdF9pY29uc0NvbnRyb2wuYmxhc3RfZWRnZS52YWx1ZSA9IGNvbWJhdF9pY29ucy5ibGFzdF9lZGdlXHJcbiAgICBjb21iYXRfaWNvbnNDb250cm9sLnRhY3RpY3MudmFsdWUgPSBjb21iYXRfaWNvbnMudGFjdGljc1xyXG4gICAgY29tYmF0X2ljb25zQ29udHJvbC50YWN0aWNzX2VkZ2UudmFsdWUgPSBjb21iYXRfaWNvbnMudGFjdGljc19lZGdlXHJcbiAgICBocCA9IGRhdGFPYmouaHBcclxuICAgIGhwQ29udHJvbC52YWx1ZSA9IGhwXHJcbiAgICByZXNvdXJjZSA9IGRhdGFPYmoucmVzb3VyY2VcclxuICAgIHJlc291cmNlQ29udHJvbC52YWx1ZSA9IHJlc291cmNlXHJcbiAgICBwcmlvcml0eSA9IGRhdGFPYmoucHJpb3JpdHlcclxuICAgIHByaW9yaXR5Q29udHJvbC52YWx1ZSA9IHByaW9yaXR5XHJcbiAgICB0cmFpdHMgPSBkYXRhT2JqLnRyYWl0c1xyXG4gICAgdHJhaXRzQ29udHJvbC52YWx1ZSA9IHRyYWl0c1xyXG4gICAgdGV4dCA9IGRhdGFPYmoudGV4dFxyXG4gICAgdGV4dENvbnRyb2wudmFsdWUgPSB0ZXh0XHJcbiAgICBkZXNjcmlwdGlvbiA9IGRhdGFPYmouZGVzY3JpcHRpb25cclxuICAgIGRlc2NyaXB0aW9uQ29udHJvbC52YWx1ZSA9IGRlc2NyaXB0aW9uXHJcbiAgICBzZXRfbnVtYmVyID0gZGF0YU9iai5zZXRfbnVtYmVyXHJcbiAgICBzZXRfbnVtYmVyQ29udHJvbC52YWx1ZSA9IHNldF9udW1iZXJcclxuICAgIHNldF9vcmRlciA9IGRhdGFPYmouc2V0X29yZGVyXHJcbiAgICBzZXRfb3JkZXJDb250cm9sLnZhbHVlID0gc2V0X29yZGVyXHJcbiAgICBcclxuICAgIHBpY3R1cmUgPSBkYXRhT2JqLnBpY3R1cmVcclxuICAgIHBpY3R1cmU2NCA9IHBpY3R1cmVcclxuICAgIHBpY3R1cmVDb250cm9sLnZhbHVlID0gXCJcIlxyXG4gICAgY3ljbGVfaW1hZ2UgPSBkYXRhT2JqLmN5Y2xlX2ltYWdlXHJcbiAgICBjeWNsZV9pbWFnZV82NCA9IGN5Y2xlX2ltYWdlXHJcbiAgICBjeWNsZV9pbWFnZUNvbnRyb2wudmFsdWUgPSBcIlwiXHJcbiAgICBcclxuICAgIHRvcElucHV0TnVtYmVyLnZhbHVlID0gZGF0YU9iai5waWN0dXJlVG9wID8/IDBcclxuICAgIGxlZnRJbnB1dE51bWJlci52YWx1ZSA9IGRhdGFPYmoucGljdHVyZUxlZnQgPz8gMFxyXG4gICAgd2lkdGhJbnB1dE51bWJlci52YWx1ZSA9IGRhdGFPYmoucGljdHVyZVdpZHRoID8/IDEwMFxyXG4gICAgcm90YXRpb25JbnB1dE51bWJlci52YWx1ZSA9IGRhdGFPYmoucGljdHVyZVJvdGF0aW9uID8/IDBcclxuICAgIGxldCBpbnB1dEV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWV9KVxyXG4gICAgdG9wSW5wdXROdW1iZXIuZGlzcGF0Y2hFdmVudChpbnB1dEV2ZW50KVxyXG4gICAgbGVmdElucHV0TnVtYmVyLmRpc3BhdGNoRXZlbnQoaW5wdXRFdmVudClcclxuICAgIHdpZHRoSW5wdXROdW1iZXIuZGlzcGF0Y2hFdmVudChpbnB1dEV2ZW50KVxyXG4gICAgcm90YXRpb25JbnB1dE51bWJlci5kaXNwYXRjaEV2ZW50KGlucHV0RXZlbnQpXHJcbn1cclxuXHJcbmdlbmVyYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBnZW5lcmF0ZUNhcmQoKVxyXG59KVxyXG5cclxuc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgc2F2ZUNhcmQoKSAgIFxyXG59KVxyXG5cclxuc2F2ZURhdGFCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIHNhdmVEYXRhKClcclxufSlcclxuXHJcbmxvYWREYXRhQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgaWYobG9hZERhdGFCdXR0b24uZmlsZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGZpbGVOYW1lQ29udHJvbC52YWx1ZSA9IGZpbGVOYW1lRnJvbVBhdGgobG9hZERhdGFCdXR0b24udmFsdWUpXHJcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWVDb250cm9sLnZhbHVlXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBZYW1sLmxvYWQocmVhZGVyLnJlc3VsdClcclxuICAgICAgICAgICAgbG9hZERhdGEoZGF0YSlcclxuICAgICAgICAgICAgZ2VuZXJhdGVDYXJkKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQobG9hZERhdGFCdXR0b24uZmlsZXNbMF0pXHJcbiAgICB9XHJcbn0pXHJcblxyXG5leHRyYWN0UGljdHVyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaHRtbFRvSW1hZ2UudG9QbmcocGljdHVyZUltZykudGhlbihmdW5jdGlvbiAoZGF0YVVybCkge1xyXG4gICAgICAgIGRvd25sb2FkKGRhdGFVcmwsIGZpbGVOYW1lICsgXCJfcGljdHVyZS5wbmdcIilcclxuICAgIH0pXHJcbn0pXHJcblxyXG5leHRyYWN0Q3ljbGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJjeWNsZV9pbWFnZTpcIiwgY3ljbGVJbWcpXHJcbiAgICBodG1sVG9JbWFnZS50b1BuZyhjeWNsZUltZykudGhlbihmdW5jdGlvbiAoZGF0YVVybCkge1xyXG4gICAgICAgIGRvd25sb2FkKGRhdGFVcmwsIGZpbGVOYW1lICsgXCJfY3ljbGUucG5nXCIpXHJcbiAgICB9KVxyXG59KVxyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICBpZiAoZS5jdHJsS2V5ICYmIGUua2V5ID09PSBcIkVudGVyXCIpIHtcclxuICAgICAgICBnZW5lcmF0ZUNhcmQoKVxyXG4gICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5rZXkgPT09IFwic1wiKSB7XHJcbiAgICAgICAgc2F2ZUNhcmQoKVxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgfSBlbHNlIGlmIChlLmFsdEtleSAmJiBlLmtleSA9PT0gXCJjXCIpIHtcclxuICAgICAgICBzYXZlRGF0YSgpXHJcbiAgICB9IGVsc2UgaWYgKGUuYWx0S2V5ICYmIGUua2V5ID09PSBcInZcIikge1xyXG4gICAgICAgIGxvYWREYXRhQnV0dG9uLmNsaWNrKClcclxuICAgIH1cclxufSkiLCJjb25zdCBlZGl0b3JGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlZGl0b3JcIilcclxuY29uc3QgdGV4dENvbnRyb2wgPSBlZGl0b3JGb3JtLnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVtuYW1lPXRleHRdXCIpXHJcbmNvbnN0IGJ1dHRvbnNDb250cm9sID0gZWRpdG9yRm9ybS5xdWVyeVNlbGVjdG9yKFwiI3RleHRfYnV0dG9uc1wiKVxyXG5jb25zdCBib2xkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNib2xkXCIpXHJcbmNvbnN0IGl0YWxpY0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaXRhbGljXCIpXHJcbmNvbnN0IG5ld2xpbmVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25ld2xpbmVcIilcclxuXHJcbmxldCBlZGdlUHJlc3NlZCA9IGZhbHNlXHJcbmV4cG9ydHMubG9hZEJ1dHRvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0ZXh0Q29udHJvbC5zZWxlY3Rpb25TdGFydCA9IDBcclxuICAgIHRleHRDb250cm9sLnNlbGVjdGlvbkVuZCA9IDBcclxuXHJcbiAgICB0ZXh0Q29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgIGlmKGUua2V5ID09PSBcIlRhYlwiKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBhZGRUb1RleHQoXCJ0YWJcIilcclxuICAgICAgICB9IGVsc2UgaWYoZS5zaGlmdEtleSAmJiBlLmtleSA9PT0gXCJFbnRlclwiKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBhZGRUb1RleHQoXCJuZXdsaW5lXCIpXHJcbiAgICAgICAgfSAvKiBmb3JtYXQgKi8gZWxzZSBpZihlLmN0cmxLZXkgJiYgZS5rZXkgPT09IFwiYlwiKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBhZGREb3VibGVUb1RleHQoXCJib2xkXCIpXHJcbiAgICAgICAgfSBlbHNlIGlmKGUuY3RybEtleSAmJiBlLmtleSA9PT0gXCJpXCIpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIGFkZERvdWJsZVRvVGV4dChcIml0YWxpY1wiKVxyXG4gICAgICAgIH0gLyogY29tYmF0IGljb25zICovIGVsc2UgaWYoZS5hbHRLZXkgJiYgZS5rZXkgPT09IFwiZVwiKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBlZGdlUHJlc3NlZCA9IHRydWVcclxuICAgICAgICB9IGVsc2UgaWYoZS5hbHRLZXkgJiYgZS5rZXkgPT09IFwidVwiKSB7XHJcbiAgICAgICAgICAgIGlmKGVkZ2VQcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRUb1RleHQoXCJ1bml0X2VkZ2VcIilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZFRvVGV4dChcInVuaXRcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZihlLmFsdEtleSAmJiBlLmtleSA9PT0gXCJiXCIpIHtcclxuICAgICAgICAgICAgaWYoZWRnZVByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgIGFkZFRvVGV4dChcImJsYXN0X2VkZ2VcIilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZFRvVGV4dChcImJsYXN0XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYoZS5hbHRLZXkgJiYgZS5rZXkgPT09IFwidFwiKSB7XHJcbiAgICAgICAgICAgIGlmKGVkZ2VQcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRUb1RleHQoXCJ0YWN0aWNzX2VkZ2VcIilcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFkZFRvVGV4dChcInRhY3RpY3NcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLyogYWZmaWxpYXRpb24gKi8gZWxzZSBpZihlLmFsdEtleSAmJiBlLmtleSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgYWRkVG9UZXh0KFwic2l0aFwiKVxyXG4gICAgICAgIH0gZWxzZSBpZihlLmFsdEtleSAmJiBlLmtleSA9PT0gXCIyXCIpIHtcclxuICAgICAgICAgICAgYWRkVG9UZXh0KFwiaW1wZXJpYWxcIilcclxuICAgICAgICB9IGVsc2UgaWYoZS5hbHRLZXkgJiYgZS5rZXkgPT09IFwiM1wiKSB7XHJcbiAgICAgICAgICAgIGFkZFRvVGV4dChcInNjdW1cIilcclxuICAgICAgICB9IGVsc2UgaWYoZS5hbHRLZXkgJiYgZS5rZXkgPT09IFwiNFwiKSB7XHJcbiAgICAgICAgICAgIGFkZFRvVGV4dChcInNtdWdnbGVyXCIpXHJcbiAgICAgICAgfSBlbHNlIGlmKGUuYWx0S2V5ICYmIGUua2V5ID09PSBcIjVcIikge1xyXG4gICAgICAgICAgICBhZGRUb1RleHQoXCJyZWJlbFwiKVxyXG4gICAgICAgIH0gZWxzZSBpZihlLmFsdEtleSAmJiBlLmtleSA9PT0gXCI2XCIpIHtcclxuICAgICAgICAgICAgYWRkVG9UZXh0KFwiamVkaVwiKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICB0ZXh0Q29udHJvbC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGUpID0+IHtcclxuICAgICAgICBpZihlLmtleSA9PT0gXCJlXCIpIHtcclxuICAgICAgICAgICAgZWRnZVByZXNzZWQgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgYnV0dG9uc0NvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgaWYoZS50YXJnZXQudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImltZ1wiKSkge1xyXG4gICAgICAgICAgICBhZGRUb1RleHQoZS50YXJnZXQuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGJvbGRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgYWRkRG91YmxlVG9UZXh0KFwiYm9sZFwiKVxyXG4gICAgfSlcclxuICAgIGl0YWxpY0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBhZGREb3VibGVUb1RleHQoXCJpdGFsaWNcIilcclxuICAgIH0pXHJcbiAgICBuZXdsaW5lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGFkZFRvVGV4dChcIm5ld2xpbmVcIilcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIilcclxuXHJcbmNvbnN0IHRleHRLZXkgPSB7XHJcbiAgICBcInVuaXRcIjogXCJbdV1cIixcclxuICAgIFwidW5pdF9lZGdlXCI6IFwiW3VlXVwiLFxyXG4gICAgXCJibGFzdFwiOiBcIltiXVwiLFxyXG4gICAgXCJibGFzdF9lZGdlXCI6IFwiW2JlXVwiLFxyXG4gICAgXCJ0YWN0aWNzXCI6IFwiW3RdXCIsXHJcbiAgICBcInRhY3RpY3NfZWRnZVwiOiBcIlt0ZV1cIixcclxuICAgIFwic2l0aFwiOiBcIltBc2ldXCIsXHJcbiAgICBcImltcGVyaWFsXCI6IFwiW0FpXVwiLFxyXG4gICAgXCJzY3VtXCI6IFwiW0FzY11cIixcclxuICAgIFwic211Z2dsZXJcIjogXCJbQXNtXVwiLFxyXG4gICAgXCJyZWJlbFwiOiBcIltBcl1cIixcclxuICAgIFwiamVkaVwiOiBcIltBal1cIixcclxuICAgIFwidGFiXCI6IFwiICAgIFwiLFxyXG4gICAgXCJuZXdsaW5lXCI6IFwiPGJyPlwiXHJcbn1cclxuZnVuY3Rpb24gYWRkVG9UZXh0IChrZXkpIHtcclxuICAgIGxldCBzdHIgPSB0ZXh0S2V5W2tleV0gPz8gXCJcIlxyXG4gICAgbGV0IHRleHQgPSB0ZXh0Q29udHJvbC52YWx1ZVxyXG4gICAgbGV0IHN0YXJ0ID0gdGV4dENvbnRyb2wuc2VsZWN0aW9uU3RhcnRcclxuICAgIGxldCBlbmQgPSB0ZXh0Q29udHJvbC5zZWxlY3Rpb25FbmRcclxuICAgIGxldCBiZWZvcmUgPSB0ZXh0LnN1YnN0cmluZygwLCBzdGFydClcclxuICAgIGxldCBhZnRlciA9IHRleHQuc3Vic3RyaW5nKGVuZClcclxuICAgIGxldCBuZXdUZXh0ID0gYmVmb3JlICsgc3RyICsgYWZ0ZXJcclxuICAgIHRleHRDb250cm9sLnZhbHVlID0gbmV3VGV4dFxyXG4gICAgdGV4dENvbnRyb2wuc2VsZWN0aW9uU3RhcnQgPSBzdGFydCArIHN0ci5sZW5ndGhcclxuICAgIHRleHRDb250cm9sLnNlbGVjdGlvbkVuZCA9IHN0YXJ0ICsgc3RyLmxlbmd0aFxyXG4gICAgdGV4dENvbnRyb2wuZGlzcGF0Y2hFdmVudChldmVudClcclxufVxyXG5cclxuY29uc3QgZG91YmxlVGV4dEtleSA9IHtcclxuICAgIFwiYm9sZFwiOiBbXCIqKlwiLCBcIioqXCJdLFxyXG4gICAgXCJpdGFsaWNcIjogW1wiKlwiLCBcIipcIl1cclxufVxyXG5mdW5jdGlvbiBhZGREb3VibGVUb1RleHQgKGtleSkge1xyXG4gICAgbGV0IGZpcnN0ID0gZG91YmxlVGV4dEtleVtrZXldPy5bMF0gPz8gXCJcIlxyXG4gICAgbGV0IHNlY29uZCA9IGRvdWJsZVRleHRLZXlba2V5XT8uWzFdID8/IFwiXCJcclxuICAgIGxldCB0ZXh0ID0gdGV4dENvbnRyb2wudmFsdWVcclxuICAgIGxldCBzdGFydCA9IHRleHRDb250cm9sLnNlbGVjdGlvblN0YXJ0XHJcbiAgICBsZXQgZW5kID0gdGV4dENvbnRyb2wuc2VsZWN0aW9uRW5kXHJcbiAgICBsZXQgYmVmb3JlID0gdGV4dC5zdWJzdHJpbmcoMCwgc3RhcnQpXHJcbiAgICBsZXQgc2VsZWN0ZWQgPSB0ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKVxyXG4gICAgbGV0IGFmdGVyID0gdGV4dC5zdWJzdHJpbmcoZW5kKVxyXG4gICAgbGV0IG5ld1RleHQgPSBiZWZvcmUgKyBmaXJzdCArIHNlbGVjdGVkICsgc2Vjb25kICsgYWZ0ZXJcclxuICAgIHRleHRDb250cm9sLnZhbHVlID0gbmV3VGV4dFxyXG4gICAgdGV4dENvbnRyb2wuc2VsZWN0aW9uU3RhcnQgPSBzdGFydCArIGZpcnN0Lmxlbmd0aFxyXG4gICAgdGV4dENvbnRyb2wuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyBmaXJzdC5sZW5ndGggKyBzZWxlY3RlZC5sZW5ndGhcclxuICAgIHRleHRDb250cm9sLmRpc3BhdGNoRXZlbnQoZXZlbnQpXHJcbn0iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIGxvYWRlciA9IHJlcXVpcmUoJy4vbGliL2xvYWRlcicpO1xudmFyIGR1bXBlciA9IHJlcXVpcmUoJy4vbGliL2R1bXBlcicpO1xuXG5cbmZ1bmN0aW9uIHJlbmFtZWQoZnJvbSwgdG8pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9uIHlhbWwuJyArIGZyb20gKyAnIGlzIHJlbW92ZWQgaW4ganMteWFtbCA0LiAnICtcbiAgICAgICdVc2UgeWFtbC4nICsgdG8gKyAnIGluc3RlYWQsIHdoaWNoIGlzIG5vdyBzYWZlIGJ5IGRlZmF1bHQuJyk7XG4gIH07XG59XG5cblxubW9kdWxlLmV4cG9ydHMuVHlwZSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vbGliL3R5cGUnKTtcbm1vZHVsZS5leHBvcnRzLlNjaGVtYSAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2xpYi9zY2hlbWEnKTtcbm1vZHVsZS5leHBvcnRzLkZBSUxTQUZFX1NDSEVNQSAgICAgPSByZXF1aXJlKCcuL2xpYi9zY2hlbWEvZmFpbHNhZmUnKTtcbm1vZHVsZS5leHBvcnRzLkpTT05fU0NIRU1BICAgICAgICAgPSByZXF1aXJlKCcuL2xpYi9zY2hlbWEvanNvbicpO1xubW9kdWxlLmV4cG9ydHMuQ09SRV9TQ0hFTUEgICAgICAgICA9IHJlcXVpcmUoJy4vbGliL3NjaGVtYS9jb3JlJyk7XG5tb2R1bGUuZXhwb3J0cy5ERUZBVUxUX1NDSEVNQSAgICAgID0gcmVxdWlyZSgnLi9saWIvc2NoZW1hL2RlZmF1bHQnKTtcbm1vZHVsZS5leHBvcnRzLmxvYWQgICAgICAgICAgICAgICAgPSBsb2FkZXIubG9hZDtcbm1vZHVsZS5leHBvcnRzLmxvYWRBbGwgICAgICAgICAgICAgPSBsb2FkZXIubG9hZEFsbDtcbm1vZHVsZS5leHBvcnRzLmR1bXAgICAgICAgICAgICAgICAgPSBkdW1wZXIuZHVtcDtcbm1vZHVsZS5leHBvcnRzLllBTUxFeGNlcHRpb24gICAgICAgPSByZXF1aXJlKCcuL2xpYi9leGNlcHRpb24nKTtcblxuLy8gUmUtZXhwb3J0IGFsbCB0eXBlcyBpbiBjYXNlIHVzZXIgd2FudHMgdG8gY3JlYXRlIGN1c3RvbSBzY2hlbWFcbm1vZHVsZS5leHBvcnRzLnR5cGVzID0ge1xuICBiaW5hcnk6ICAgIHJlcXVpcmUoJy4vbGliL3R5cGUvYmluYXJ5JyksXG4gIGZsb2F0OiAgICAgcmVxdWlyZSgnLi9saWIvdHlwZS9mbG9hdCcpLFxuICBtYXA6ICAgICAgIHJlcXVpcmUoJy4vbGliL3R5cGUvbWFwJyksXG4gIG51bGw6ICAgICAgcmVxdWlyZSgnLi9saWIvdHlwZS9udWxsJyksXG4gIHBhaXJzOiAgICAgcmVxdWlyZSgnLi9saWIvdHlwZS9wYWlycycpLFxuICBzZXQ6ICAgICAgIHJlcXVpcmUoJy4vbGliL3R5cGUvc2V0JyksXG4gIHRpbWVzdGFtcDogcmVxdWlyZSgnLi9saWIvdHlwZS90aW1lc3RhbXAnKSxcbiAgYm9vbDogICAgICByZXF1aXJlKCcuL2xpYi90eXBlL2Jvb2wnKSxcbiAgaW50OiAgICAgICByZXF1aXJlKCcuL2xpYi90eXBlL2ludCcpLFxuICBtZXJnZTogICAgIHJlcXVpcmUoJy4vbGliL3R5cGUvbWVyZ2UnKSxcbiAgb21hcDogICAgICByZXF1aXJlKCcuL2xpYi90eXBlL29tYXAnKSxcbiAgc2VxOiAgICAgICByZXF1aXJlKCcuL2xpYi90eXBlL3NlcScpLFxuICBzdHI6ICAgICAgIHJlcXVpcmUoJy4vbGliL3R5cGUvc3RyJylcbn07XG5cbi8vIFJlbW92ZWQgZnVuY3Rpb25zIGZyb20gSlMtWUFNTCAzLjAueFxubW9kdWxlLmV4cG9ydHMuc2FmZUxvYWQgICAgICAgICAgICA9IHJlbmFtZWQoJ3NhZmVMb2FkJywgJ2xvYWQnKTtcbm1vZHVsZS5leHBvcnRzLnNhZmVMb2FkQWxsICAgICAgICAgPSByZW5hbWVkKCdzYWZlTG9hZEFsbCcsICdsb2FkQWxsJyk7XG5tb2R1bGUuZXhwb3J0cy5zYWZlRHVtcCAgICAgICAgICAgID0gcmVuYW1lZCgnc2FmZUR1bXAnLCAnZHVtcCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKmVzbGludC1kaXNhYmxlIG1heC1sZW4sbm8tdXNlLWJlZm9yZS1kZWZpbmUqL1xuXG52YXIgY29tbW9uICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgWUFNTEV4Y2VwdGlvbiAgICAgICA9IHJlcXVpcmUoJy4vZXhjZXB0aW9uJyk7XG52YXIgbWFrZVNuaXBwZXQgICAgICAgICA9IHJlcXVpcmUoJy4vc25pcHBldCcpO1xudmFyIERFRkFVTFRfU0NIRU1BICAgICAgPSByZXF1aXJlKCcuL3NjaGVtYS9kZWZhdWx0Jyk7XG5cblxudmFyIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cblxudmFyIENPTlRFWFRfRkxPV19JTiAgID0gMTtcbnZhciBDT05URVhUX0ZMT1dfT1VUICA9IDI7XG52YXIgQ09OVEVYVF9CTE9DS19JTiAgPSAzO1xudmFyIENPTlRFWFRfQkxPQ0tfT1VUID0gNDtcblxuXG52YXIgQ0hPTVBJTkdfQ0xJUCAgPSAxO1xudmFyIENIT01QSU5HX1NUUklQID0gMjtcbnZhciBDSE9NUElOR19LRUVQICA9IDM7XG5cblxudmFyIFBBVFRFUk5fTk9OX1BSSU5UQUJMRSAgICAgICAgID0gL1tcXHgwMC1cXHgwOFxceDBCXFx4MENcXHgwRS1cXHgxRlxceDdGLVxceDg0XFx4ODYtXFx4OUZcXHVGRkZFXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0vO1xudmFyIFBBVFRFUk5fTk9OX0FTQ0lJX0xJTkVfQlJFQUtTID0gL1tcXHg4NVxcdTIwMjhcXHUyMDI5XS87XG52YXIgUEFUVEVSTl9GTE9XX0lORElDQVRPUlMgICAgICAgPSAvWyxcXFtcXF1cXHtcXH1dLztcbnZhciBQQVRURVJOX1RBR19IQU5ETEUgICAgICAgICAgICA9IC9eKD86IXwhIXwhW2EtelxcLV0rISkkL2k7XG52YXIgUEFUVEVSTl9UQUdfVVJJICAgICAgICAgICAgICAgPSAvXig/OiF8W14sXFxbXFxdXFx7XFx9XSkoPzolWzAtOWEtZl17Mn18WzAtOWEtelxcLSM7XFwvXFw/OkAmPVxcK1xcJCxfXFwuIX5cXConXFwoXFwpXFxbXFxdXSkqJC9pO1xuXG5cbmZ1bmN0aW9uIF9jbGFzcyhvYmopIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopOyB9XG5cbmZ1bmN0aW9uIGlzX0VPTChjKSB7XG4gIHJldHVybiAoYyA9PT0gMHgwQS8qIExGICovKSB8fCAoYyA9PT0gMHgwRC8qIENSICovKTtcbn1cblxuZnVuY3Rpb24gaXNfV0hJVEVfU1BBQ0UoYykge1xuICByZXR1cm4gKGMgPT09IDB4MDkvKiBUYWIgKi8pIHx8IChjID09PSAweDIwLyogU3BhY2UgKi8pO1xufVxuXG5mdW5jdGlvbiBpc19XU19PUl9FT0woYykge1xuICByZXR1cm4gKGMgPT09IDB4MDkvKiBUYWIgKi8pIHx8XG4gICAgICAgICAoYyA9PT0gMHgyMC8qIFNwYWNlICovKSB8fFxuICAgICAgICAgKGMgPT09IDB4MEEvKiBMRiAqLykgfHxcbiAgICAgICAgIChjID09PSAweDBELyogQ1IgKi8pO1xufVxuXG5mdW5jdGlvbiBpc19GTE9XX0lORElDQVRPUihjKSB7XG4gIHJldHVybiBjID09PSAweDJDLyogLCAqLyB8fFxuICAgICAgICAgYyA9PT0gMHg1Qi8qIFsgKi8gfHxcbiAgICAgICAgIGMgPT09IDB4NUQvKiBdICovIHx8XG4gICAgICAgICBjID09PSAweDdCLyogeyAqLyB8fFxuICAgICAgICAgYyA9PT0gMHg3RC8qIH0gKi87XG59XG5cbmZ1bmN0aW9uIGZyb21IZXhDb2RlKGMpIHtcbiAgdmFyIGxjO1xuXG4gIGlmICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKSB7XG4gICAgcmV0dXJuIGMgLSAweDMwO1xuICB9XG5cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlKi9cbiAgbGMgPSBjIHwgMHgyMDtcblxuICBpZiAoKDB4NjEvKiBhICovIDw9IGxjKSAmJiAobGMgPD0gMHg2Ni8qIGYgKi8pKSB7XG4gICAgcmV0dXJuIGxjIC0gMHg2MSArIDEwO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVkSGV4TGVuKGMpIHtcbiAgaWYgKGMgPT09IDB4NzgvKiB4ICovKSB7IHJldHVybiAyOyB9XG4gIGlmIChjID09PSAweDc1LyogdSAqLykgeyByZXR1cm4gNDsgfVxuICBpZiAoYyA9PT0gMHg1NS8qIFUgKi8pIHsgcmV0dXJuIDg7IH1cbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIGZyb21EZWNpbWFsQ29kZShjKSB7XG4gIGlmICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKSB7XG4gICAgcmV0dXJuIGMgLSAweDMwO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBzaW1wbGVFc2NhcGVTZXF1ZW5jZShjKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuICByZXR1cm4gKGMgPT09IDB4MzAvKiAwICovKSA/ICdcXHgwMCcgOlxuICAgICAgICAoYyA9PT0gMHg2MS8qIGEgKi8pID8gJ1xceDA3JyA6XG4gICAgICAgIChjID09PSAweDYyLyogYiAqLykgPyAnXFx4MDgnIDpcbiAgICAgICAgKGMgPT09IDB4NzQvKiB0ICovKSA/ICdcXHgwOScgOlxuICAgICAgICAoYyA9PT0gMHgwOS8qIFRhYiAqLykgPyAnXFx4MDknIDpcbiAgICAgICAgKGMgPT09IDB4NkUvKiBuICovKSA/ICdcXHgwQScgOlxuICAgICAgICAoYyA9PT0gMHg3Ni8qIHYgKi8pID8gJ1xceDBCJyA6XG4gICAgICAgIChjID09PSAweDY2LyogZiAqLykgPyAnXFx4MEMnIDpcbiAgICAgICAgKGMgPT09IDB4NzIvKiByICovKSA/ICdcXHgwRCcgOlxuICAgICAgICAoYyA9PT0gMHg2NS8qIGUgKi8pID8gJ1xceDFCJyA6XG4gICAgICAgIChjID09PSAweDIwLyogU3BhY2UgKi8pID8gJyAnIDpcbiAgICAgICAgKGMgPT09IDB4MjIvKiBcIiAqLykgPyAnXFx4MjInIDpcbiAgICAgICAgKGMgPT09IDB4MkYvKiAvICovKSA/ICcvJyA6XG4gICAgICAgIChjID09PSAweDVDLyogXFwgKi8pID8gJ1xceDVDJyA6XG4gICAgICAgIChjID09PSAweDRFLyogTiAqLykgPyAnXFx4ODUnIDpcbiAgICAgICAgKGMgPT09IDB4NUYvKiBfICovKSA/ICdcXHhBMCcgOlxuICAgICAgICAoYyA9PT0gMHg0Qy8qIEwgKi8pID8gJ1xcdTIwMjgnIDpcbiAgICAgICAgKGMgPT09IDB4NTAvKiBQICovKSA/ICdcXHUyMDI5JyA6ICcnO1xufVxuXG5mdW5jdGlvbiBjaGFyRnJvbUNvZGVwb2ludChjKSB7XG4gIGlmIChjIDw9IDB4RkZGRikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICB9XG4gIC8vIEVuY29kZSBVVEYtMTYgc3Vycm9nYXRlIHBhaXJcbiAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTE2I0NvZGVfcG9pbnRzX1UuMkIwMTAwMDBfdG9fVS4yQjEwRkZGRlxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAoKGMgLSAweDAxMDAwMCkgPj4gMTApICsgMHhEODAwLFxuICAgICgoYyAtIDB4MDEwMDAwKSAmIDB4MDNGRikgKyAweERDMDBcbiAgKTtcbn1cblxudmFyIHNpbXBsZUVzY2FwZUNoZWNrID0gbmV3IEFycmF5KDI1Nik7IC8vIGludGVnZXIsIGZvciBmYXN0IGFjY2Vzc1xudmFyIHNpbXBsZUVzY2FwZU1hcCA9IG5ldyBBcnJheSgyNTYpO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICBzaW1wbGVFc2NhcGVDaGVja1tpXSA9IHNpbXBsZUVzY2FwZVNlcXVlbmNlKGkpID8gMSA6IDA7XG4gIHNpbXBsZUVzY2FwZU1hcFtpXSA9IHNpbXBsZUVzY2FwZVNlcXVlbmNlKGkpO1xufVxuXG5cbmZ1bmN0aW9uIFN0YXRlKGlucHV0LCBvcHRpb25zKSB7XG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcblxuICB0aGlzLmZpbGVuYW1lICA9IG9wdGlvbnNbJ2ZpbGVuYW1lJ10gIHx8IG51bGw7XG4gIHRoaXMuc2NoZW1hICAgID0gb3B0aW9uc1snc2NoZW1hJ10gICAgfHwgREVGQVVMVF9TQ0hFTUE7XG4gIHRoaXMub25XYXJuaW5nID0gb3B0aW9uc1snb25XYXJuaW5nJ10gfHwgbnVsbDtcbiAgLy8gKEhpZGRlbikgUmVtb3ZlPyBtYWtlcyB0aGUgbG9hZGVyIHRvIGV4cGVjdCBZQU1MIDEuMSBkb2N1bWVudHNcbiAgLy8gaWYgc3VjaCBkb2N1bWVudHMgaGF2ZSBubyBleHBsaWNpdCAlWUFNTCBkaXJlY3RpdmVcbiAgdGhpcy5sZWdhY3kgICAgPSBvcHRpb25zWydsZWdhY3knXSAgICB8fCBmYWxzZTtcblxuICB0aGlzLmpzb24gICAgICA9IG9wdGlvbnNbJ2pzb24nXSAgICAgIHx8IGZhbHNlO1xuICB0aGlzLmxpc3RlbmVyICA9IG9wdGlvbnNbJ2xpc3RlbmVyJ10gIHx8IG51bGw7XG5cbiAgdGhpcy5pbXBsaWNpdFR5cGVzID0gdGhpcy5zY2hlbWEuY29tcGlsZWRJbXBsaWNpdDtcbiAgdGhpcy50eXBlTWFwICAgICAgID0gdGhpcy5zY2hlbWEuY29tcGlsZWRUeXBlTWFwO1xuXG4gIHRoaXMubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgdGhpcy5wb3NpdGlvbiAgID0gMDtcbiAgdGhpcy5saW5lICAgICAgID0gMDtcbiAgdGhpcy5saW5lU3RhcnQgID0gMDtcbiAgdGhpcy5saW5lSW5kZW50ID0gMDtcblxuICAvLyBwb3NpdGlvbiBvZiBmaXJzdCBsZWFkaW5nIHRhYiBpbiB0aGUgY3VycmVudCBsaW5lLFxuICAvLyB1c2VkIHRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gdGFicyBpbiB0aGUgaW5kZW50YXRpb25cbiAgdGhpcy5maXJzdFRhYkluTGluZSA9IC0xO1xuXG4gIHRoaXMuZG9jdW1lbnRzID0gW107XG5cbiAgLypcbiAgdGhpcy52ZXJzaW9uO1xuICB0aGlzLmNoZWNrTGluZUJyZWFrcztcbiAgdGhpcy50YWdNYXA7XG4gIHRoaXMuYW5jaG9yTWFwO1xuICB0aGlzLnRhZztcbiAgdGhpcy5hbmNob3I7XG4gIHRoaXMua2luZDtcbiAgdGhpcy5yZXN1bHQ7Ki9cblxufVxuXG5cbmZ1bmN0aW9uIGdlbmVyYXRlRXJyb3Ioc3RhdGUsIG1lc3NhZ2UpIHtcbiAgdmFyIG1hcmsgPSB7XG4gICAgbmFtZTogICAgIHN0YXRlLmZpbGVuYW1lLFxuICAgIGJ1ZmZlcjogICBzdGF0ZS5pbnB1dC5zbGljZSgwLCAtMSksIC8vIG9taXQgdHJhaWxpbmcgXFwwXG4gICAgcG9zaXRpb246IHN0YXRlLnBvc2l0aW9uLFxuICAgIGxpbmU6ICAgICBzdGF0ZS5saW5lLFxuICAgIGNvbHVtbjogICBzdGF0ZS5wb3NpdGlvbiAtIHN0YXRlLmxpbmVTdGFydFxuICB9O1xuXG4gIG1hcmsuc25pcHBldCA9IG1ha2VTbmlwcGV0KG1hcmspO1xuXG4gIHJldHVybiBuZXcgWUFNTEV4Y2VwdGlvbihtZXNzYWdlLCBtYXJrKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dFcnJvcihzdGF0ZSwgbWVzc2FnZSkge1xuICB0aHJvdyBnZW5lcmF0ZUVycm9yKHN0YXRlLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dXYXJuaW5nKHN0YXRlLCBtZXNzYWdlKSB7XG4gIGlmIChzdGF0ZS5vbldhcm5pbmcpIHtcbiAgICBzdGF0ZS5vbldhcm5pbmcuY2FsbChudWxsLCBnZW5lcmF0ZUVycm9yKHN0YXRlLCBtZXNzYWdlKSk7XG4gIH1cbn1cblxuXG52YXIgZGlyZWN0aXZlSGFuZGxlcnMgPSB7XG5cbiAgWUFNTDogZnVuY3Rpb24gaGFuZGxlWWFtbERpcmVjdGl2ZShzdGF0ZSwgbmFtZSwgYXJncykge1xuXG4gICAgdmFyIG1hdGNoLCBtYWpvciwgbWlub3I7XG5cbiAgICBpZiAoc3RhdGUudmVyc2lvbiAhPT0gbnVsbCkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2R1cGxpY2F0aW9uIG9mICVZQU1MIGRpcmVjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ1lBTUwgZGlyZWN0aXZlIGFjY2VwdHMgZXhhY3RseSBvbmUgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICBtYXRjaCA9IC9eKFswLTldKylcXC4oWzAtOV0rKSQvLmV4ZWMoYXJnc1swXSk7XG5cbiAgICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdpbGwtZm9ybWVkIGFyZ3VtZW50IG9mIHRoZSBZQU1MIGRpcmVjdGl2ZScpO1xuICAgIH1cblxuICAgIG1ham9yID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICBtaW5vciA9IHBhcnNlSW50KG1hdGNoWzJdLCAxMCk7XG5cbiAgICBpZiAobWFqb3IgIT09IDEpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmFjY2VwdGFibGUgWUFNTCB2ZXJzaW9uIG9mIHRoZSBkb2N1bWVudCcpO1xuICAgIH1cblxuICAgIHN0YXRlLnZlcnNpb24gPSBhcmdzWzBdO1xuICAgIHN0YXRlLmNoZWNrTGluZUJyZWFrcyA9IChtaW5vciA8IDIpO1xuXG4gICAgaWYgKG1pbm9yICE9PSAxICYmIG1pbm9yICE9PSAyKSB7XG4gICAgICB0aHJvd1dhcm5pbmcoc3RhdGUsICd1bnN1cHBvcnRlZCBZQU1MIHZlcnNpb24gb2YgdGhlIGRvY3VtZW50Jyk7XG4gICAgfVxuICB9LFxuXG4gIFRBRzogZnVuY3Rpb24gaGFuZGxlVGFnRGlyZWN0aXZlKHN0YXRlLCBuYW1lLCBhcmdzKSB7XG5cbiAgICB2YXIgaGFuZGxlLCBwcmVmaXg7XG5cbiAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdUQUcgZGlyZWN0aXZlIGFjY2VwdHMgZXhhY3RseSB0d28gYXJndW1lbnRzJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlID0gYXJnc1swXTtcbiAgICBwcmVmaXggPSBhcmdzWzFdO1xuXG4gICAgaWYgKCFQQVRURVJOX1RBR19IQU5ETEUudGVzdChoYW5kbGUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnaWxsLWZvcm1lZCB0YWcgaGFuZGxlIChmaXJzdCBhcmd1bWVudCkgb2YgdGhlIFRBRyBkaXJlY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwoc3RhdGUudGFnTWFwLCBoYW5kbGUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGhlcmUgaXMgYSBwcmV2aW91c2x5IGRlY2xhcmVkIHN1ZmZpeCBmb3IgXCInICsgaGFuZGxlICsgJ1wiIHRhZyBoYW5kbGUnKTtcbiAgICB9XG5cbiAgICBpZiAoIVBBVFRFUk5fVEFHX1VSSS50ZXN0KHByZWZpeCkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdpbGwtZm9ybWVkIHRhZyBwcmVmaXggKHNlY29uZCBhcmd1bWVudCkgb2YgdGhlIFRBRyBkaXJlY3RpdmUnKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcHJlZml4ID0gZGVjb2RlVVJJQ29tcG9uZW50KHByZWZpeCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFnIHByZWZpeCBpcyBtYWxmb3JtZWQ6ICcgKyBwcmVmaXgpO1xuICAgIH1cblxuICAgIHN0YXRlLnRhZ01hcFtoYW5kbGVdID0gcHJlZml4O1xuICB9XG59O1xuXG5cbmZ1bmN0aW9uIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBzdGFydCwgZW5kLCBjaGVja0pzb24pIHtcbiAgdmFyIF9wb3NpdGlvbiwgX2xlbmd0aCwgX2NoYXJhY3RlciwgX3Jlc3VsdDtcblxuICBpZiAoc3RhcnQgPCBlbmQpIHtcbiAgICBfcmVzdWx0ID0gc3RhdGUuaW5wdXQuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBpZiAoY2hlY2tKc29uKSB7XG4gICAgICBmb3IgKF9wb3NpdGlvbiA9IDAsIF9sZW5ndGggPSBfcmVzdWx0Lmxlbmd0aDsgX3Bvc2l0aW9uIDwgX2xlbmd0aDsgX3Bvc2l0aW9uICs9IDEpIHtcbiAgICAgICAgX2NoYXJhY3RlciA9IF9yZXN1bHQuY2hhckNvZGVBdChfcG9zaXRpb24pO1xuICAgICAgICBpZiAoIShfY2hhcmFjdGVyID09PSAweDA5IHx8XG4gICAgICAgICAgICAgICgweDIwIDw9IF9jaGFyYWN0ZXIgJiYgX2NoYXJhY3RlciA8PSAweDEwRkZGRikpKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2V4cGVjdGVkIHZhbGlkIEpTT04gY2hhcmFjdGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFBBVFRFUk5fTk9OX1BSSU5UQUJMRS50ZXN0KF9yZXN1bHQpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGhlIHN0cmVhbSBjb250YWlucyBub24tcHJpbnRhYmxlIGNoYXJhY3RlcnMnKTtcbiAgICB9XG5cbiAgICBzdGF0ZS5yZXN1bHQgKz0gX3Jlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZU1hcHBpbmdzKHN0YXRlLCBkZXN0aW5hdGlvbiwgc291cmNlLCBvdmVycmlkYWJsZUtleXMpIHtcbiAgdmFyIHNvdXJjZUtleXMsIGtleSwgaW5kZXgsIHF1YW50aXR5O1xuXG4gIGlmICghY29tbW9uLmlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnY2Fubm90IG1lcmdlIG1hcHBpbmdzOyB0aGUgcHJvdmlkZWQgc291cmNlIG9iamVjdCBpcyB1bmFjY2VwdGFibGUnKTtcbiAgfVxuXG4gIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuXG4gIGZvciAoaW5kZXggPSAwLCBxdWFudGl0eSA9IHNvdXJjZUtleXMubGVuZ3RoOyBpbmRleCA8IHF1YW50aXR5OyBpbmRleCArPSAxKSB7XG4gICAga2V5ID0gc291cmNlS2V5c1tpbmRleF07XG5cbiAgICBpZiAoIV9oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc3RpbmF0aW9uLCBrZXkpKSB7XG4gICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICBvdmVycmlkYWJsZUtleXNba2V5XSA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsXG4gIHN0YXJ0TGluZSwgc3RhcnRMaW5lU3RhcnQsIHN0YXJ0UG9zKSB7XG5cbiAgdmFyIGluZGV4LCBxdWFudGl0eTtcblxuICAvLyBUaGUgb3V0cHV0IGlzIGEgcGxhaW4gb2JqZWN0IGhlcmUsIHNvIGtleXMgY2FuIG9ubHkgYmUgc3RyaW5ncy5cbiAgLy8gV2UgbmVlZCB0byBjb252ZXJ0IGtleU5vZGUgdG8gYSBzdHJpbmcsIGJ1dCBkb2luZyBzbyBjYW4gaGFuZyB0aGUgcHJvY2Vzc1xuICAvLyAoZGVlcGx5IG5lc3RlZCBhcnJheXMgdGhhdCBleHBsb2RlIGV4cG9uZW50aWFsbHkgdXNpbmcgYWxpYXNlcykuXG4gIGlmIChBcnJheS5pc0FycmF5KGtleU5vZGUpKSB7XG4gICAga2V5Tm9kZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGtleU5vZGUpO1xuXG4gICAgZm9yIChpbmRleCA9IDAsIHF1YW50aXR5ID0ga2V5Tm9kZS5sZW5ndGg7IGluZGV4IDwgcXVhbnRpdHk7IGluZGV4ICs9IDEpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleU5vZGVbaW5kZXhdKSkge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmVzdGVkIGFycmF5cyBhcmUgbm90IHN1cHBvcnRlZCBpbnNpZGUga2V5cycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGtleU5vZGUgPT09ICdvYmplY3QnICYmIF9jbGFzcyhrZXlOb2RlW2luZGV4XSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIGtleU5vZGVbaW5kZXhdID0gJ1tvYmplY3QgT2JqZWN0XSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQXZvaWQgY29kZSBleGVjdXRpb24gaW4gbG9hZCgpIHZpYSB0b1N0cmluZyBwcm9wZXJ0eVxuICAvLyAoc3RpbGwgdXNlIGl0cyBvd24gdG9TdHJpbmcgZm9yIGFycmF5cywgdGltZXN0YW1wcyxcbiAgLy8gYW5kIHdoYXRldmVyIHVzZXIgc2NoZW1hIGV4dGVuc2lvbnMgaGFwcGVuIHRvIGhhdmUgQEB0b1N0cmluZ1RhZylcbiAgaWYgKHR5cGVvZiBrZXlOb2RlID09PSAnb2JqZWN0JyAmJiBfY2xhc3Moa2V5Tm9kZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAga2V5Tm9kZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuICB9XG5cblxuICBrZXlOb2RlID0gU3RyaW5nKGtleU5vZGUpO1xuXG4gIGlmIChfcmVzdWx0ID09PSBudWxsKSB7XG4gICAgX3Jlc3VsdCA9IHt9O1xuICB9XG5cbiAgaWYgKGtleVRhZyA9PT0gJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlTm9kZSkpIHtcbiAgICAgIGZvciAoaW5kZXggPSAwLCBxdWFudGl0eSA9IHZhbHVlTm9kZS5sZW5ndGg7IGluZGV4IDwgcXVhbnRpdHk7IGluZGV4ICs9IDEpIHtcbiAgICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgX3Jlc3VsdCwgdmFsdWVOb2RlW2luZGV4XSwgb3ZlcnJpZGFibGVLZXlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgX3Jlc3VsdCwgdmFsdWVOb2RlLCBvdmVycmlkYWJsZUtleXMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIXN0YXRlLmpzb24gJiZcbiAgICAgICAgIV9oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRhYmxlS2V5cywga2V5Tm9kZSkgJiZcbiAgICAgICAgX2hhc093blByb3BlcnR5LmNhbGwoX3Jlc3VsdCwga2V5Tm9kZSkpIHtcbiAgICAgIHN0YXRlLmxpbmUgPSBzdGFydExpbmUgfHwgc3RhdGUubGluZTtcbiAgICAgIHN0YXRlLmxpbmVTdGFydCA9IHN0YXJ0TGluZVN0YXJ0IHx8IHN0YXRlLmxpbmVTdGFydDtcbiAgICAgIHN0YXRlLnBvc2l0aW9uID0gc3RhcnRQb3MgfHwgc3RhdGUucG9zaXRpb247XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZHVwbGljYXRlZCBtYXBwaW5nIGtleScpO1xuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIHRoaXMgc3BlY2lmaWMga2V5IG9ubHkgYmVjYXVzZSBPYmplY3QuZGVmaW5lUHJvcGVydHkgaXMgc2xvd1xuICAgIGlmIChrZXlOb2RlID09PSAnX19wcm90b19fJykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9yZXN1bHQsIGtleU5vZGUsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IHZhbHVlTm9kZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9yZXN1bHRba2V5Tm9kZV0gPSB2YWx1ZU5vZGU7XG4gICAgfVxuICAgIGRlbGV0ZSBvdmVycmlkYWJsZUtleXNba2V5Tm9kZV07XG4gIH1cblxuICByZXR1cm4gX3Jlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmVhZExpbmVCcmVhayhzdGF0ZSkge1xuICB2YXIgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggPT09IDB4MEEvKiBMRiAqLykge1xuICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gIH0gZWxzZSBpZiAoY2ggPT09IDB4MEQvKiBDUiAqLykge1xuICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgaWYgKHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pID09PSAweDBBLyogTEYgKi8pIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdhIGxpbmUgYnJlYWsgaXMgZXhwZWN0ZWQnKTtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgKz0gMTtcbiAgc3RhdGUubGluZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG4gIHN0YXRlLmZpcnN0VGFiSW5MaW5lID0gLTE7XG59XG5cbmZ1bmN0aW9uIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGFsbG93Q29tbWVudHMsIGNoZWNrSW5kZW50KSB7XG4gIHZhciBsaW5lQnJlYWtzID0gMCxcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgICAgaWYgKGNoID09PSAweDA5LyogVGFiICovICYmIHN0YXRlLmZpcnN0VGFiSW5MaW5lID09PSAtMSkge1xuICAgICAgICBzdGF0ZS5maXJzdFRhYkluTGluZSA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgfVxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChhbGxvd0NvbW1lbnRzICYmIGNoID09PSAweDIzLyogIyAqLykge1xuICAgICAgZG8ge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9IHdoaWxlIChjaCAhPT0gMHgwQS8qIExGICovICYmIGNoICE9PSAweDBELyogQ1IgKi8gJiYgY2ggIT09IDApO1xuICAgIH1cblxuICAgIGlmIChpc19FT0woY2gpKSB7XG4gICAgICByZWFkTGluZUJyZWFrKHN0YXRlKTtcblxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgIGxpbmVCcmVha3MrKztcbiAgICAgIHN0YXRlLmxpbmVJbmRlbnQgPSAwO1xuXG4gICAgICB3aGlsZSAoY2ggPT09IDB4MjAvKiBTcGFjZSAqLykge1xuICAgICAgICBzdGF0ZS5saW5lSW5kZW50Kys7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNoZWNrSW5kZW50ICE9PSAtMSAmJiBsaW5lQnJlYWtzICE9PSAwICYmIHN0YXRlLmxpbmVJbmRlbnQgPCBjaGVja0luZGVudCkge1xuICAgIHRocm93V2FybmluZyhzdGF0ZSwgJ2RlZmljaWVudCBpbmRlbnRhdGlvbicpO1xuICB9XG5cbiAgcmV0dXJuIGxpbmVCcmVha3M7XG59XG5cbmZ1bmN0aW9uIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSkge1xuICB2YXIgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb24sXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uKTtcblxuICAvLyBDb25kaXRpb24gc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCBpcyB0ZXN0ZWRcbiAgLy8gaW4gcGFyZW50IG9uIGVhY2ggY2FsbCwgZm9yIGVmZmljaWVuY3kuIE5vIG5lZWRzIHRvIHRlc3QgaGVyZSBhZ2Fpbi5cbiAgaWYgKChjaCA9PT0gMHgyRC8qIC0gKi8gfHwgY2ggPT09IDB4MkUvKiAuICovKSAmJlxuICAgICAgY2ggPT09IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoX3Bvc2l0aW9uICsgMSkgJiZcbiAgICAgIGNoID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbiArIDIpKSB7XG5cbiAgICBfcG9zaXRpb24gKz0gMztcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChfcG9zaXRpb24pO1xuXG4gICAgaWYgKGNoID09PSAwIHx8IGlzX1dTX09SX0VPTChjaCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgY291bnQpIHtcbiAgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgc3RhdGUucmVzdWx0ICs9ICcgJztcbiAgfSBlbHNlIGlmIChjb3VudCA+IDEpIHtcbiAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgY291bnQgLSAxKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHJlYWRQbGFpblNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCwgd2l0aGluRmxvd0NvbGxlY3Rpb24pIHtcbiAgdmFyIHByZWNlZGluZyxcbiAgICAgIGZvbGxvd2luZyxcbiAgICAgIGNhcHR1cmVTdGFydCxcbiAgICAgIGNhcHR1cmVFbmQsXG4gICAgICBoYXNQZW5kaW5nQ29udGVudCxcbiAgICAgIF9saW5lLFxuICAgICAgX2xpbmVTdGFydCxcbiAgICAgIF9saW5lSW5kZW50LFxuICAgICAgX2tpbmQgPSBzdGF0ZS5raW5kLFxuICAgICAgX3Jlc3VsdCA9IHN0YXRlLnJlc3VsdCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGlzX1dTX09SX0VPTChjaCkgICAgICB8fFxuICAgICAgaXNfRkxPV19JTkRJQ0FUT1IoY2gpIHx8XG4gICAgICBjaCA9PT0gMHgyMy8qICMgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDI2LyogJiAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4MkEvKiAqICovICAgIHx8XG4gICAgICBjaCA9PT0gMHgyMS8qICEgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDdDLyogfCAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4M0UvKiA+ICovICAgIHx8XG4gICAgICBjaCA9PT0gMHgyNy8qICcgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDIyLyogXCIgKi8gICAgfHxcbiAgICAgIGNoID09PSAweDI1LyogJSAqLyAgICB8fFxuICAgICAgY2ggPT09IDB4NDAvKiBAICovICAgIHx8XG4gICAgICBjaCA9PT0gMHg2MC8qIGAgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoY2ggPT09IDB4M0YvKiA/ICovIHx8IGNoID09PSAweDJELyogLSAqLykge1xuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgIGlmIChpc19XU19PUl9FT0woZm9sbG93aW5nKSB8fFxuICAgICAgICB3aXRoaW5GbG93Q29sbGVjdGlvbiAmJiBpc19GTE9XX0lORElDQVRPUihmb2xsb3dpbmcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGlmIChjaCA9PT0gMHgzQS8qIDogKi8pIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzX1dTX09SX0VPTChmb2xsb3dpbmcpIHx8XG4gICAgICAgICAgd2l0aGluRmxvd0NvbGxlY3Rpb24gJiYgaXNfRkxPV19JTkRJQ0FUT1IoZm9sbG93aW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoY2ggPT09IDB4MjMvKiAjICovKSB7XG4gICAgICBwcmVjZWRpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uIC0gMSk7XG5cbiAgICAgIGlmIChpc19XU19PUl9FT0wocHJlY2VkaW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkgfHxcbiAgICAgICAgICAgICAgIHdpdGhpbkZsb3dDb2xsZWN0aW9uICYmIGlzX0ZMT1dfSU5ESUNBVE9SKGNoKSkge1xuICAgICAgYnJlYWs7XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICAgIF9saW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBfbGluZUluZGVudCA9IHN0YXRlLmxpbmVJbmRlbnQ7XG4gICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgLTEpO1xuXG4gICAgICBpZiAoc3RhdGUubGluZUluZGVudCA+PSBub2RlSW5kZW50KSB7XG4gICAgICAgIGhhc1BlbmRpbmdDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbiA9IGNhcHR1cmVFbmQ7XG4gICAgICAgIHN0YXRlLmxpbmUgPSBfbGluZTtcbiAgICAgICAgc3RhdGUubGluZVN0YXJ0ID0gX2xpbmVTdGFydDtcbiAgICAgICAgc3RhdGUubGluZUluZGVudCA9IF9saW5lSW5kZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUGVuZGluZ0NvbnRlbnQpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHN0YXRlLmxpbmUgLSBfbGluZSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb24gKyAxO1xuICAgIH1cblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcblxuICBpZiAoc3RhdGUucmVzdWx0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gX2tpbmQ7XG4gIHN0YXRlLnJlc3VsdCA9IF9yZXN1bHQ7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVhZFNpbmdsZVF1b3RlZFNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2gsXG4gICAgICBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQ7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggIT09IDB4MjcvKiAnICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgc3RhdGUucG9zaXRpb24rKztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlICgoY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSkgIT09IDApIHtcbiAgICBpZiAoY2ggPT09IDB4MjcvKiAnICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgIGlmIChjaCA9PT0gMHgyNy8qICcgKi8pIHtcbiAgICAgICAgY2FwdHVyZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIGlmIChpc19FT0woY2gpKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBjYXB0dXJlRW5kLCB0cnVlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIGZhbHNlLCBub2RlSW5kZW50KSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB9IGVsc2UgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBkb2N1bWVudCB3aXRoaW4gYSBzaW5nbGUgcXVvdGVkIHNjYWxhcicpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgc2luZ2xlIHF1b3RlZCBzY2FsYXInKTtcbn1cblxuZnVuY3Rpb24gcmVhZERvdWJsZVF1b3RlZFNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2FwdHVyZVN0YXJ0LFxuICAgICAgY2FwdHVyZUVuZCxcbiAgICAgIGhleExlbmd0aCxcbiAgICAgIGhleFJlc3VsdCxcbiAgICAgIHRtcCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoICE9PSAweDIyLyogXCIgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gJ3NjYWxhcic7XG4gIHN0YXRlLnJlc3VsdCA9ICcnO1xuICBzdGF0ZS5wb3NpdGlvbisrO1xuICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIGlmIChjaCA9PT0gMHgyMi8qIFwiICovKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDVDLyogXFwgKi8pIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIHN0YXRlLnBvc2l0aW9uLCB0cnVlKTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgZmFsc2UsIG5vZGVJbmRlbnQpO1xuXG4gICAgICAgIC8vIFRPRE86IHJld29yayB0byBpbmxpbmUgZm4gd2l0aCBubyB0eXBlIGNhc3Q/XG4gICAgICB9IGVsc2UgaWYgKGNoIDwgMjU2ICYmIHNpbXBsZUVzY2FwZUNoZWNrW2NoXSkge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gc2ltcGxlRXNjYXBlTWFwW2NoXTtcbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcblxuICAgICAgfSBlbHNlIGlmICgodG1wID0gZXNjYXBlZEhleExlbihjaCkpID4gMCkge1xuICAgICAgICBoZXhMZW5ndGggPSB0bXA7XG4gICAgICAgIGhleFJlc3VsdCA9IDA7XG5cbiAgICAgICAgZm9yICg7IGhleExlbmd0aCA+IDA7IGhleExlbmd0aC0tKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gICAgICAgICAgaWYgKCh0bXAgPSBmcm9tSGV4Q29kZShjaCkpID49IDApIHtcbiAgICAgICAgICAgIGhleFJlc3VsdCA9IChoZXhSZXN1bHQgPDwgNCkgKyB0bXA7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2V4cGVjdGVkIGhleGFkZWNpbWFsIGNoYXJhY3RlcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjaGFyRnJvbUNvZGVwb2ludChoZXhSZXN1bHQpO1xuXG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmtub3duIGVzY2FwZSBzZXF1ZW5jZScpO1xuICAgICAgfVxuXG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIHRydWUpO1xuICAgICAgd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgZmFsc2UsIG5vZGVJbmRlbnQpKTtcbiAgICAgIGNhcHR1cmVTdGFydCA9IGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcblxuICAgIH0gZWxzZSBpZiAoc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCAmJiB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIGRvY3VtZW50IHdpdGhpbiBhIGRvdWJsZSBxdW90ZWQgc2NhbGFyJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBkb3VibGUgcXVvdGVkIHNjYWxhcicpO1xufVxuXG5mdW5jdGlvbiByZWFkRmxvd0NvbGxlY3Rpb24oc3RhdGUsIG5vZGVJbmRlbnQpIHtcbiAgdmFyIHJlYWROZXh0ID0gdHJ1ZSxcbiAgICAgIF9saW5lLFxuICAgICAgX2xpbmVTdGFydCxcbiAgICAgIF9wb3MsXG4gICAgICBfdGFnICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIF9yZXN1bHQsXG4gICAgICBfYW5jaG9yICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIGZvbGxvd2luZyxcbiAgICAgIHRlcm1pbmF0b3IsXG4gICAgICBpc1BhaXIsXG4gICAgICBpc0V4cGxpY2l0UGFpcixcbiAgICAgIGlzTWFwcGluZyxcbiAgICAgIG92ZXJyaWRhYmxlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICBrZXlOb2RlLFxuICAgICAga2V5VGFnLFxuICAgICAgdmFsdWVOb2RlLFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggPT09IDB4NUIvKiBbICovKSB7XG4gICAgdGVybWluYXRvciA9IDB4NUQ7LyogXSAqL1xuICAgIGlzTWFwcGluZyA9IGZhbHNlO1xuICAgIF9yZXN1bHQgPSBbXTtcbiAgfSBlbHNlIGlmIChjaCA9PT0gMHg3Qi8qIHsgKi8pIHtcbiAgICB0ZXJtaW5hdG9yID0gMHg3RDsvKiB9ICovXG4gICAgaXNNYXBwaW5nID0gdHJ1ZTtcbiAgICBfcmVzdWx0ID0ge307XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gX3Jlc3VsdDtcbiAgfVxuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICB3aGlsZSAoY2ggIT09IDApIHtcbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCBub2RlSW5kZW50KTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoY2ggPT09IHRlcm1pbmF0b3IpIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgc3RhdGUuYW5jaG9yID0gX2FuY2hvcjtcbiAgICAgIHN0YXRlLmtpbmQgPSBpc01hcHBpbmcgPyAnbWFwcGluZycgOiAnc2VxdWVuY2UnO1xuICAgICAgc3RhdGUucmVzdWx0ID0gX3Jlc3VsdDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIXJlYWROZXh0KSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbWlzc2VkIGNvbW1hIGJldHdlZW4gZmxvdyBjb2xsZWN0aW9uIGVudHJpZXMnKTtcbiAgICB9IGVsc2UgaWYgKGNoID09PSAweDJDLyogLCAqLykge1xuICAgICAgLy8gXCJmbG93IGNvbGxlY3Rpb24gZW50cmllcyBjYW4gbmV2ZXIgYmUgY29tcGxldGVseSBlbXB0eVwiLCBhcyBwZXIgWUFNTCAxLjIsIHNlY3Rpb24gNy40XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCBcImV4cGVjdGVkIHRoZSBub2RlIGNvbnRlbnQsIGJ1dCBmb3VuZCAnLCdcIik7XG4gICAgfVxuXG4gICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgaXNQYWlyID0gaXNFeHBsaWNpdFBhaXIgPSBmYWxzZTtcblxuICAgIGlmIChjaCA9PT0gMHgzRi8qID8gKi8pIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzX1dTX09SX0VPTChmb2xsb3dpbmcpKSB7XG4gICAgICAgIGlzUGFpciA9IGlzRXhwbGljaXRQYWlyID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xpbmUgPSBzdGF0ZS5saW5lOyAvLyBTYXZlIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgX2xpbmVTdGFydCA9IHN0YXRlLmxpbmVTdGFydDtcbiAgICBfcG9zID0gc3RhdGUucG9zaXRpb247XG4gICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfRkxPV19JTiwgZmFsc2UsIHRydWUpO1xuICAgIGtleVRhZyA9IHN0YXRlLnRhZztcbiAgICBrZXlOb2RlID0gc3RhdGUucmVzdWx0O1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmICgoaXNFeHBsaWNpdFBhaXIgfHwgc3RhdGUubGluZSA9PT0gX2xpbmUpICYmIGNoID09PSAweDNBLyogOiAqLykge1xuICAgICAgaXNQYWlyID0gdHJ1ZTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuICAgICAgY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfRkxPV19JTiwgZmFsc2UsIHRydWUpO1xuICAgICAgdmFsdWVOb2RlID0gc3RhdGUucmVzdWx0O1xuICAgIH1cblxuICAgIGlmIChpc01hcHBpbmcpIHtcbiAgICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9saW5lLCBfbGluZVN0YXJ0LCBfcG9zKTtcbiAgICB9IGVsc2UgaWYgKGlzUGFpcikge1xuICAgICAgX3Jlc3VsdC5wdXNoKHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIG51bGwsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9saW5lLCBfbGluZVN0YXJ0LCBfcG9zKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9yZXN1bHQucHVzaChrZXlOb2RlKTtcbiAgICB9XG5cbiAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCBub2RlSW5kZW50KTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoY2ggPT09IDB4MkMvKiAsICovKSB7XG4gICAgICByZWFkTmV4dCA9IHRydWU7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWROZXh0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZXhwZWN0ZWQgZW5kIG9mIHRoZSBzdHJlYW0gd2l0aGluIGEgZmxvdyBjb2xsZWN0aW9uJyk7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja1NjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2FwdHVyZVN0YXJ0LFxuICAgICAgZm9sZGluZyxcbiAgICAgIGNob21waW5nICAgICAgID0gQ0hPTVBJTkdfQ0xJUCxcbiAgICAgIGRpZFJlYWRDb250ZW50ID0gZmFsc2UsXG4gICAgICBkZXRlY3RlZEluZGVudCA9IGZhbHNlLFxuICAgICAgdGV4dEluZGVudCAgICAgPSBub2RlSW5kZW50LFxuICAgICAgZW1wdHlMaW5lcyAgICAgPSAwLFxuICAgICAgYXRNb3JlSW5kZW50ZWQgPSBmYWxzZSxcbiAgICAgIHRtcCxcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoID09PSAweDdDLyogfCAqLykge1xuICAgIGZvbGRpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChjaCA9PT0gMHgzRS8qID4gKi8pIHtcbiAgICBmb2xkaW5nID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gJ3NjYWxhcic7XG4gIHN0YXRlLnJlc3VsdCA9ICcnO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gMHgyQi8qICsgKi8gfHwgY2ggPT09IDB4MkQvKiAtICovKSB7XG4gICAgICBpZiAoQ0hPTVBJTkdfQ0xJUCA9PT0gY2hvbXBpbmcpIHtcbiAgICAgICAgY2hvbXBpbmcgPSAoY2ggPT09IDB4MkIvKiArICovKSA/IENIT01QSU5HX0tFRVAgOiBDSE9NUElOR19TVFJJUDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdyZXBlYXQgb2YgYSBjaG9tcGluZyBtb2RlIGlkZW50aWZpZXInKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoKHRtcCA9IGZyb21EZWNpbWFsQ29kZShjaCkpID49IDApIHtcbiAgICAgIGlmICh0bXAgPT09IDApIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2JhZCBleHBsaWNpdCBpbmRlbnRhdGlvbiB3aWR0aCBvZiBhIGJsb2NrIHNjYWxhcjsgaXQgY2Fubm90IGJlIGxlc3MgdGhhbiBvbmUnKTtcbiAgICAgIH0gZWxzZSBpZiAoIWRldGVjdGVkSW5kZW50KSB7XG4gICAgICAgIHRleHRJbmRlbnQgPSBub2RlSW5kZW50ICsgdG1wIC0gMTtcbiAgICAgICAgZGV0ZWN0ZWRJbmRlbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3JlcGVhdCBvZiBhbiBpbmRlbnRhdGlvbiB3aWR0aCBpZGVudGlmaWVyJyk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgIGRvIHsgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pOyB9XG4gICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSk7XG5cbiAgICBpZiAoY2ggPT09IDB4MjMvKiAjICovKSB7XG4gICAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgICAgd2hpbGUgKCFpc19FT0woY2gpICYmIChjaCAhPT0gMCkpO1xuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIHJlYWRMaW5lQnJlYWsoc3RhdGUpO1xuICAgIHN0YXRlLmxpbmVJbmRlbnQgPSAwO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIHdoaWxlICgoIWRldGVjdGVkSW5kZW50IHx8IHN0YXRlLmxpbmVJbmRlbnQgPCB0ZXh0SW5kZW50KSAmJlxuICAgICAgICAgICAoY2ggPT09IDB4MjAvKiBTcGFjZSAqLykpIHtcbiAgICAgIHN0YXRlLmxpbmVJbmRlbnQrKztcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAoIWRldGVjdGVkSW5kZW50ICYmIHN0YXRlLmxpbmVJbmRlbnQgPiB0ZXh0SW5kZW50KSB7XG4gICAgICB0ZXh0SW5kZW50ID0gc3RhdGUubGluZUluZGVudDtcbiAgICB9XG5cbiAgICBpZiAoaXNfRU9MKGNoKSkge1xuICAgICAgZW1wdHlMaW5lcysrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gRW5kIG9mIHRoZSBzY2FsYXIuXG4gICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCB0ZXh0SW5kZW50KSB7XG5cbiAgICAgIC8vIFBlcmZvcm0gdGhlIGNob21waW5nLlxuICAgICAgaWYgKGNob21waW5nID09PSBDSE9NUElOR19LRUVQKSB7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBkaWRSZWFkQ29udGVudCA/IDEgKyBlbXB0eUxpbmVzIDogZW1wdHlMaW5lcyk7XG4gICAgICB9IGVsc2UgaWYgKGNob21waW5nID09PSBDSE9NUElOR19DTElQKSB7XG4gICAgICAgIGlmIChkaWRSZWFkQ29udGVudCkgeyAvLyBpLmUuIG9ubHkgaWYgdGhlIHNjYWxhciBpcyBub3QgZW1wdHkuXG4gICAgICAgICAgc3RhdGUucmVzdWx0ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJyZWFrIHRoaXMgYHdoaWxlYCBjeWNsZSBhbmQgZ28gdG8gdGhlIGZ1bmNpdG9uJ3MgZXBpbG9ndWUuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBGb2xkZWQgc3R5bGU6IHVzZSBmYW5jeSBydWxlcyB0byBoYW5kbGUgbGluZSBicmVha3MuXG4gICAgaWYgKGZvbGRpbmcpIHtcblxuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzIChtb3JlLWluZGVudGVkIGxpbmVzKSBhcmUgbm90IGZvbGRlZC5cbiAgICAgIGlmIChpc19XSElURV9TUEFDRShjaCkpIHtcbiAgICAgICAgYXRNb3JlSW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICAvLyBleGNlcHQgZm9yIHRoZSBmaXJzdCBjb250ZW50IGxpbmUgKGNmLiBFeGFtcGxlIDguMSlcbiAgICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGRpZFJlYWRDb250ZW50ID8gMSArIGVtcHR5TGluZXMgOiBlbXB0eUxpbmVzKTtcblxuICAgICAgLy8gRW5kIG9mIG1vcmUtaW5kZW50ZWQgYmxvY2suXG4gICAgICB9IGVsc2UgaWYgKGF0TW9yZUluZGVudGVkKSB7XG4gICAgICAgIGF0TW9yZUluZGVudGVkID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBlbXB0eUxpbmVzICsgMSk7XG5cbiAgICAgIC8vIEp1c3Qgb25lIGxpbmUgYnJlYWsgLSBwZXJjZWl2ZSBhcyB0aGUgc2FtZSBsaW5lLlxuICAgICAgfSBlbHNlIGlmIChlbXB0eUxpbmVzID09PSAwKSB7XG4gICAgICAgIGlmIChkaWRSZWFkQ29udGVudCkgeyAvLyBpLmUuIG9ubHkgaWYgd2UgaGF2ZSBhbHJlYWR5IHJlYWQgc29tZSBzY2FsYXIgY29udGVudC5cbiAgICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFNldmVyYWwgbGluZSBicmVha3MgLSBwZXJjZWl2ZSBhcyBkaWZmZXJlbnQgbGluZXMuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgZW1wdHlMaW5lcyk7XG4gICAgICB9XG5cbiAgICAvLyBMaXRlcmFsIHN0eWxlOiBqdXN0IGFkZCBleGFjdCBudW1iZXIgb2YgbGluZSBicmVha3MgYmV0d2VlbiBjb250ZW50IGxpbmVzLlxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIGFsbCBsaW5lIGJyZWFrcyBleGNlcHQgdGhlIGhlYWRlciBsaW5lIGJyZWFrLlxuICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGRpZFJlYWRDb250ZW50ID8gMSArIGVtcHR5TGluZXMgOiBlbXB0eUxpbmVzKTtcbiAgICB9XG5cbiAgICBkaWRSZWFkQ29udGVudCA9IHRydWU7XG4gICAgZGV0ZWN0ZWRJbmRlbnQgPSB0cnVlO1xuICAgIGVtcHR5TGluZXMgPSAwO1xuICAgIGNhcHR1cmVTdGFydCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gICAgd2hpbGUgKCFpc19FT0woY2gpICYmIChjaCAhPT0gMCkpIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgZmFsc2UpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBub2RlSW5kZW50KSB7XG4gIHZhciBfbGluZSxcbiAgICAgIF90YWcgICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIF9hbmNob3IgICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIF9yZXN1bHQgICA9IFtdLFxuICAgICAgZm9sbG93aW5nLFxuICAgICAgZGV0ZWN0ZWQgID0gZmFsc2UsXG4gICAgICBjaDtcblxuICAvLyB0aGVyZSBpcyBhIGxlYWRpbmcgdGFiIGJlZm9yZSB0aGlzIHRva2VuLCBzbyBpdCBjYW4ndCBiZSBhIGJsb2NrIHNlcXVlbmNlL21hcHBpbmc7XG4gIC8vIGl0IGNhbiBzdGlsbCBiZSBmbG93IHNlcXVlbmNlL21hcHBpbmcgb3IgYSBzY2FsYXJcbiAgaWYgKHN0YXRlLmZpcnN0VGFiSW5MaW5lICE9PSAtMSkgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IF9yZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlIChjaCAhPT0gMCkge1xuICAgIGlmIChzdGF0ZS5maXJzdFRhYkluTGluZSAhPT0gLTEpIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uID0gc3RhdGUuZmlyc3RUYWJJbkxpbmU7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFiIGNoYXJhY3RlcnMgbXVzdCBub3QgYmUgdXNlZCBpbiBpbmRlbnRhdGlvbicpO1xuICAgIH1cblxuICAgIGlmIChjaCAhPT0gMHgyRC8qIC0gKi8pIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgIGlmICghaXNfV1NfT1JfRU9MKGZvbGxvd2luZykpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGRldGVjdGVkID0gdHJ1ZTtcbiAgICBzdGF0ZS5wb3NpdGlvbisrO1xuXG4gICAgaWYgKHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKSkge1xuICAgICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPD0gbm9kZUluZGVudCkge1xuICAgICAgICBfcmVzdWx0LnB1c2gobnVsbCk7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICBjb21wb3NlTm9kZShzdGF0ZSwgbm9kZUluZGVudCwgQ09OVEVYVF9CTE9DS19JTiwgZmFsc2UsIHRydWUpO1xuICAgIF9yZXN1bHQucHVzaChzdGF0ZS5yZXN1bHQpO1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoKHN0YXRlLmxpbmUgPT09IF9saW5lIHx8IHN0YXRlLmxpbmVJbmRlbnQgPiBub2RlSW5kZW50KSAmJiAoY2ggIT09IDApKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnYmFkIGluZGVudGF0aW9uIG9mIGEgc2VxdWVuY2UgZW50cnknKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBub2RlSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoZGV0ZWN0ZWQpIHtcbiAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgc3RhdGUua2luZCA9ICdzZXF1ZW5jZSc7XG4gICAgc3RhdGUucmVzdWx0ID0gX3Jlc3VsdDtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9ja01hcHBpbmcoc3RhdGUsIG5vZGVJbmRlbnQsIGZsb3dJbmRlbnQpIHtcbiAgdmFyIGZvbGxvd2luZyxcbiAgICAgIGFsbG93Q29tcGFjdCxcbiAgICAgIF9saW5lLFxuICAgICAgX2tleUxpbmUsXG4gICAgICBfa2V5TGluZVN0YXJ0LFxuICAgICAgX2tleVBvcyxcbiAgICAgIF90YWcgICAgICAgICAgPSBzdGF0ZS50YWcsXG4gICAgICBfYW5jaG9yICAgICAgID0gc3RhdGUuYW5jaG9yLFxuICAgICAgX3Jlc3VsdCAgICAgICA9IHt9LFxuICAgICAgb3ZlcnJpZGFibGVLZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICAgIGtleVRhZyAgICAgICAgPSBudWxsLFxuICAgICAga2V5Tm9kZSAgICAgICA9IG51bGwsXG4gICAgICB2YWx1ZU5vZGUgICAgID0gbnVsbCxcbiAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZSxcbiAgICAgIGRldGVjdGVkICAgICAgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIC8vIHRoZXJlIGlzIGEgbGVhZGluZyB0YWIgYmVmb3JlIHRoaXMgdG9rZW4sIHNvIGl0IGNhbid0IGJlIGEgYmxvY2sgc2VxdWVuY2UvbWFwcGluZztcbiAgLy8gaXQgY2FuIHN0aWxsIGJlIGZsb3cgc2VxdWVuY2UvbWFwcGluZyBvciBhIHNjYWxhclxuICBpZiAoc3RhdGUuZmlyc3RUYWJJbkxpbmUgIT09IC0xKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gX3Jlc3VsdDtcbiAgfVxuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgd2hpbGUgKGNoICE9PSAwKSB7XG4gICAgaWYgKCFhdEV4cGxpY2l0S2V5ICYmIHN0YXRlLmZpcnN0VGFiSW5MaW5lICE9PSAtMSkge1xuICAgICAgc3RhdGUucG9zaXRpb24gPSBzdGF0ZS5maXJzdFRhYkluTGluZTtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWIgY2hhcmFjdGVycyBtdXN0IG5vdCBiZSB1c2VkIGluIGluZGVudGF0aW9uJyk7XG4gICAgfVxuXG4gICAgZm9sbG93aW5nID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpO1xuICAgIF9saW5lID0gc3RhdGUubGluZTsgLy8gU2F2ZSB0aGUgY3VycmVudCBsaW5lLlxuXG4gICAgLy9cbiAgICAvLyBFeHBsaWNpdCBub3RhdGlvbiBjYXNlLiBUaGVyZSBhcmUgdHdvIHNlcGFyYXRlIGJsb2NrczpcbiAgICAvLyBmaXJzdCBmb3IgdGhlIGtleSAoZGVub3RlZCBieSBcIj9cIikgYW5kIHNlY29uZCBmb3IgdGhlIHZhbHVlIChkZW5vdGVkIGJ5IFwiOlwiKVxuICAgIC8vXG4gICAgaWYgKChjaCA9PT0gMHgzRi8qID8gKi8gfHwgY2ggPT09IDB4M0EvKiA6ICovKSAmJiBpc19XU19PUl9FT0woZm9sbG93aW5nKSkge1xuXG4gICAgICBpZiAoY2ggPT09IDB4M0YvKiA/ICovKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgc3RvcmVNYXBwaW5nUGFpcihzdGF0ZSwgX3Jlc3VsdCwgb3ZlcnJpZGFibGVLZXlzLCBrZXlUYWcsIGtleU5vZGUsIG51bGwsIF9rZXlMaW5lLCBfa2V5TGluZVN0YXJ0LCBfa2V5UG9zKTtcbiAgICAgICAgICBrZXlUYWcgPSBrZXlOb2RlID0gdmFsdWVOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRldGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgYXRFeHBsaWNpdEtleSA9IHRydWU7XG4gICAgICAgIGFsbG93Q29tcGFjdCA9IHRydWU7XG5cbiAgICAgIH0gZWxzZSBpZiAoYXRFeHBsaWNpdEtleSkge1xuICAgICAgICAvLyBpLmUuIDB4M0EvKiA6ICovID09PSBjaGFyYWN0ZXIgYWZ0ZXIgdGhlIGV4cGxpY2l0IGtleS5cbiAgICAgICAgYXRFeHBsaWNpdEtleSA9IGZhbHNlO1xuICAgICAgICBhbGxvd0NvbXBhY3QgPSB0cnVlO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnaW5jb21wbGV0ZSBleHBsaWNpdCBtYXBwaW5nIHBhaXI7IGEga2V5IG5vZGUgaXMgbWlzc2VkOyBvciBmb2xsb3dlZCBieSBhIG5vbi10YWJ1bGF0ZWQgZW1wdHkgbGluZScpO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZS5wb3NpdGlvbiArPSAxO1xuICAgICAgY2ggPSBmb2xsb3dpbmc7XG5cbiAgICAvL1xuICAgIC8vIEltcGxpY2l0IG5vdGF0aW9uIGNhc2UuIEZsb3ctc3R5bGUgbm9kZSBhcyB0aGUga2V5IGZpcnN0LCB0aGVuIFwiOlwiLCBhbmQgdGhlIHZhbHVlLlxuICAgIC8vXG4gICAgfSBlbHNlIHtcbiAgICAgIF9rZXlMaW5lID0gc3RhdGUubGluZTtcbiAgICAgIF9rZXlMaW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBfa2V5UG9zID0gc3RhdGUucG9zaXRpb247XG5cbiAgICAgIGlmICghY29tcG9zZU5vZGUoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19PVVQsIGZhbHNlLCB0cnVlKSkge1xuICAgICAgICAvLyBOZWl0aGVyIGltcGxpY2l0IG5vciBleHBsaWNpdCBub3RhdGlvbi5cbiAgICAgICAgLy8gUmVhZGluZyBpcyBkb25lLiBHbyB0byB0aGUgZXBpbG9ndWUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUubGluZSA9PT0gX2xpbmUpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICB3aGlsZSAoaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoID09PSAweDNBLyogOiAqLykge1xuICAgICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICAgIGlmICghaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Egd2hpdGVzcGFjZSBjaGFyYWN0ZXIgaXMgZXhwZWN0ZWQgYWZ0ZXIgdGhlIGtleS12YWx1ZSBzZXBhcmF0b3Igd2l0aGluIGEgYmxvY2sgbWFwcGluZycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBvdmVycmlkYWJsZUtleXMsIGtleVRhZywga2V5Tm9kZSwgbnVsbCwgX2tleUxpbmUsIF9rZXlMaW5lU3RhcnQsIF9rZXlQb3MpO1xuICAgICAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZTtcbiAgICAgICAgICBhbGxvd0NvbXBhY3QgPSBmYWxzZTtcbiAgICAgICAgICBrZXlUYWcgPSBzdGF0ZS50YWc7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcblxuICAgICAgICB9IGVsc2UgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhbiBpbXBsaWNpdCBtYXBwaW5nIHBhaXI7IGEgY29sb24gaXMgbWlzc2VkJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgICAgICAgcmV0dXJuIHRydWU7IC8vIEtlZXAgdGhlIHJlc3VsdCBvZiBgY29tcG9zZU5vZGVgLlxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoZGV0ZWN0ZWQpIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhIGJsb2NrIG1hcHBpbmcgZW50cnk7IGEgbXVsdGlsaW5lIGtleSBtYXkgbm90IGJlIGFuIGltcGxpY2l0IGtleScpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICBzdGF0ZS5hbmNob3IgPSBfYW5jaG9yO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCB0aGUgcmVzdWx0IG9mIGBjb21wb3NlTm9kZWAuXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBDb21tb24gcmVhZGluZyBjb2RlIGZvciBib3RoIGV4cGxpY2l0IGFuZCBpbXBsaWNpdCBub3RhdGlvbnMuXG4gICAgLy9cbiAgICBpZiAoc3RhdGUubGluZSA9PT0gX2xpbmUgfHwgc3RhdGUubGluZUluZGVudCA+IG5vZGVJbmRlbnQpIHtcbiAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIF9rZXlMaW5lID0gc3RhdGUubGluZTtcbiAgICAgICAgX2tleUxpbmVTdGFydCA9IHN0YXRlLmxpbmVTdGFydDtcbiAgICAgICAgX2tleVBvcyA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfQkxPQ0tfT1VULCB0cnVlLCBhbGxvd0NvbXBhY3QpKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUsIF9rZXlMaW5lLCBfa2V5TGluZVN0YXJ0LCBfa2V5UG9zKTtcbiAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKChzdGF0ZS5saW5lID09PSBfbGluZSB8fCBzdGF0ZS5saW5lSW5kZW50ID4gbm9kZUluZGVudCkgJiYgKGNoICE9PSAwKSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2JhZCBpbmRlbnRhdGlvbiBvZiBhIG1hcHBpbmcgZW50cnknKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPCBub2RlSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBFcGlsb2d1ZS5cbiAgLy9cblxuICAvLyBTcGVjaWFsIGNhc2U6IGxhc3QgbWFwcGluZydzIG5vZGUgY29udGFpbnMgb25seSB0aGUga2V5IGluIGV4cGxpY2l0IG5vdGF0aW9uLlxuICBpZiAoYXRFeHBsaWNpdEtleSkge1xuICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIG92ZXJyaWRhYmxlS2V5cywga2V5VGFnLCBrZXlOb2RlLCBudWxsLCBfa2V5TGluZSwgX2tleUxpbmVTdGFydCwgX2tleVBvcyk7XG4gIH1cblxuICAvLyBFeHBvc2UgdGhlIHJlc3VsdGluZyBtYXBwaW5nLlxuICBpZiAoZGV0ZWN0ZWQpIHtcbiAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgc3RhdGUua2luZCA9ICdtYXBwaW5nJztcbiAgICBzdGF0ZS5yZXN1bHQgPSBfcmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIGRldGVjdGVkO1xufVxuXG5mdW5jdGlvbiByZWFkVGFnUHJvcGVydHkoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbixcbiAgICAgIGlzVmVyYmF0aW0gPSBmYWxzZSxcbiAgICAgIGlzTmFtZWQgICAgPSBmYWxzZSxcbiAgICAgIHRhZ0hhbmRsZSxcbiAgICAgIHRhZ05hbWUsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCAhPT0gMHgyMS8qICEgKi8pIHJldHVybiBmYWxzZTtcblxuICBpZiAoc3RhdGUudGFnICE9PSBudWxsKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2R1cGxpY2F0aW9uIG9mIGEgdGFnIHByb3BlcnR5Jyk7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKGNoID09PSAweDNDLyogPCAqLykge1xuICAgIGlzVmVyYmF0aW0gPSB0cnVlO1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICB9IGVsc2UgaWYgKGNoID09PSAweDIxLyogISAqLykge1xuICAgIGlzTmFtZWQgPSB0cnVlO1xuICAgIHRhZ0hhbmRsZSA9ICchISc7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gIH0gZWxzZSB7XG4gICAgdGFnSGFuZGxlID0gJyEnO1xuICB9XG5cbiAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgaWYgKGlzVmVyYmF0aW0pIHtcbiAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgIHdoaWxlIChjaCAhPT0gMCAmJiBjaCAhPT0gMHgzRS8qID4gKi8pO1xuXG4gICAgaWYgKHN0YXRlLnBvc2l0aW9uIDwgc3RhdGUubGVuZ3RoKSB7XG4gICAgICB0YWdOYW1lID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIHZlcmJhdGltIHRhZycpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkpIHtcblxuICAgICAgaWYgKGNoID09PSAweDIxLyogISAqLykge1xuICAgICAgICBpZiAoIWlzTmFtZWQpIHtcbiAgICAgICAgICB0YWdIYW5kbGUgPSBzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24gLSAxLCBzdGF0ZS5wb3NpdGlvbiArIDEpO1xuXG4gICAgICAgICAgaWYgKCFQQVRURVJOX1RBR19IQU5ETEUudGVzdCh0YWdIYW5kbGUpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZWQgdGFnIGhhbmRsZSBjYW5ub3QgY29udGFpbiBzdWNoIGNoYXJhY3RlcnMnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc05hbWVkID0gdHJ1ZTtcbiAgICAgICAgICBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbiArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RhZyBzdWZmaXggY2Fubm90IGNvbnRhaW4gZXhjbGFtYXRpb24gbWFya3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgdGFnTmFtZSA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuXG4gICAgaWYgKFBBVFRFUk5fRkxPV19JTkRJQ0FUT1JTLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWcgc3VmZml4IGNhbm5vdCBjb250YWluIGZsb3cgaW5kaWNhdG9yIGNoYXJhY3RlcnMnKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGFnTmFtZSAmJiAhUEFUVEVSTl9UQUdfVVJJLnRlc3QodGFnTmFtZSkpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFnIG5hbWUgY2Fubm90IGNvbnRhaW4gc3VjaCBjaGFyYWN0ZXJzOiAnICsgdGFnTmFtZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHRhZ05hbWUgPSBkZWNvZGVVUklDb21wb25lbnQodGFnTmFtZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWcgbmFtZSBpcyBtYWxmb3JtZWQ6ICcgKyB0YWdOYW1lKTtcbiAgfVxuXG4gIGlmIChpc1ZlcmJhdGltKSB7XG4gICAgc3RhdGUudGFnID0gdGFnTmFtZTtcblxuICB9IGVsc2UgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlLnRhZ01hcCwgdGFnSGFuZGxlKSkge1xuICAgIHN0YXRlLnRhZyA9IHN0YXRlLnRhZ01hcFt0YWdIYW5kbGVdICsgdGFnTmFtZTtcblxuICB9IGVsc2UgaWYgKHRhZ0hhbmRsZSA9PT0gJyEnKSB7XG4gICAgc3RhdGUudGFnID0gJyEnICsgdGFnTmFtZTtcblxuICB9IGVsc2UgaWYgKHRhZ0hhbmRsZSA9PT0gJyEhJykge1xuICAgIHN0YXRlLnRhZyA9ICd0YWc6eWFtbC5vcmcsMjAwMjonICsgdGFnTmFtZTtcblxuICB9IGVsc2Uge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmRlY2xhcmVkIHRhZyBoYW5kbGUgXCInICsgdGFnSGFuZGxlICsgJ1wiJyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZEFuY2hvclByb3BlcnR5KHN0YXRlKSB7XG4gIHZhciBfcG9zaXRpb24sXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCAhPT0gMHgyNi8qICYgKi8pIHJldHVybiBmYWxzZTtcblxuICBpZiAoc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2R1cGxpY2F0aW9uIG9mIGFuIGFuY2hvciBwcm9wZXJ0eScpO1xuICB9XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbjtcblxuICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkgJiYgIWlzX0ZMT1dfSU5ESUNBVE9SKGNoKSkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gX3Bvc2l0aW9uKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ25hbWUgb2YgYW4gYW5jaG9yIG5vZGUgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXInKTtcbiAgfVxuXG4gIHN0YXRlLmFuY2hvciA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZEFsaWFzKHN0YXRlKSB7XG4gIHZhciBfcG9zaXRpb24sIGFsaWFzLFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoY2ggIT09IDB4MkEvKiAqICovKSByZXR1cm4gZmFsc2U7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbjtcblxuICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkgJiYgIWlzX0ZMT1dfSU5ESUNBVE9SKGNoKSkge1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gX3Bvc2l0aW9uKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ25hbWUgb2YgYW4gYWxpYXMgbm9kZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIGNoYXJhY3RlcicpO1xuICB9XG5cbiAgYWxpYXMgPSBzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoIV9oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlLmFuY2hvck1hcCwgYWxpYXMpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuaWRlbnRpZmllZCBhbGlhcyBcIicgKyBhbGlhcyArICdcIicpO1xuICB9XG5cbiAgc3RhdGUucmVzdWx0ID0gc3RhdGUuYW5jaG9yTWFwW2FsaWFzXTtcbiAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29tcG9zZU5vZGUoc3RhdGUsIHBhcmVudEluZGVudCwgbm9kZUNvbnRleHQsIGFsbG93VG9TZWVrLCBhbGxvd0NvbXBhY3QpIHtcbiAgdmFyIGFsbG93QmxvY2tTdHlsZXMsXG4gICAgICBhbGxvd0Jsb2NrU2NhbGFycyxcbiAgICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyxcbiAgICAgIGluZGVudFN0YXR1cyA9IDEsIC8vIDE6IHRoaXM+cGFyZW50LCAwOiB0aGlzPXBhcmVudCwgLTE6IHRoaXM8cGFyZW50XG4gICAgICBhdE5ld0xpbmUgID0gZmFsc2UsXG4gICAgICBoYXNDb250ZW50ID0gZmFsc2UsXG4gICAgICB0eXBlSW5kZXgsXG4gICAgICB0eXBlUXVhbnRpdHksXG4gICAgICB0eXBlTGlzdCxcbiAgICAgIHR5cGUsXG4gICAgICBmbG93SW5kZW50LFxuICAgICAgYmxvY2tJbmRlbnQ7XG5cbiAgaWYgKHN0YXRlLmxpc3RlbmVyICE9PSBudWxsKSB7XG4gICAgc3RhdGUubGlzdGVuZXIoJ29wZW4nLCBzdGF0ZSk7XG4gIH1cblxuICBzdGF0ZS50YWcgICAgPSBudWxsO1xuICBzdGF0ZS5hbmNob3IgPSBudWxsO1xuICBzdGF0ZS5raW5kICAgPSBudWxsO1xuICBzdGF0ZS5yZXN1bHQgPSBudWxsO1xuXG4gIGFsbG93QmxvY2tTdHlsZXMgPSBhbGxvd0Jsb2NrU2NhbGFycyA9IGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9XG4gICAgQ09OVEVYVF9CTE9DS19PVVQgPT09IG5vZGVDb250ZXh0IHx8XG4gICAgQ09OVEVYVF9CTE9DS19JTiAgPT09IG5vZGVDb250ZXh0O1xuXG4gIGlmIChhbGxvd1RvU2Vlaykge1xuICAgIGlmIChza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSkpIHtcbiAgICAgIGF0TmV3TGluZSA9IHRydWU7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICBpbmRlbnRTdGF0dXMgPSAwO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpbmRlbnRTdGF0dXMgPT09IDEpIHtcbiAgICB3aGlsZSAocmVhZFRhZ1Byb3BlcnR5KHN0YXRlKSB8fCByZWFkQW5jaG9yUHJvcGVydHkoc3RhdGUpKSB7XG4gICAgICBpZiAoc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpKSB7XG4gICAgICAgIGF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9IGFsbG93QmxvY2tTdHlsZXM7XG5cbiAgICAgICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPiBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgICBpbmRlbnRTdGF0dXMgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUubGluZUluZGVudCA8IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYWxsb3dCbG9ja0NvbGxlY3Rpb25zKSB7XG4gICAgYWxsb3dCbG9ja0NvbGxlY3Rpb25zID0gYXROZXdMaW5lIHx8IGFsbG93Q29tcGFjdDtcbiAgfVxuXG4gIGlmIChpbmRlbnRTdGF0dXMgPT09IDEgfHwgQ09OVEVYVF9CTE9DS19PVVQgPT09IG5vZGVDb250ZXh0KSB7XG4gICAgaWYgKENPTlRFWFRfRkxPV19JTiA9PT0gbm9kZUNvbnRleHQgfHwgQ09OVEVYVF9GTE9XX09VVCA9PT0gbm9kZUNvbnRleHQpIHtcbiAgICAgIGZsb3dJbmRlbnQgPSBwYXJlbnRJbmRlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb3dJbmRlbnQgPSBwYXJlbnRJbmRlbnQgKyAxO1xuICAgIH1cblxuICAgIGJsb2NrSW5kZW50ID0gc3RhdGUucG9zaXRpb24gLSBzdGF0ZS5saW5lU3RhcnQ7XG5cbiAgICBpZiAoaW5kZW50U3RhdHVzID09PSAxKSB7XG4gICAgICBpZiAoYWxsb3dCbG9ja0NvbGxlY3Rpb25zICYmXG4gICAgICAgICAgKHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBibG9ja0luZGVudCkgfHxcbiAgICAgICAgICAgcmVhZEJsb2NrTWFwcGluZyhzdGF0ZSwgYmxvY2tJbmRlbnQsIGZsb3dJbmRlbnQpKSB8fFxuICAgICAgICAgIHJlYWRGbG93Q29sbGVjdGlvbihzdGF0ZSwgZmxvd0luZGVudCkpIHtcbiAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKGFsbG93QmxvY2tTY2FsYXJzICYmIHJlYWRCbG9ja1NjYWxhcihzdGF0ZSwgZmxvd0luZGVudCkpIHx8XG4gICAgICAgICAgICByZWFkU2luZ2xlUXVvdGVkU2NhbGFyKHN0YXRlLCBmbG93SW5kZW50KSB8fFxuICAgICAgICAgICAgcmVhZERvdWJsZVF1b3RlZFNjYWxhcihzdGF0ZSwgZmxvd0luZGVudCkpIHtcbiAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlYWRBbGlhcyhzdGF0ZSkpIHtcbiAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChzdGF0ZS50YWcgIT09IG51bGwgfHwgc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnYWxpYXMgbm9kZSBzaG91bGQgbm90IGhhdmUgYW55IHByb3BlcnRpZXMnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWFkUGxhaW5TY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19JTiA9PT0gbm9kZUNvbnRleHQpKSB7XG4gICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAoc3RhdGUudGFnID09PSBudWxsKSB7XG4gICAgICAgICAgICBzdGF0ZS50YWcgPSAnPyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlLmFuY2hvciAhPT0gbnVsbCkge1xuICAgICAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbmRlbnRTdGF0dXMgPT09IDApIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZTogYmxvY2sgc2VxdWVuY2VzIGFyZSBhbGxvd2VkIHRvIGhhdmUgc2FtZSBpbmRlbnRhdGlvbiBsZXZlbCBhcyB0aGUgcGFyZW50LlxuICAgICAgLy8gaHR0cDovL3d3dy55YW1sLm9yZy9zcGVjLzEuMi9zcGVjLmh0bWwjaWQyNzk5Nzg0XG4gICAgICBoYXNDb250ZW50ID0gYWxsb3dCbG9ja0NvbGxlY3Rpb25zICYmIHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBibG9ja0luZGVudCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXRlLnRhZyA9PT0gbnVsbCkge1xuICAgIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgIH1cblxuICB9IGVsc2UgaWYgKHN0YXRlLnRhZyA9PT0gJz8nKSB7XG4gICAgLy8gSW1wbGljaXQgcmVzb2x2aW5nIGlzIG5vdCBhbGxvd2VkIGZvciBub24tc2NhbGFyIHR5cGVzLCBhbmQgJz8nXG4gICAgLy8gbm9uLXNwZWNpZmljIHRhZyBpcyBvbmx5IGF1dG9tYXRpY2FsbHkgYXNzaWduZWQgdG8gcGxhaW4gc2NhbGFycy5cbiAgICAvL1xuICAgIC8vIFdlIG9ubHkgbmVlZCB0byBjaGVjayBraW5kIGNvbmZvcm1pdHkgaW4gY2FzZSB1c2VyIGV4cGxpY2l0bHkgYXNzaWducyAnPydcbiAgICAvLyB0YWcsIGZvciBleGFtcGxlIGxpa2UgdGhpczogXCIhPD8+IFswXVwiXG4gICAgLy9cbiAgICBpZiAoc3RhdGUucmVzdWx0ICE9PSBudWxsICYmIHN0YXRlLmtpbmQgIT09ICdzY2FsYXInKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5hY2NlcHRhYmxlIG5vZGUga2luZCBmb3IgITw/PiB0YWc7IGl0IHNob3VsZCBiZSBcInNjYWxhclwiLCBub3QgXCInICsgc3RhdGUua2luZCArICdcIicpO1xuICAgIH1cblxuICAgIGZvciAodHlwZUluZGV4ID0gMCwgdHlwZVF1YW50aXR5ID0gc3RhdGUuaW1wbGljaXRUeXBlcy5sZW5ndGg7IHR5cGVJbmRleCA8IHR5cGVRdWFudGl0eTsgdHlwZUluZGV4ICs9IDEpIHtcbiAgICAgIHR5cGUgPSBzdGF0ZS5pbXBsaWNpdFR5cGVzW3R5cGVJbmRleF07XG5cbiAgICAgIGlmICh0eXBlLnJlc29sdmUoc3RhdGUucmVzdWx0KSkgeyAvLyBgc3RhdGUucmVzdWx0YCB1cGRhdGVkIGluIHJlc29sdmVyIGlmIG1hdGNoZWRcbiAgICAgICAgc3RhdGUucmVzdWx0ID0gdHlwZS5jb25zdHJ1Y3Qoc3RhdGUucmVzdWx0KTtcbiAgICAgICAgc3RhdGUudGFnID0gdHlwZS50YWc7XG4gICAgICAgIGlmIChzdGF0ZS5hbmNob3IgIT09IG51bGwpIHtcbiAgICAgICAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoc3RhdGUudGFnICE9PSAnIScpIHtcbiAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwoc3RhdGUudHlwZU1hcFtzdGF0ZS5raW5kIHx8ICdmYWxsYmFjayddLCBzdGF0ZS50YWcpKSB7XG4gICAgICB0eXBlID0gc3RhdGUudHlwZU1hcFtzdGF0ZS5raW5kIHx8ICdmYWxsYmFjayddW3N0YXRlLnRhZ107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvb2tpbmcgZm9yIG11bHRpIHR5cGVcbiAgICAgIHR5cGUgPSBudWxsO1xuICAgICAgdHlwZUxpc3QgPSBzdGF0ZS50eXBlTWFwLm11bHRpW3N0YXRlLmtpbmQgfHwgJ2ZhbGxiYWNrJ107XG5cbiAgICAgIGZvciAodHlwZUluZGV4ID0gMCwgdHlwZVF1YW50aXR5ID0gdHlwZUxpc3QubGVuZ3RoOyB0eXBlSW5kZXggPCB0eXBlUXVhbnRpdHk7IHR5cGVJbmRleCArPSAxKSB7XG4gICAgICAgIGlmIChzdGF0ZS50YWcuc2xpY2UoMCwgdHlwZUxpc3RbdHlwZUluZGV4XS50YWcubGVuZ3RoKSA9PT0gdHlwZUxpc3RbdHlwZUluZGV4XS50YWcpIHtcbiAgICAgICAgICB0eXBlID0gdHlwZUxpc3RbdHlwZUluZGV4XTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdHlwZSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3Vua25vd24gdGFnICE8JyArIHN0YXRlLnRhZyArICc+Jyk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnJlc3VsdCAhPT0gbnVsbCAmJiB0eXBlLmtpbmQgIT09IHN0YXRlLmtpbmQpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmFjY2VwdGFibGUgbm9kZSBraW5kIGZvciAhPCcgKyBzdGF0ZS50YWcgKyAnPiB0YWc7IGl0IHNob3VsZCBiZSBcIicgKyB0eXBlLmtpbmQgKyAnXCIsIG5vdCBcIicgKyBzdGF0ZS5raW5kICsgJ1wiJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlLnJlc29sdmUoc3RhdGUucmVzdWx0LCBzdGF0ZS50YWcpKSB7IC8vIGBzdGF0ZS5yZXN1bHRgIHVwZGF0ZWQgaW4gcmVzb2x2ZXIgaWYgbWF0Y2hlZFxuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Nhbm5vdCByZXNvbHZlIGEgbm9kZSB3aXRoICE8JyArIHN0YXRlLnRhZyArICc+IGV4cGxpY2l0IHRhZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5yZXN1bHQgPSB0eXBlLmNvbnN0cnVjdChzdGF0ZS5yZXN1bHQsIHN0YXRlLnRhZyk7XG4gICAgICBpZiAoc3RhdGUuYW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5saXN0ZW5lciAhPT0gbnVsbCkge1xuICAgIHN0YXRlLmxpc3RlbmVyKCdjbG9zZScsIHN0YXRlKTtcbiAgfVxuICByZXR1cm4gc3RhdGUudGFnICE9PSBudWxsIHx8ICBzdGF0ZS5hbmNob3IgIT09IG51bGwgfHwgaGFzQ29udGVudDtcbn1cblxuZnVuY3Rpb24gcmVhZERvY3VtZW50KHN0YXRlKSB7XG4gIHZhciBkb2N1bWVudFN0YXJ0ID0gc3RhdGUucG9zaXRpb24sXG4gICAgICBfcG9zaXRpb24sXG4gICAgICBkaXJlY3RpdmVOYW1lLFxuICAgICAgZGlyZWN0aXZlQXJncyxcbiAgICAgIGhhc0RpcmVjdGl2ZXMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIHN0YXRlLnZlcnNpb24gPSBudWxsO1xuICBzdGF0ZS5jaGVja0xpbmVCcmVha3MgPSBzdGF0ZS5sZWdhY3k7XG4gIHN0YXRlLnRhZ01hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHN0YXRlLmFuY2hvck1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgd2hpbGUgKChjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pKSAhPT0gMCkge1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoc3RhdGUubGluZUluZGVudCA+IDAgfHwgY2ggIT09IDB4MjUvKiAlICovKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBoYXNEaXJlY3RpdmVzID0gdHJ1ZTtcbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB3aGlsZSAoY2ggIT09IDAgJiYgIWlzX1dTX09SX0VPTChjaCkpIHtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBkaXJlY3RpdmVOYW1lID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gICAgZGlyZWN0aXZlQXJncyA9IFtdO1xuXG4gICAgaWYgKGRpcmVjdGl2ZU5hbWUubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2RpcmVjdGl2ZSBuYW1lIG11c3Qgbm90IGJlIGxlc3MgdGhhbiBvbmUgY2hhcmFjdGVyIGluIGxlbmd0aCcpO1xuICAgIH1cblxuICAgIHdoaWxlIChjaCAhPT0gMCkge1xuICAgICAgd2hpbGUgKGlzX1dISVRFX1NQQUNFKGNoKSkge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaCA9PT0gMHgyMy8qICMgKi8pIHtcbiAgICAgICAgZG8geyBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7IH1cbiAgICAgICAgd2hpbGUgKGNoICE9PSAwICYmICFpc19FT0woY2gpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc19FT0woY2gpKSBicmVhaztcblxuICAgICAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb247XG5cbiAgICAgIHdoaWxlIChjaCAhPT0gMCAmJiAhaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGRpcmVjdGl2ZUFyZ3MucHVzaChzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKSk7XG4gICAgfVxuXG4gICAgaWYgKGNoICE9PSAwKSByZWFkTGluZUJyZWFrKHN0YXRlKTtcblxuICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbChkaXJlY3RpdmVIYW5kbGVycywgZGlyZWN0aXZlTmFtZSkpIHtcbiAgICAgIGRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZU5hbWVdKHN0YXRlLCBkaXJlY3RpdmVOYW1lLCBkaXJlY3RpdmVBcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3dXYXJuaW5nKHN0YXRlLCAndW5rbm93biBkb2N1bWVudCBkaXJlY3RpdmUgXCInICsgZGlyZWN0aXZlTmFtZSArICdcIicpO1xuICAgIH1cbiAgfVxuXG4gIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICBpZiAoc3RhdGUubGluZUluZGVudCA9PT0gMCAmJlxuICAgICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgICAgID09PSAweDJELyogLSAqLyAmJlxuICAgICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpID09PSAweDJELyogLSAqLyAmJlxuICAgICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDIpID09PSAweDJELyogLSAqLykge1xuICAgIHN0YXRlLnBvc2l0aW9uICs9IDM7XG4gICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gIH0gZWxzZSBpZiAoaGFzRGlyZWN0aXZlcykge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdkaXJlY3RpdmVzIGVuZCBtYXJrIGlzIGV4cGVjdGVkJyk7XG4gIH1cblxuICBjb21wb3NlTm9kZShzdGF0ZSwgc3RhdGUubGluZUluZGVudCAtIDEsIENPTlRFWFRfQkxPQ0tfT1VULCBmYWxzZSwgdHJ1ZSk7XG4gIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICBpZiAoc3RhdGUuY2hlY2tMaW5lQnJlYWtzICYmXG4gICAgICBQQVRURVJOX05PTl9BU0NJSV9MSU5FX0JSRUFLUy50ZXN0KHN0YXRlLmlucHV0LnNsaWNlKGRvY3VtZW50U3RhcnQsIHN0YXRlLnBvc2l0aW9uKSkpIHtcbiAgICB0aHJvd1dhcm5pbmcoc3RhdGUsICdub24tQVNDSUkgbGluZSBicmVha3MgYXJlIGludGVycHJldGVkIGFzIGNvbnRlbnQnKTtcbiAgfVxuXG4gIHN0YXRlLmRvY3VtZW50cy5wdXNoKHN0YXRlLnJlc3VsdCk7XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkge1xuXG4gICAgaWYgKHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pID09PSAweDJFLyogLiAqLykge1xuICAgICAgc3RhdGUucG9zaXRpb24gKz0gMztcbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uIDwgKHN0YXRlLmxlbmd0aCAtIDEpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2VuZCBvZiB0aGUgc3RyZWFtIG9yIGEgZG9jdW1lbnQgc2VwYXJhdG9yIGlzIGV4cGVjdGVkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cblxuZnVuY3Rpb24gbG9hZERvY3VtZW50cyhpbnB1dCwgb3B0aW9ucykge1xuICBpbnB1dCA9IFN0cmluZyhpbnB1dCk7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChpbnB1dC5sZW5ndGggIT09IDApIHtcblxuICAgIC8vIEFkZCB0YWlsaW5nIGBcXG5gIGlmIG5vdCBleGlzdHNcbiAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSAhPT0gMHgwQS8qIExGICovICYmXG4gICAgICAgIGlucHV0LmNoYXJDb2RlQXQoaW5wdXQubGVuZ3RoIC0gMSkgIT09IDB4MEQvKiBDUiAqLykge1xuICAgICAgaW5wdXQgKz0gJ1xcbic7XG4gICAgfVxuXG4gICAgLy8gU3RyaXAgQk9NXG4gICAgaWYgKGlucHV0LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgICAgaW5wdXQgPSBpbnB1dC5zbGljZSgxKTtcbiAgICB9XG4gIH1cblxuICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUoaW5wdXQsIG9wdGlvbnMpO1xuXG4gIHZhciBudWxscG9zID0gaW5wdXQuaW5kZXhPZignXFwwJyk7XG5cbiAgaWYgKG51bGxwb3MgIT09IC0xKSB7XG4gICAgc3RhdGUucG9zaXRpb24gPSBudWxscG9zO1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdudWxsIGJ5dGUgaXMgbm90IGFsbG93ZWQgaW4gaW5wdXQnKTtcbiAgfVxuXG4gIC8vIFVzZSAwIGFzIHN0cmluZyB0ZXJtaW5hdG9yLiBUaGF0IHNpZ25pZmljYW50bHkgc2ltcGxpZmllcyBib3VuZHMgY2hlY2suXG4gIHN0YXRlLmlucHV0ICs9ICdcXDAnO1xuXG4gIHdoaWxlIChzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSA9PT0gMHgyMC8qIFNwYWNlICovKSB7XG4gICAgc3RhdGUubGluZUluZGVudCArPSAxO1xuICAgIHN0YXRlLnBvc2l0aW9uICs9IDE7XG4gIH1cblxuICB3aGlsZSAoc3RhdGUucG9zaXRpb24gPCAoc3RhdGUubGVuZ3RoIC0gMSkpIHtcbiAgICByZWFkRG9jdW1lbnQoc3RhdGUpO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlLmRvY3VtZW50cztcbn1cblxuXG5mdW5jdGlvbiBsb2FkQWxsKGlucHV0LCBpdGVyYXRvciwgb3B0aW9ucykge1xuICBpZiAoaXRlcmF0b3IgIT09IG51bGwgJiYgdHlwZW9mIGl0ZXJhdG9yID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0gaXRlcmF0b3I7XG4gICAgaXRlcmF0b3IgPSBudWxsO1xuICB9XG5cbiAgdmFyIGRvY3VtZW50cyA9IGxvYWREb2N1bWVudHMoaW5wdXQsIG9wdGlvbnMpO1xuXG4gIGlmICh0eXBlb2YgaXRlcmF0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZG9jdW1lbnRzO1xuICB9XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBkb2N1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGl0ZXJhdG9yKGRvY3VtZW50c1tpbmRleF0pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gbG9hZChpbnB1dCwgb3B0aW9ucykge1xuICB2YXIgZG9jdW1lbnRzID0gbG9hZERvY3VtZW50cyhpbnB1dCwgb3B0aW9ucyk7XG5cbiAgaWYgKGRvY3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAvKmVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCovXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmIChkb2N1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50c1swXTtcbiAgfVxuICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignZXhwZWN0ZWQgYSBzaW5nbGUgZG9jdW1lbnQgaW4gdGhlIHN0cmVhbSwgYnV0IGZvdW5kIG1vcmUnKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cy5sb2FkQWxsID0gbG9hZEFsbDtcbm1vZHVsZS5leHBvcnRzLmxvYWQgICAgPSBsb2FkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG5cbi8vIGdldCBzbmlwcGV0IGZvciBhIHNpbmdsZSBsaW5lLCByZXNwZWN0aW5nIG1heExlbmd0aFxuZnVuY3Rpb24gZ2V0TGluZShidWZmZXIsIGxpbmVTdGFydCwgbGluZUVuZCwgcG9zaXRpb24sIG1heExpbmVMZW5ndGgpIHtcbiAgdmFyIGhlYWQgPSAnJztcbiAgdmFyIHRhaWwgPSAnJztcbiAgdmFyIG1heEhhbGZMZW5ndGggPSBNYXRoLmZsb29yKG1heExpbmVMZW5ndGggLyAyKSAtIDE7XG5cbiAgaWYgKHBvc2l0aW9uIC0gbGluZVN0YXJ0ID4gbWF4SGFsZkxlbmd0aCkge1xuICAgIGhlYWQgPSAnIC4uLiAnO1xuICAgIGxpbmVTdGFydCA9IHBvc2l0aW9uIC0gbWF4SGFsZkxlbmd0aCArIGhlYWQubGVuZ3RoO1xuICB9XG5cbiAgaWYgKGxpbmVFbmQgLSBwb3NpdGlvbiA+IG1heEhhbGZMZW5ndGgpIHtcbiAgICB0YWlsID0gJyAuLi4nO1xuICAgIGxpbmVFbmQgPSBwb3NpdGlvbiArIG1heEhhbGZMZW5ndGggLSB0YWlsLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RyOiBoZWFkICsgYnVmZmVyLnNsaWNlKGxpbmVTdGFydCwgbGluZUVuZCkucmVwbGFjZSgvXFx0L2csICfihpInKSArIHRhaWwsXG4gICAgcG9zOiBwb3NpdGlvbiAtIGxpbmVTdGFydCArIGhlYWQubGVuZ3RoIC8vIHJlbGF0aXZlIHBvc2l0aW9uXG4gIH07XG59XG5cblxuZnVuY3Rpb24gcGFkU3RhcnQoc3RyaW5nLCBtYXgpIHtcbiAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBtYXggLSBzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn1cblxuXG5mdW5jdGlvbiBtYWtlU25pcHBldChtYXJrLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG9wdGlvbnMgfHwgbnVsbCk7XG5cbiAgaWYgKCFtYXJrLmJ1ZmZlcikgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCFvcHRpb25zLm1heExlbmd0aCkgb3B0aW9ucy5tYXhMZW5ndGggPSA3OTtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluZGVudCAgICAgICE9PSAnbnVtYmVyJykgb3B0aW9ucy5pbmRlbnQgICAgICA9IDE7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5saW5lc0JlZm9yZSAhPT0gJ251bWJlcicpIG9wdGlvbnMubGluZXNCZWZvcmUgPSAzO1xuICBpZiAodHlwZW9mIG9wdGlvbnMubGluZXNBZnRlciAgIT09ICdudW1iZXInKSBvcHRpb25zLmxpbmVzQWZ0ZXIgID0gMjtcblxuICB2YXIgcmUgPSAvXFxyP1xcbnxcXHJ8XFwwL2c7XG4gIHZhciBsaW5lU3RhcnRzID0gWyAwIF07XG4gIHZhciBsaW5lRW5kcyA9IFtdO1xuICB2YXIgbWF0Y2g7XG4gIHZhciBmb3VuZExpbmVObyA9IC0xO1xuXG4gIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKG1hcmsuYnVmZmVyKSkpIHtcbiAgICBsaW5lRW5kcy5wdXNoKG1hdGNoLmluZGV4KTtcbiAgICBsaW5lU3RhcnRzLnB1c2gobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuXG4gICAgaWYgKG1hcmsucG9zaXRpb24gPD0gbWF0Y2guaW5kZXggJiYgZm91bmRMaW5lTm8gPCAwKSB7XG4gICAgICBmb3VuZExpbmVObyA9IGxpbmVTdGFydHMubGVuZ3RoIC0gMjtcbiAgICB9XG4gIH1cblxuICBpZiAoZm91bmRMaW5lTm8gPCAwKSBmb3VuZExpbmVObyA9IGxpbmVTdGFydHMubGVuZ3RoIC0gMTtcblxuICB2YXIgcmVzdWx0ID0gJycsIGksIGxpbmU7XG4gIHZhciBsaW5lTm9MZW5ndGggPSBNYXRoLm1pbihtYXJrLmxpbmUgKyBvcHRpb25zLmxpbmVzQWZ0ZXIsIGxpbmVFbmRzLmxlbmd0aCkudG9TdHJpbmcoKS5sZW5ndGg7XG4gIHZhciBtYXhMaW5lTGVuZ3RoID0gb3B0aW9ucy5tYXhMZW5ndGggLSAob3B0aW9ucy5pbmRlbnQgKyBsaW5lTm9MZW5ndGggKyAzKTtcblxuICBmb3IgKGkgPSAxOyBpIDw9IG9wdGlvbnMubGluZXNCZWZvcmU7IGkrKykge1xuICAgIGlmIChmb3VuZExpbmVObyAtIGkgPCAwKSBicmVhaztcbiAgICBsaW5lID0gZ2V0TGluZShcbiAgICAgIG1hcmsuYnVmZmVyLFxuICAgICAgbGluZVN0YXJ0c1tmb3VuZExpbmVObyAtIGldLFxuICAgICAgbGluZUVuZHNbZm91bmRMaW5lTm8gLSBpXSxcbiAgICAgIG1hcmsucG9zaXRpb24gLSAobGluZVN0YXJ0c1tmb3VuZExpbmVOb10gLSBsaW5lU3RhcnRzW2ZvdW5kTGluZU5vIC0gaV0pLFxuICAgICAgbWF4TGluZUxlbmd0aFxuICAgICk7XG4gICAgcmVzdWx0ID0gY29tbW9uLnJlcGVhdCgnICcsIG9wdGlvbnMuaW5kZW50KSArIHBhZFN0YXJ0KChtYXJrLmxpbmUgLSBpICsgMSkudG9TdHJpbmcoKSwgbGluZU5vTGVuZ3RoKSArXG4gICAgICAnIHwgJyArIGxpbmUuc3RyICsgJ1xcbicgKyByZXN1bHQ7XG4gIH1cblxuICBsaW5lID0gZ2V0TGluZShtYXJrLmJ1ZmZlciwgbGluZVN0YXJ0c1tmb3VuZExpbmVOb10sIGxpbmVFbmRzW2ZvdW5kTGluZU5vXSwgbWFyay5wb3NpdGlvbiwgbWF4TGluZUxlbmd0aCk7XG4gIHJlc3VsdCArPSBjb21tb24ucmVwZWF0KCcgJywgb3B0aW9ucy5pbmRlbnQpICsgcGFkU3RhcnQoKG1hcmsubGluZSArIDEpLnRvU3RyaW5nKCksIGxpbmVOb0xlbmd0aCkgK1xuICAgICcgfCAnICsgbGluZS5zdHIgKyAnXFxuJztcbiAgcmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJy0nLCBvcHRpb25zLmluZGVudCArIGxpbmVOb0xlbmd0aCArIDMgKyBsaW5lLnBvcykgKyAnXicgKyAnXFxuJztcblxuICBmb3IgKGkgPSAxOyBpIDw9IG9wdGlvbnMubGluZXNBZnRlcjsgaSsrKSB7XG4gICAgaWYgKGZvdW5kTGluZU5vICsgaSA+PSBsaW5lRW5kcy5sZW5ndGgpIGJyZWFrO1xuICAgIGxpbmUgPSBnZXRMaW5lKFxuICAgICAgbWFyay5idWZmZXIsXG4gICAgICBsaW5lU3RhcnRzW2ZvdW5kTGluZU5vICsgaV0sXG4gICAgICBsaW5lRW5kc1tmb3VuZExpbmVObyArIGldLFxuICAgICAgbWFyay5wb3NpdGlvbiAtIChsaW5lU3RhcnRzW2ZvdW5kTGluZU5vXSAtIGxpbmVTdGFydHNbZm91bmRMaW5lTm8gKyBpXSksXG4gICAgICBtYXhMaW5lTGVuZ3RoXG4gICAgKTtcbiAgICByZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnICcsIG9wdGlvbnMuaW5kZW50KSArIHBhZFN0YXJ0KChtYXJrLmxpbmUgKyBpICsgMSkudG9TdHJpbmcoKSwgbGluZU5vTGVuZ3RoKSArXG4gICAgICAnIHwgJyArIGxpbmUuc3RyICsgJ1xcbic7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LnJlcGxhY2UoL1xcbiQvLCAnJyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlU25pcHBldDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyplc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSovXG5cbnZhciBjb21tb24gICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBZQU1MRXhjZXB0aW9uICAgICAgID0gcmVxdWlyZSgnLi9leGNlcHRpb24nKTtcbnZhciBERUZBVUxUX1NDSEVNQSAgICAgID0gcmVxdWlyZSgnLi9zY2hlbWEvZGVmYXVsdCcpO1xuXG52YXIgX3RvU3RyaW5nICAgICAgID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG52YXIgQ0hBUl9CT00gICAgICAgICAgICAgICAgICA9IDB4RkVGRjtcbnZhciBDSEFSX1RBQiAgICAgICAgICAgICAgICAgID0gMHgwOTsgLyogVGFiICovXG52YXIgQ0hBUl9MSU5FX0ZFRUQgICAgICAgICAgICA9IDB4MEE7IC8qIExGICovXG52YXIgQ0hBUl9DQVJSSUFHRV9SRVRVUk4gICAgICA9IDB4MEQ7IC8qIENSICovXG52YXIgQ0hBUl9TUEFDRSAgICAgICAgICAgICAgICA9IDB4MjA7IC8qIFNwYWNlICovXG52YXIgQ0hBUl9FWENMQU1BVElPTiAgICAgICAgICA9IDB4MjE7IC8qICEgKi9cbnZhciBDSEFSX0RPVUJMRV9RVU9URSAgICAgICAgID0gMHgyMjsgLyogXCIgKi9cbnZhciBDSEFSX1NIQVJQICAgICAgICAgICAgICAgID0gMHgyMzsgLyogIyAqL1xudmFyIENIQVJfUEVSQ0VOVCAgICAgICAgICAgICAgPSAweDI1OyAvKiAlICovXG52YXIgQ0hBUl9BTVBFUlNBTkQgICAgICAgICAgICA9IDB4MjY7IC8qICYgKi9cbnZhciBDSEFSX1NJTkdMRV9RVU9URSAgICAgICAgID0gMHgyNzsgLyogJyAqL1xudmFyIENIQVJfQVNURVJJU0sgICAgICAgICAgICAgPSAweDJBOyAvKiAqICovXG52YXIgQ0hBUl9DT01NQSAgICAgICAgICAgICAgICA9IDB4MkM7IC8qICwgKi9cbnZhciBDSEFSX01JTlVTICAgICAgICAgICAgICAgID0gMHgyRDsgLyogLSAqL1xudmFyIENIQVJfQ09MT04gICAgICAgICAgICAgICAgPSAweDNBOyAvKiA6ICovXG52YXIgQ0hBUl9FUVVBTFMgICAgICAgICAgICAgICA9IDB4M0Q7IC8qID0gKi9cbnZhciBDSEFSX0dSRUFURVJfVEhBTiAgICAgICAgID0gMHgzRTsgLyogPiAqL1xudmFyIENIQVJfUVVFU1RJT04gICAgICAgICAgICAgPSAweDNGOyAvKiA/ICovXG52YXIgQ0hBUl9DT01NRVJDSUFMX0FUICAgICAgICA9IDB4NDA7IC8qIEAgKi9cbnZhciBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQgID0gMHg1QjsgLyogWyAqL1xudmFyIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQgPSAweDVEOyAvKiBdICovXG52YXIgQ0hBUl9HUkFWRV9BQ0NFTlQgICAgICAgICA9IDB4NjA7IC8qIGAgKi9cbnZhciBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0tFVCAgID0gMHg3QjsgLyogeyAqL1xudmFyIENIQVJfVkVSVElDQUxfTElORSAgICAgICAgPSAweDdDOyAvKiB8ICovXG52YXIgQ0hBUl9SSUdIVF9DVVJMWV9CUkFDS0VUICA9IDB4N0Q7IC8qIH0gKi9cblxudmFyIEVTQ0FQRV9TRVFVRU5DRVMgPSB7fTtcblxuRVNDQVBFX1NFUVVFTkNFU1sweDAwXSAgID0gJ1xcXFwwJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwN10gICA9ICdcXFxcYSc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MDhdICAgPSAnXFxcXGInO1xuRVNDQVBFX1NFUVVFTkNFU1sweDA5XSAgID0gJ1xcXFx0JztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwQV0gICA9ICdcXFxcbic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MEJdICAgPSAnXFxcXHYnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDBDXSAgID0gJ1xcXFxmJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwRF0gICA9ICdcXFxccic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MUJdICAgPSAnXFxcXGUnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDIyXSAgID0gJ1xcXFxcIic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4NUNdICAgPSAnXFxcXFxcXFwnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDg1XSAgID0gJ1xcXFxOJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHhBMF0gICA9ICdcXFxcXyc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MjAyOF0gPSAnXFxcXEwnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDIwMjldID0gJ1xcXFxQJztcblxudmFyIERFUFJFQ0FURURfQk9PTEVBTlNfU1lOVEFYID0gW1xuICAneScsICdZJywgJ3llcycsICdZZXMnLCAnWUVTJywgJ29uJywgJ09uJywgJ09OJyxcbiAgJ24nLCAnTicsICdubycsICdObycsICdOTycsICdvZmYnLCAnT2ZmJywgJ09GRidcbl07XG5cbnZhciBERVBSRUNBVEVEX0JBU0U2MF9TWU5UQVggPSAvXlstK10/WzAtOV9dKyg/OjpbMC05X10rKSsoPzpcXC5bMC05X10qKT8kLztcblxuZnVuY3Rpb24gY29tcGlsZVN0eWxlTWFwKHNjaGVtYSwgbWFwKSB7XG4gIHZhciByZXN1bHQsIGtleXMsIGluZGV4LCBsZW5ndGgsIHRhZywgc3R5bGUsIHR5cGU7XG5cbiAgaWYgKG1hcCA9PT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHJlc3VsdCA9IHt9O1xuICBrZXlzID0gT2JqZWN0LmtleXMobWFwKTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdGFnID0ga2V5c1tpbmRleF07XG4gICAgc3R5bGUgPSBTdHJpbmcobWFwW3RhZ10pO1xuXG4gICAgaWYgKHRhZy5zbGljZSgwLCAyKSA9PT0gJyEhJykge1xuICAgICAgdGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOicgKyB0YWcuc2xpY2UoMik7XG4gICAgfVxuICAgIHR5cGUgPSBzY2hlbWEuY29tcGlsZWRUeXBlTWFwWydmYWxsYmFjayddW3RhZ107XG5cbiAgICBpZiAodHlwZSAmJiBfaGFzT3duUHJvcGVydHkuY2FsbCh0eXBlLnN0eWxlQWxpYXNlcywgc3R5bGUpKSB7XG4gICAgICBzdHlsZSA9IHR5cGUuc3R5bGVBbGlhc2VzW3N0eWxlXTtcbiAgICB9XG5cbiAgICByZXN1bHRbdGFnXSA9IHN0eWxlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZW5jb2RlSGV4KGNoYXJhY3Rlcikge1xuICB2YXIgc3RyaW5nLCBoYW5kbGUsIGxlbmd0aDtcblxuICBzdHJpbmcgPSBjaGFyYWN0ZXIudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cbiAgaWYgKGNoYXJhY3RlciA8PSAweEZGKSB7XG4gICAgaGFuZGxlID0gJ3gnO1xuICAgIGxlbmd0aCA9IDI7XG4gIH0gZWxzZSBpZiAoY2hhcmFjdGVyIDw9IDB4RkZGRikge1xuICAgIGhhbmRsZSA9ICd1JztcbiAgICBsZW5ndGggPSA0O1xuICB9IGVsc2UgaWYgKGNoYXJhY3RlciA8PSAweEZGRkZGRkZGKSB7XG4gICAgaGFuZGxlID0gJ1UnO1xuICAgIGxlbmd0aCA9IDg7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJ2NvZGUgcG9pbnQgd2l0aGluIGEgc3RyaW5nIG1heSBub3QgYmUgZ3JlYXRlciB0aGFuIDB4RkZGRkZGRkYnKTtcbiAgfVxuXG4gIHJldHVybiAnXFxcXCcgKyBoYW5kbGUgKyBjb21tb24ucmVwZWF0KCcwJywgbGVuZ3RoIC0gc3RyaW5nLmxlbmd0aCkgKyBzdHJpbmc7XG59XG5cblxudmFyIFFVT1RJTkdfVFlQRV9TSU5HTEUgPSAxLFxuICAgIFFVT1RJTkdfVFlQRV9ET1VCTEUgPSAyO1xuXG5mdW5jdGlvbiBTdGF0ZShvcHRpb25zKSB7XG4gIHRoaXMuc2NoZW1hICAgICAgICA9IG9wdGlvbnNbJ3NjaGVtYSddIHx8IERFRkFVTFRfU0NIRU1BO1xuICB0aGlzLmluZGVudCAgICAgICAgPSBNYXRoLm1heCgxLCAob3B0aW9uc1snaW5kZW50J10gfHwgMikpO1xuICB0aGlzLm5vQXJyYXlJbmRlbnQgPSBvcHRpb25zWydub0FycmF5SW5kZW50J10gfHwgZmFsc2U7XG4gIHRoaXMuc2tpcEludmFsaWQgICA9IG9wdGlvbnNbJ3NraXBJbnZhbGlkJ10gfHwgZmFsc2U7XG4gIHRoaXMuZmxvd0xldmVsICAgICA9IChjb21tb24uaXNOb3RoaW5nKG9wdGlvbnNbJ2Zsb3dMZXZlbCddKSA/IC0xIDogb3B0aW9uc1snZmxvd0xldmVsJ10pO1xuICB0aGlzLnN0eWxlTWFwICAgICAgPSBjb21waWxlU3R5bGVNYXAodGhpcy5zY2hlbWEsIG9wdGlvbnNbJ3N0eWxlcyddIHx8IG51bGwpO1xuICB0aGlzLnNvcnRLZXlzICAgICAgPSBvcHRpb25zWydzb3J0S2V5cyddIHx8IGZhbHNlO1xuICB0aGlzLmxpbmVXaWR0aCAgICAgPSBvcHRpb25zWydsaW5lV2lkdGgnXSB8fCA4MDtcbiAgdGhpcy5ub1JlZnMgICAgICAgID0gb3B0aW9uc1snbm9SZWZzJ10gfHwgZmFsc2U7XG4gIHRoaXMubm9Db21wYXRNb2RlICA9IG9wdGlvbnNbJ25vQ29tcGF0TW9kZSddIHx8IGZhbHNlO1xuICB0aGlzLmNvbmRlbnNlRmxvdyAgPSBvcHRpb25zWydjb25kZW5zZUZsb3cnXSB8fCBmYWxzZTtcbiAgdGhpcy5xdW90aW5nVHlwZSAgID0gb3B0aW9uc1sncXVvdGluZ1R5cGUnXSA9PT0gJ1wiJyA/IFFVT1RJTkdfVFlQRV9ET1VCTEUgOiBRVU9USU5HX1RZUEVfU0lOR0xFO1xuICB0aGlzLmZvcmNlUXVvdGVzICAgPSBvcHRpb25zWydmb3JjZVF1b3RlcyddIHx8IGZhbHNlO1xuICB0aGlzLnJlcGxhY2VyICAgICAgPSB0eXBlb2Ygb3B0aW9uc1sncmVwbGFjZXInXSA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnNbJ3JlcGxhY2VyJ10gOiBudWxsO1xuXG4gIHRoaXMuaW1wbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkSW1wbGljaXQ7XG4gIHRoaXMuZXhwbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkRXhwbGljaXQ7XG5cbiAgdGhpcy50YWcgPSBudWxsO1xuICB0aGlzLnJlc3VsdCA9ICcnO1xuXG4gIHRoaXMuZHVwbGljYXRlcyA9IFtdO1xuICB0aGlzLnVzZWREdXBsaWNhdGVzID0gbnVsbDtcbn1cblxuLy8gSW5kZW50cyBldmVyeSBsaW5lIGluIGEgc3RyaW5nLiBFbXB0eSBsaW5lcyAoXFxuIG9ubHkpIGFyZSBub3QgaW5kZW50ZWQuXG5mdW5jdGlvbiBpbmRlbnRTdHJpbmcoc3RyaW5nLCBzcGFjZXMpIHtcbiAgdmFyIGluZCA9IGNvbW1vbi5yZXBlYXQoJyAnLCBzcGFjZXMpLFxuICAgICAgcG9zaXRpb24gPSAwLFxuICAgICAgbmV4dCA9IC0xLFxuICAgICAgcmVzdWx0ID0gJycsXG4gICAgICBsaW5lLFxuICAgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblxuICB3aGlsZSAocG9zaXRpb24gPCBsZW5ndGgpIHtcbiAgICBuZXh0ID0gc3RyaW5nLmluZGV4T2YoJ1xcbicsIHBvc2l0aW9uKTtcbiAgICBpZiAobmV4dCA9PT0gLTEpIHtcbiAgICAgIGxpbmUgPSBzdHJpbmcuc2xpY2UocG9zaXRpb24pO1xuICAgICAgcG9zaXRpb24gPSBsZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpbmUgPSBzdHJpbmcuc2xpY2UocG9zaXRpb24sIG5leHQgKyAxKTtcbiAgICAgIHBvc2l0aW9uID0gbmV4dCArIDE7XG4gICAgfVxuXG4gICAgaWYgKGxpbmUubGVuZ3RoICYmIGxpbmUgIT09ICdcXG4nKSByZXN1bHQgKz0gaW5kO1xuXG4gICAgcmVzdWx0ICs9IGxpbmU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZU5leHRMaW5lKHN0YXRlLCBsZXZlbCkge1xuICByZXR1cm4gJ1xcbicgKyBjb21tb24ucmVwZWF0KCcgJywgc3RhdGUuaW5kZW50ICogbGV2ZWwpO1xufVxuXG5mdW5jdGlvbiB0ZXN0SW1wbGljaXRSZXNvbHZpbmcoc3RhdGUsIHN0cikge1xuICB2YXIgaW5kZXgsIGxlbmd0aCwgdHlwZTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gc3RhdGUuaW1wbGljaXRUeXBlcy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdHlwZSA9IHN0YXRlLmltcGxpY2l0VHlwZXNbaW5kZXhdO1xuXG4gICAgaWYgKHR5cGUucmVzb2x2ZShzdHIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIFszM10gcy13aGl0ZSA6Oj0gcy1zcGFjZSB8IHMtdGFiXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UoYykge1xuICByZXR1cm4gYyA9PT0gQ0hBUl9TUEFDRSB8fCBjID09PSBDSEFSX1RBQjtcbn1cblxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBjaGFyYWN0ZXIgY2FuIGJlIHByaW50ZWQgd2l0aG91dCBlc2NhcGluZy5cbi8vIEZyb20gWUFNTCAxLjI6IFwiYW55IGFsbG93ZWQgY2hhcmFjdGVycyBrbm93biB0byBiZSBub24tcHJpbnRhYmxlXG4vLyBzaG91bGQgYWxzbyBiZSBlc2NhcGVkLiBbSG93ZXZlcixdIFRoaXMgaXNu4oCZdCBtYW5kYXRvcnlcIlxuLy8gRGVyaXZlZCBmcm9tIG5iLWNoYXIgLSBcXHQgLSAjeDg1IC0gI3hBMCAtICN4MjAyOCAtICN4MjAyOS5cbmZ1bmN0aW9uIGlzUHJpbnRhYmxlKGMpIHtcbiAgcmV0dXJuICAoMHgwMDAyMCA8PSBjICYmIGMgPD0gMHgwMDAwN0UpXG4gICAgICB8fCAoKDB4MDAwQTEgPD0gYyAmJiBjIDw9IDB4MDBEN0ZGKSAmJiBjICE9PSAweDIwMjggJiYgYyAhPT0gMHgyMDI5KVxuICAgICAgfHwgKCgweDBFMDAwIDw9IGMgJiYgYyA8PSAweDAwRkZGRCkgJiYgYyAhPT0gQ0hBUl9CT00pXG4gICAgICB8fCAgKDB4MTAwMDAgPD0gYyAmJiBjIDw9IDB4MTBGRkZGKTtcbn1cblxuLy8gWzM0XSBucy1jaGFyIDo6PSBuYi1jaGFyIC0gcy13aGl0ZVxuLy8gWzI3XSBuYi1jaGFyIDo6PSBjLXByaW50YWJsZSAtIGItY2hhciAtIGMtYnl0ZS1vcmRlci1tYXJrXG4vLyBbMjZdIGItY2hhciAgOjo9IGItbGluZS1mZWVkIHwgYi1jYXJyaWFnZS1yZXR1cm5cbi8vIEluY2x1ZGluZyBzLXdoaXRlIChmb3Igc29tZSByZWFzb24sIGV4YW1wbGVzIGRvZXNuJ3QgbWF0Y2ggc3BlY3MgaW4gdGhpcyBhc3BlY3QpXG4vLyBucy1jaGFyIDo6PSBjLXByaW50YWJsZSAtIGItbGluZS1mZWVkIC0gYi1jYXJyaWFnZS1yZXR1cm4gLSBjLWJ5dGUtb3JkZXItbWFya1xuZnVuY3Rpb24gaXNOc0NoYXJPcldoaXRlc3BhY2UoYykge1xuICByZXR1cm4gaXNQcmludGFibGUoYylcbiAgICAmJiBjICE9PSBDSEFSX0JPTVxuICAgIC8vIC0gYi1jaGFyXG4gICAgJiYgYyAhPT0gQ0hBUl9DQVJSSUFHRV9SRVRVUk5cbiAgICAmJiBjICE9PSBDSEFSX0xJTkVfRkVFRDtcbn1cblxuLy8gWzEyN10gIG5zLXBsYWluLXNhZmUoYykgOjo9IGMgPSBmbG93LW91dCAg4oeSIG5zLXBsYWluLXNhZmUtb3V0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGZsb3ctaW4gICDih5IgbnMtcGxhaW4tc2FmZS1pblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBibG9jay1rZXkg4oeSIG5zLXBsYWluLXNhZmUtb3V0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGZsb3cta2V5ICDih5IgbnMtcGxhaW4tc2FmZS1pblxuLy8gWzEyOF0gbnMtcGxhaW4tc2FmZS1vdXQgOjo9IG5zLWNoYXJcbi8vIFsxMjldICBucy1wbGFpbi1zYWZlLWluIDo6PSBucy1jaGFyIC0gYy1mbG93LWluZGljYXRvclxuLy8gWzEzMF0gIG5zLXBsYWluLWNoYXIoYykgOjo9ICAoIG5zLXBsYWluLXNhZmUoYykgLSDigJw64oCdIC0g4oCcI+KAnSApXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICggLyogQW4gbnMtY2hhciBwcmVjZWRpbmcgKi8g4oCcI+KAnSApXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICgg4oCcOuKAnSAvKiBGb2xsb3dlZCBieSBhbiBucy1wbGFpbi1zYWZlKGMpICovIClcbmZ1bmN0aW9uIGlzUGxhaW5TYWZlKGMsIHByZXYsIGluYmxvY2spIHtcbiAgdmFyIGNJc05zQ2hhck9yV2hpdGVzcGFjZSA9IGlzTnNDaGFyT3JXaGl0ZXNwYWNlKGMpO1xuICB2YXIgY0lzTnNDaGFyID0gY0lzTnNDaGFyT3JXaGl0ZXNwYWNlICYmICFpc1doaXRlc3BhY2UoYyk7XG4gIHJldHVybiAoXG4gICAgLy8gbnMtcGxhaW4tc2FmZVxuICAgIGluYmxvY2sgPyAvLyBjID0gZmxvdy1pblxuICAgICAgY0lzTnNDaGFyT3JXaGl0ZXNwYWNlXG4gICAgICA6IGNJc05zQ2hhck9yV2hpdGVzcGFjZVxuICAgICAgICAvLyAtIGMtZmxvdy1pbmRpY2F0b3JcbiAgICAgICAgJiYgYyAhPT0gQ0hBUl9DT01NQVxuICAgICAgICAmJiBjICE9PSBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVRcbiAgICAgICAgJiYgYyAhPT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVFxuICAgICAgICAmJiBjICE9PSBDSEFSX0xFRlRfQ1VSTFlfQlJBQ0tFVFxuICAgICAgICAmJiBjICE9PSBDSEFSX1JJR0hUX0NVUkxZX0JSQUNLRVRcbiAgKVxuICAgIC8vIG5zLXBsYWluLWNoYXJcbiAgICAmJiBjICE9PSBDSEFSX1NIQVJQIC8vIGZhbHNlIG9uICcjJ1xuICAgICYmICEocHJldiA9PT0gQ0hBUl9DT0xPTiAmJiAhY0lzTnNDaGFyKSAvLyBmYWxzZSBvbiAnOiAnXG4gICAgfHwgKGlzTnNDaGFyT3JXaGl0ZXNwYWNlKHByZXYpICYmICFpc1doaXRlc3BhY2UocHJldikgJiYgYyA9PT0gQ0hBUl9TSEFSUCkgLy8gY2hhbmdlIHRvIHRydWUgb24gJ1teIF0jJ1xuICAgIHx8IChwcmV2ID09PSBDSEFSX0NPTE9OICYmIGNJc05zQ2hhcik7IC8vIGNoYW5nZSB0byB0cnVlIG9uICc6W14gXSdcbn1cblxuLy8gU2ltcGxpZmllZCB0ZXN0IGZvciB2YWx1ZXMgYWxsb3dlZCBhcyB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHBsYWluIHN0eWxlLlxuZnVuY3Rpb24gaXNQbGFpblNhZmVGaXJzdChjKSB7XG4gIC8vIFVzZXMgYSBzdWJzZXQgb2YgbnMtY2hhciAtIGMtaW5kaWNhdG9yXG4gIC8vIHdoZXJlIG5zLWNoYXIgPSBuYi1jaGFyIC0gcy13aGl0ZS5cbiAgLy8gTm8gc3VwcG9ydCBvZiAoICgg4oCcP+KAnSB8IOKAnDrigJ0gfCDigJwt4oCdICkgLyogRm9sbG93ZWQgYnkgYW4gbnMtcGxhaW4tc2FmZShjKSkgKi8gKSBwYXJ0XG4gIHJldHVybiBpc1ByaW50YWJsZShjKSAmJiBjICE9PSBDSEFSX0JPTVxuICAgICYmICFpc1doaXRlc3BhY2UoYykgLy8gLSBzLXdoaXRlXG4gICAgLy8gLSAoYy1pbmRpY2F0b3IgOjo9XG4gICAgLy8g4oCcLeKAnSB8IOKAnD/igJ0gfCDigJw64oCdIHwg4oCcLOKAnSB8IOKAnFvigJ0gfCDigJxd4oCdIHwg4oCce+KAnSB8IOKAnH3igJ1cbiAgICAmJiBjICE9PSBDSEFSX01JTlVTXG4gICAgJiYgYyAhPT0gQ0hBUl9RVUVTVElPTlxuICAgICYmIGMgIT09IENIQVJfQ09MT05cbiAgICAmJiBjICE9PSBDSEFSX0NPTU1BXG4gICAgJiYgYyAhPT0gQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUXG4gICAgJiYgYyAhPT0gQ0hBUl9SSUdIVF9TUVVBUkVfQlJBQ0tFVFxuICAgICYmIGMgIT09IENIQVJfTEVGVF9DVVJMWV9CUkFDS0VUXG4gICAgJiYgYyAhPT0gQ0hBUl9SSUdIVF9DVVJMWV9CUkFDS0VUXG4gICAgLy8gfCDigJwj4oCdIHwg4oCcJuKAnSB8IOKAnCrigJ0gfCDigJwh4oCdIHwg4oCcfOKAnSB8IOKAnD3igJ0gfCDigJw+4oCdIHwg4oCcJ+KAnSB8IOKAnFwi4oCdXG4gICAgJiYgYyAhPT0gQ0hBUl9TSEFSUFxuICAgICYmIGMgIT09IENIQVJfQU1QRVJTQU5EXG4gICAgJiYgYyAhPT0gQ0hBUl9BU1RFUklTS1xuICAgICYmIGMgIT09IENIQVJfRVhDTEFNQVRJT05cbiAgICAmJiBjICE9PSBDSEFSX1ZFUlRJQ0FMX0xJTkVcbiAgICAmJiBjICE9PSBDSEFSX0VRVUFMU1xuICAgICYmIGMgIT09IENIQVJfR1JFQVRFUl9USEFOXG4gICAgJiYgYyAhPT0gQ0hBUl9TSU5HTEVfUVVPVEVcbiAgICAmJiBjICE9PSBDSEFSX0RPVUJMRV9RVU9URVxuICAgIC8vIHwg4oCcJeKAnSB8IOKAnEDigJ0gfCDigJxg4oCdKVxuICAgICYmIGMgIT09IENIQVJfUEVSQ0VOVFxuICAgICYmIGMgIT09IENIQVJfQ09NTUVSQ0lBTF9BVFxuICAgICYmIGMgIT09IENIQVJfR1JBVkVfQUNDRU5UO1xufVxuXG4vLyBTaW1wbGlmaWVkIHRlc3QgZm9yIHZhbHVlcyBhbGxvd2VkIGFzIHRoZSBsYXN0IGNoYXJhY3RlciBpbiBwbGFpbiBzdHlsZS5cbmZ1bmN0aW9uIGlzUGxhaW5TYWZlTGFzdChjKSB7XG4gIC8vIGp1c3Qgbm90IHdoaXRlc3BhY2Ugb3IgY29sb24sIGl0IHdpbGwgYmUgY2hlY2tlZCB0byBiZSBwbGFpbiBjaGFyYWN0ZXIgbGF0ZXJcbiAgcmV0dXJuICFpc1doaXRlc3BhY2UoYykgJiYgYyAhPT0gQ0hBUl9DT0xPTjtcbn1cblxuLy8gU2FtZSBhcyAnc3RyaW5nJy5jb2RlUG9pbnRBdChwb3MpLCBidXQgd29ya3MgaW4gb2xkZXIgYnJvd3NlcnMuXG5mdW5jdGlvbiBjb2RlUG9pbnRBdChzdHJpbmcsIHBvcykge1xuICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChwb3MpLCBzZWNvbmQ7XG4gIGlmIChmaXJzdCA+PSAweEQ4MDAgJiYgZmlyc3QgPD0gMHhEQkZGICYmIHBvcyArIDEgPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQocG9zICsgMSk7XG4gICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG4gICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZpcnN0O1xufVxuXG4vLyBEZXRlcm1pbmVzIHdoZXRoZXIgYmxvY2sgaW5kZW50YXRpb24gaW5kaWNhdG9yIGlzIHJlcXVpcmVkLlxuZnVuY3Rpb24gbmVlZEluZGVudEluZGljYXRvcihzdHJpbmcpIHtcbiAgdmFyIGxlYWRpbmdTcGFjZVJlID0gL15cXG4qIC87XG4gIHJldHVybiBsZWFkaW5nU3BhY2VSZS50ZXN0KHN0cmluZyk7XG59XG5cbnZhciBTVFlMRV9QTEFJTiAgID0gMSxcbiAgICBTVFlMRV9TSU5HTEUgID0gMixcbiAgICBTVFlMRV9MSVRFUkFMID0gMyxcbiAgICBTVFlMRV9GT0xERUQgID0gNCxcbiAgICBTVFlMRV9ET1VCTEUgID0gNTtcblxuLy8gRGV0ZXJtaW5lcyB3aGljaCBzY2FsYXIgc3R5bGVzIGFyZSBwb3NzaWJsZSBhbmQgcmV0dXJucyB0aGUgcHJlZmVycmVkIHN0eWxlLlxuLy8gbGluZVdpZHRoID0gLTEgPT4gbm8gbGltaXQuXG4vLyBQcmUtY29uZGl0aW9uczogc3RyLmxlbmd0aCA+IDAuXG4vLyBQb3N0LWNvbmRpdGlvbnM6XG4vLyAgICBTVFlMRV9QTEFJTiBvciBTVFlMRV9TSU5HTEUgPT4gbm8gXFxuIGFyZSBpbiB0aGUgc3RyaW5nLlxuLy8gICAgU1RZTEVfTElURVJBTCA9PiBubyBsaW5lcyBhcmUgc3VpdGFibGUgZm9yIGZvbGRpbmcgKG9yIGxpbmVXaWR0aCBpcyAtMSkuXG4vLyAgICBTVFlMRV9GT0xERUQgPT4gYSBsaW5lID4gbGluZVdpZHRoIGFuZCBjYW4gYmUgZm9sZGVkIChhbmQgbGluZVdpZHRoICE9IC0xKS5cbmZ1bmN0aW9uIGNob29zZVNjYWxhclN0eWxlKHN0cmluZywgc2luZ2xlTGluZU9ubHksIGluZGVudFBlckxldmVsLCBsaW5lV2lkdGgsXG4gIHRlc3RBbWJpZ3VvdXNUeXBlLCBxdW90aW5nVHlwZSwgZm9yY2VRdW90ZXMsIGluYmxvY2spIHtcblxuICB2YXIgaTtcbiAgdmFyIGNoYXIgPSAwO1xuICB2YXIgcHJldkNoYXIgPSBudWxsO1xuICB2YXIgaGFzTGluZUJyZWFrID0gZmFsc2U7XG4gIHZhciBoYXNGb2xkYWJsZUxpbmUgPSBmYWxzZTsgLy8gb25seSBjaGVja2VkIGlmIHNob3VsZFRyYWNrV2lkdGhcbiAgdmFyIHNob3VsZFRyYWNrV2lkdGggPSBsaW5lV2lkdGggIT09IC0xO1xuICB2YXIgcHJldmlvdXNMaW5lQnJlYWsgPSAtMTsgLy8gY291bnQgdGhlIGZpcnN0IGxpbmUgY29ycmVjdGx5XG4gIHZhciBwbGFpbiA9IGlzUGxhaW5TYWZlRmlyc3QoY29kZVBvaW50QXQoc3RyaW5nLCAwKSlcbiAgICAgICAgICAmJiBpc1BsYWluU2FmZUxhc3QoY29kZVBvaW50QXQoc3RyaW5nLCBzdHJpbmcubGVuZ3RoIC0gMSkpO1xuXG4gIGlmIChzaW5nbGVMaW5lT25seSB8fCBmb3JjZVF1b3Rlcykge1xuICAgIC8vIENhc2U6IG5vIGJsb2NrIHN0eWxlcy5cbiAgICAvLyBDaGVjayBmb3IgZGlzYWxsb3dlZCBjaGFyYWN0ZXJzIHRvIHJ1bGUgb3V0IHBsYWluIGFuZCBzaW5nbGUuXG4gICAgZm9yIChpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGNoYXIgPj0gMHgxMDAwMCA/IGkgKz0gMiA6IGkrKykge1xuICAgICAgY2hhciA9IGNvZGVQb2ludEF0KHN0cmluZywgaSk7XG4gICAgICBpZiAoIWlzUHJpbnRhYmxlKGNoYXIpKSB7XG4gICAgICAgIHJldHVybiBTVFlMRV9ET1VCTEU7XG4gICAgICB9XG4gICAgICBwbGFpbiA9IHBsYWluICYmIGlzUGxhaW5TYWZlKGNoYXIsIHByZXZDaGFyLCBpbmJsb2NrKTtcbiAgICAgIHByZXZDaGFyID0gY2hhcjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQ2FzZTogYmxvY2sgc3R5bGVzIHBlcm1pdHRlZC5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgY2hhciA+PSAweDEwMDAwID8gaSArPSAyIDogaSsrKSB7XG4gICAgICBjaGFyID0gY29kZVBvaW50QXQoc3RyaW5nLCBpKTtcbiAgICAgIGlmIChjaGFyID09PSBDSEFSX0xJTkVfRkVFRCkge1xuICAgICAgICBoYXNMaW5lQnJlYWsgPSB0cnVlO1xuICAgICAgICAvLyBDaGVjayBpZiBhbnkgbGluZSBjYW4gYmUgZm9sZGVkLlxuICAgICAgICBpZiAoc2hvdWxkVHJhY2tXaWR0aCkge1xuICAgICAgICAgIGhhc0ZvbGRhYmxlTGluZSA9IGhhc0ZvbGRhYmxlTGluZSB8fFxuICAgICAgICAgICAgLy8gRm9sZGFibGUgbGluZSA9IHRvbyBsb25nLCBhbmQgbm90IG1vcmUtaW5kZW50ZWQuXG4gICAgICAgICAgICAoaSAtIHByZXZpb3VzTGluZUJyZWFrIC0gMSA+IGxpbmVXaWR0aCAmJlxuICAgICAgICAgICAgIHN0cmluZ1twcmV2aW91c0xpbmVCcmVhayArIDFdICE9PSAnICcpO1xuICAgICAgICAgIHByZXZpb3VzTGluZUJyZWFrID0gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghaXNQcmludGFibGUoY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIFNUWUxFX0RPVUJMRTtcbiAgICAgIH1cbiAgICAgIHBsYWluID0gcGxhaW4gJiYgaXNQbGFpblNhZmUoY2hhciwgcHJldkNoYXIsIGluYmxvY2spO1xuICAgICAgcHJldkNoYXIgPSBjaGFyO1xuICAgIH1cbiAgICAvLyBpbiBjYXNlIHRoZSBlbmQgaXMgbWlzc2luZyBhIFxcblxuICAgIGhhc0ZvbGRhYmxlTGluZSA9IGhhc0ZvbGRhYmxlTGluZSB8fCAoc2hvdWxkVHJhY2tXaWR0aCAmJlxuICAgICAgKGkgLSBwcmV2aW91c0xpbmVCcmVhayAtIDEgPiBsaW5lV2lkdGggJiZcbiAgICAgICBzdHJpbmdbcHJldmlvdXNMaW5lQnJlYWsgKyAxXSAhPT0gJyAnKSk7XG4gIH1cbiAgLy8gQWx0aG91Z2ggZXZlcnkgc3R5bGUgY2FuIHJlcHJlc2VudCBcXG4gd2l0aG91dCBlc2NhcGluZywgcHJlZmVyIGJsb2NrIHN0eWxlc1xuICAvLyBmb3IgbXVsdGlsaW5lLCBzaW5jZSB0aGV5J3JlIG1vcmUgcmVhZGFibGUgYW5kIHRoZXkgZG9uJ3QgYWRkIGVtcHR5IGxpbmVzLlxuICAvLyBBbHNvIHByZWZlciBmb2xkaW5nIGEgc3VwZXItbG9uZyBsaW5lLlxuICBpZiAoIWhhc0xpbmVCcmVhayAmJiAhaGFzRm9sZGFibGVMaW5lKSB7XG4gICAgLy8gU3RyaW5ncyBpbnRlcnByZXRhYmxlIGFzIGFub3RoZXIgdHlwZSBoYXZlIHRvIGJlIHF1b3RlZDtcbiAgICAvLyBlLmcuIHRoZSBzdHJpbmcgJ3RydWUnIHZzLiB0aGUgYm9vbGVhbiB0cnVlLlxuICAgIGlmIChwbGFpbiAmJiAhZm9yY2VRdW90ZXMgJiYgIXRlc3RBbWJpZ3VvdXNUeXBlKHN0cmluZykpIHtcbiAgICAgIHJldHVybiBTVFlMRV9QTEFJTjtcbiAgICB9XG4gICAgcmV0dXJuIHF1b3RpbmdUeXBlID09PSBRVU9USU5HX1RZUEVfRE9VQkxFID8gU1RZTEVfRE9VQkxFIDogU1RZTEVfU0lOR0xFO1xuICB9XG4gIC8vIEVkZ2UgY2FzZTogYmxvY2sgaW5kZW50YXRpb24gaW5kaWNhdG9yIGNhbiBvbmx5IGhhdmUgb25lIGRpZ2l0LlxuICBpZiAoaW5kZW50UGVyTGV2ZWwgPiA5ICYmIG5lZWRJbmRlbnRJbmRpY2F0b3Ioc3RyaW5nKSkge1xuICAgIHJldHVybiBTVFlMRV9ET1VCTEU7XG4gIH1cbiAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IGJsb2NrIHN0eWxlcyBhcmUgdmFsaWQuXG4gIC8vIFByZWZlciBsaXRlcmFsIHN0eWxlIHVubGVzcyB3ZSB3YW50IHRvIGZvbGQuXG4gIGlmICghZm9yY2VRdW90ZXMpIHtcbiAgICByZXR1cm4gaGFzRm9sZGFibGVMaW5lID8gU1RZTEVfRk9MREVEIDogU1RZTEVfTElURVJBTDtcbiAgfVxuICByZXR1cm4gcXVvdGluZ1R5cGUgPT09IFFVT1RJTkdfVFlQRV9ET1VCTEUgPyBTVFlMRV9ET1VCTEUgOiBTVFlMRV9TSU5HTEU7XG59XG5cbi8vIE5vdGU6IGxpbmUgYnJlYWtpbmcvZm9sZGluZyBpcyBpbXBsZW1lbnRlZCBmb3Igb25seSB0aGUgZm9sZGVkIHN0eWxlLlxuLy8gTkIuIFdlIGRyb3AgdGhlIGxhc3QgdHJhaWxpbmcgbmV3bGluZSAoaWYgYW55KSBvZiBhIHJldHVybmVkIGJsb2NrIHNjYWxhclxuLy8gIHNpbmNlIHRoZSBkdW1wZXIgYWRkcyBpdHMgb3duIG5ld2xpbmUuIFRoaXMgYWx3YXlzIHdvcmtzOlxuLy8gICAg4oCiIE5vIGVuZGluZyBuZXdsaW5lID0+IHVuYWZmZWN0ZWQ7IGFscmVhZHkgdXNpbmcgc3RyaXAgXCItXCIgY2hvbXBpbmcuXG4vLyAgICDigKIgRW5kaW5nIG5ld2xpbmUgICAgPT4gcmVtb3ZlZCB0aGVuIHJlc3RvcmVkLlxuLy8gIEltcG9ydGFudGx5LCB0aGlzIGtlZXBzIHRoZSBcIitcIiBjaG9tcCBpbmRpY2F0b3IgZnJvbSBnYWluaW5nIGFuIGV4dHJhIGxpbmUuXG5mdW5jdGlvbiB3cml0ZVNjYWxhcihzdGF0ZSwgc3RyaW5nLCBsZXZlbCwgaXNrZXksIGluYmxvY2spIHtcbiAgc3RhdGUuZHVtcCA9IChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzdGF0ZS5xdW90aW5nVHlwZSA9PT0gUVVPVElOR19UWVBFX0RPVUJMRSA/ICdcIlwiJyA6IFwiJydcIjtcbiAgICB9XG4gICAgaWYgKCFzdGF0ZS5ub0NvbXBhdE1vZGUpIHtcbiAgICAgIGlmIChERVBSRUNBVEVEX0JPT0xFQU5TX1NZTlRBWC5pbmRleE9mKHN0cmluZykgIT09IC0xIHx8IERFUFJFQ0FURURfQkFTRTYwX1NZTlRBWC50ZXN0KHN0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnF1b3RpbmdUeXBlID09PSBRVU9USU5HX1RZUEVfRE9VQkxFID8gKCdcIicgKyBzdHJpbmcgKyAnXCInKSA6IChcIidcIiArIHN0cmluZyArIFwiJ1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaW5kZW50ID0gc3RhdGUuaW5kZW50ICogTWF0aC5tYXgoMSwgbGV2ZWwpOyAvLyBubyAwLWluZGVudCBzY2FsYXJzXG4gICAgLy8gQXMgaW5kZW50YXRpb24gZ2V0cyBkZWVwZXIsIGxldCB0aGUgd2lkdGggZGVjcmVhc2UgbW9ub3RvbmljYWxseVxuICAgIC8vIHRvIHRoZSBsb3dlciBib3VuZCBtaW4oc3RhdGUubGluZVdpZHRoLCA0MCkuXG4gICAgLy8gTm90ZSB0aGF0IHRoaXMgaW1wbGllc1xuICAgIC8vICBzdGF0ZS5saW5lV2lkdGgg4omkIDQwICsgc3RhdGUuaW5kZW50OiB3aWR0aCBpcyBmaXhlZCBhdCB0aGUgbG93ZXIgYm91bmQuXG4gICAgLy8gIHN0YXRlLmxpbmVXaWR0aCA+IDQwICsgc3RhdGUuaW5kZW50OiB3aWR0aCBkZWNyZWFzZXMgdW50aWwgdGhlIGxvd2VyIGJvdW5kLlxuICAgIC8vIFRoaXMgYmVoYXZlcyBiZXR0ZXIgdGhhbiBhIGNvbnN0YW50IG1pbmltdW0gd2lkdGggd2hpY2ggZGlzYWxsb3dzIG5hcnJvd2VyIG9wdGlvbnMsXG4gICAgLy8gb3IgYW4gaW5kZW50IHRocmVzaG9sZCB3aGljaCBjYXVzZXMgdGhlIHdpZHRoIHRvIHN1ZGRlbmx5IGluY3JlYXNlLlxuICAgIHZhciBsaW5lV2lkdGggPSBzdGF0ZS5saW5lV2lkdGggPT09IC0xXG4gICAgICA/IC0xIDogTWF0aC5tYXgoTWF0aC5taW4oc3RhdGUubGluZVdpZHRoLCA0MCksIHN0YXRlLmxpbmVXaWR0aCAtIGluZGVudCk7XG5cbiAgICAvLyBXaXRob3V0IGtub3dpbmcgaWYga2V5cyBhcmUgaW1wbGljaXQvZXhwbGljaXQsIGFzc3VtZSBpbXBsaWNpdCBmb3Igc2FmZXR5LlxuICAgIHZhciBzaW5nbGVMaW5lT25seSA9IGlza2V5XG4gICAgICAvLyBObyBibG9jayBzdHlsZXMgaW4gZmxvdyBtb2RlLlxuICAgICAgfHwgKHN0YXRlLmZsb3dMZXZlbCA+IC0xICYmIGxldmVsID49IHN0YXRlLmZsb3dMZXZlbCk7XG4gICAgZnVuY3Rpb24gdGVzdEFtYmlndWl0eShzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0ZXN0SW1wbGljaXRSZXNvbHZpbmcoc3RhdGUsIHN0cmluZyk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChjaG9vc2VTY2FsYXJTdHlsZShzdHJpbmcsIHNpbmdsZUxpbmVPbmx5LCBzdGF0ZS5pbmRlbnQsIGxpbmVXaWR0aCxcbiAgICAgIHRlc3RBbWJpZ3VpdHksIHN0YXRlLnF1b3RpbmdUeXBlLCBzdGF0ZS5mb3JjZVF1b3RlcyAmJiAhaXNrZXksIGluYmxvY2spKSB7XG5cbiAgICAgIGNhc2UgU1RZTEVfUExBSU46XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICBjYXNlIFNUWUxFX1NJTkdMRTpcbiAgICAgICAgcmV0dXJuIFwiJ1wiICsgc3RyaW5nLnJlcGxhY2UoLycvZywgXCInJ1wiKSArIFwiJ1wiO1xuICAgICAgY2FzZSBTVFlMRV9MSVRFUkFMOlxuICAgICAgICByZXR1cm4gJ3wnICsgYmxvY2tIZWFkZXIoc3RyaW5nLCBzdGF0ZS5pbmRlbnQpXG4gICAgICAgICAgKyBkcm9wRW5kaW5nTmV3bGluZShpbmRlbnRTdHJpbmcoc3RyaW5nLCBpbmRlbnQpKTtcbiAgICAgIGNhc2UgU1RZTEVfRk9MREVEOlxuICAgICAgICByZXR1cm4gJz4nICsgYmxvY2tIZWFkZXIoc3RyaW5nLCBzdGF0ZS5pbmRlbnQpXG4gICAgICAgICAgKyBkcm9wRW5kaW5nTmV3bGluZShpbmRlbnRTdHJpbmcoZm9sZFN0cmluZyhzdHJpbmcsIGxpbmVXaWR0aCksIGluZGVudCkpO1xuICAgICAgY2FzZSBTVFlMRV9ET1VCTEU6XG4gICAgICAgIHJldHVybiAnXCInICsgZXNjYXBlU3RyaW5nKHN0cmluZywgbGluZVdpZHRoKSArICdcIic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignaW1wb3NzaWJsZSBlcnJvcjogaW52YWxpZCBzY2FsYXIgc3R5bGUnKTtcbiAgICB9XG4gIH0oKSk7XG59XG5cbi8vIFByZS1jb25kaXRpb25zOiBzdHJpbmcgaXMgdmFsaWQgZm9yIGEgYmxvY2sgc2NhbGFyLCAxIDw9IGluZGVudFBlckxldmVsIDw9IDkuXG5mdW5jdGlvbiBibG9ja0hlYWRlcihzdHJpbmcsIGluZGVudFBlckxldmVsKSB7XG4gIHZhciBpbmRlbnRJbmRpY2F0b3IgPSBuZWVkSW5kZW50SW5kaWNhdG9yKHN0cmluZykgPyBTdHJpbmcoaW5kZW50UGVyTGV2ZWwpIDogJyc7XG5cbiAgLy8gbm90ZSB0aGUgc3BlY2lhbCBjYXNlOiB0aGUgc3RyaW5nICdcXG4nIGNvdW50cyBhcyBhIFwidHJhaWxpbmdcIiBlbXB0eSBsaW5lLlxuICB2YXIgY2xpcCA9ICAgICAgICAgIHN0cmluZ1tzdHJpbmcubGVuZ3RoIC0gMV0gPT09ICdcXG4nO1xuICB2YXIga2VlcCA9IGNsaXAgJiYgKHN0cmluZ1tzdHJpbmcubGVuZ3RoIC0gMl0gPT09ICdcXG4nIHx8IHN0cmluZyA9PT0gJ1xcbicpO1xuICB2YXIgY2hvbXAgPSBrZWVwID8gJysnIDogKGNsaXAgPyAnJyA6ICctJyk7XG5cbiAgcmV0dXJuIGluZGVudEluZGljYXRvciArIGNob21wICsgJ1xcbic7XG59XG5cbi8vIChTZWUgdGhlIG5vdGUgZm9yIHdyaXRlU2NhbGFyLilcbmZ1bmN0aW9uIGRyb3BFbmRpbmdOZXdsaW5lKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nW3N0cmluZy5sZW5ndGggLSAxXSA9PT0gJ1xcbicgPyBzdHJpbmcuc2xpY2UoMCwgLTEpIDogc3RyaW5nO1xufVxuXG4vLyBOb3RlOiBhIGxvbmcgbGluZSB3aXRob3V0IGEgc3VpdGFibGUgYnJlYWsgcG9pbnQgd2lsbCBleGNlZWQgdGhlIHdpZHRoIGxpbWl0LlxuLy8gUHJlLWNvbmRpdGlvbnM6IGV2ZXJ5IGNoYXIgaW4gc3RyIGlzUHJpbnRhYmxlLCBzdHIubGVuZ3RoID4gMCwgd2lkdGggPiAwLlxuZnVuY3Rpb24gZm9sZFN0cmluZyhzdHJpbmcsIHdpZHRoKSB7XG4gIC8vIEluIGZvbGRlZCBzdHlsZSwgJGskIGNvbnNlY3V0aXZlIG5ld2xpbmVzIG91dHB1dCBhcyAkaysxJCBuZXdsaW5lc+KAlFxuICAvLyB1bmxlc3MgdGhleSdyZSBiZWZvcmUgb3IgYWZ0ZXIgYSBtb3JlLWluZGVudGVkIGxpbmUsIG9yIGF0IHRoZSB2ZXJ5XG4gIC8vIGJlZ2lubmluZyBvciBlbmQsIGluIHdoaWNoIGNhc2UgJGskIG1hcHMgdG8gJGskLlxuICAvLyBUaGVyZWZvcmUsIHBhcnNlIGVhY2ggY2h1bmsgYXMgbmV3bGluZShzKSBmb2xsb3dlZCBieSBhIGNvbnRlbnQgbGluZS5cbiAgdmFyIGxpbmVSZSA9IC8oXFxuKykoW15cXG5dKikvZztcblxuICAvLyBmaXJzdCBsaW5lIChwb3NzaWJseSBhbiBlbXB0eSBsaW5lKVxuICB2YXIgcmVzdWx0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV4dExGID0gc3RyaW5nLmluZGV4T2YoJ1xcbicpO1xuICAgIG5leHRMRiA9IG5leHRMRiAhPT0gLTEgPyBuZXh0TEYgOiBzdHJpbmcubGVuZ3RoO1xuICAgIGxpbmVSZS5sYXN0SW5kZXggPSBuZXh0TEY7XG4gICAgcmV0dXJuIGZvbGRMaW5lKHN0cmluZy5zbGljZSgwLCBuZXh0TEYpLCB3aWR0aCk7XG4gIH0oKSk7XG4gIC8vIElmIHdlIGhhdmVuJ3QgcmVhY2hlZCB0aGUgZmlyc3QgY29udGVudCBsaW5lIHlldCwgZG9uJ3QgYWRkIGFuIGV4dHJhIFxcbi5cbiAgdmFyIHByZXZNb3JlSW5kZW50ZWQgPSBzdHJpbmdbMF0gPT09ICdcXG4nIHx8IHN0cmluZ1swXSA9PT0gJyAnO1xuICB2YXIgbW9yZUluZGVudGVkO1xuXG4gIC8vIHJlc3Qgb2YgdGhlIGxpbmVzXG4gIHZhciBtYXRjaDtcbiAgd2hpbGUgKChtYXRjaCA9IGxpbmVSZS5leGVjKHN0cmluZykpKSB7XG4gICAgdmFyIHByZWZpeCA9IG1hdGNoWzFdLCBsaW5lID0gbWF0Y2hbMl07XG4gICAgbW9yZUluZGVudGVkID0gKGxpbmVbMF0gPT09ICcgJyk7XG4gICAgcmVzdWx0ICs9IHByZWZpeFxuICAgICAgKyAoIXByZXZNb3JlSW5kZW50ZWQgJiYgIW1vcmVJbmRlbnRlZCAmJiBsaW5lICE9PSAnJ1xuICAgICAgICA/ICdcXG4nIDogJycpXG4gICAgICArIGZvbGRMaW5lKGxpbmUsIHdpZHRoKTtcbiAgICBwcmV2TW9yZUluZGVudGVkID0gbW9yZUluZGVudGVkO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gR3JlZWR5IGxpbmUgYnJlYWtpbmcuXG4vLyBQaWNrcyB0aGUgbG9uZ2VzdCBsaW5lIHVuZGVyIHRoZSBsaW1pdCBlYWNoIHRpbWUsXG4vLyBvdGhlcndpc2Ugc2V0dGxlcyBmb3IgdGhlIHNob3J0ZXN0IGxpbmUgb3ZlciB0aGUgbGltaXQuXG4vLyBOQi4gTW9yZS1pbmRlbnRlZCBsaW5lcyAqY2Fubm90KiBiZSBmb2xkZWQsIGFzIHRoYXQgd291bGQgYWRkIGFuIGV4dHJhIFxcbi5cbmZ1bmN0aW9uIGZvbGRMaW5lKGxpbmUsIHdpZHRoKSB7XG4gIGlmIChsaW5lID09PSAnJyB8fCBsaW5lWzBdID09PSAnICcpIHJldHVybiBsaW5lO1xuXG4gIC8vIFNpbmNlIGEgbW9yZS1pbmRlbnRlZCBsaW5lIGFkZHMgYSBcXG4sIGJyZWFrcyBjYW4ndCBiZSBmb2xsb3dlZCBieSBhIHNwYWNlLlxuICB2YXIgYnJlYWtSZSA9IC8gW14gXS9nOyAvLyBub3RlOiB0aGUgbWF0Y2ggaW5kZXggd2lsbCBhbHdheXMgYmUgPD0gbGVuZ3RoLTIuXG4gIHZhciBtYXRjaDtcbiAgLy8gc3RhcnQgaXMgYW4gaW5jbHVzaXZlIGluZGV4LiBlbmQsIGN1cnIsIGFuZCBuZXh0IGFyZSBleGNsdXNpdmUuXG4gIHZhciBzdGFydCA9IDAsIGVuZCwgY3VyciA9IDAsIG5leHQgPSAwO1xuICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgLy8gSW52YXJpYW50czogMCA8PSBzdGFydCA8PSBsZW5ndGgtMS5cbiAgLy8gICAwIDw9IGN1cnIgPD0gbmV4dCA8PSBtYXgoMCwgbGVuZ3RoLTIpLiBjdXJyIC0gc3RhcnQgPD0gd2lkdGguXG4gIC8vIEluc2lkZSB0aGUgbG9vcDpcbiAgLy8gICBBIG1hdGNoIGltcGxpZXMgbGVuZ3RoID49IDIsIHNvIGN1cnIgYW5kIG5leHQgYXJlIDw9IGxlbmd0aC0yLlxuICB3aGlsZSAoKG1hdGNoID0gYnJlYWtSZS5leGVjKGxpbmUpKSkge1xuICAgIG5leHQgPSBtYXRjaC5pbmRleDtcbiAgICAvLyBtYWludGFpbiBpbnZhcmlhbnQ6IGN1cnIgLSBzdGFydCA8PSB3aWR0aFxuICAgIGlmIChuZXh0IC0gc3RhcnQgPiB3aWR0aCkge1xuICAgICAgZW5kID0gKGN1cnIgPiBzdGFydCkgPyBjdXJyIDogbmV4dDsgLy8gZGVyaXZlIGVuZCA8PSBsZW5ndGgtMlxuICAgICAgcmVzdWx0ICs9ICdcXG4nICsgbGluZS5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgIC8vIHNraXAgdGhlIHNwYWNlIHRoYXQgd2FzIG91dHB1dCBhcyBcXG5cbiAgICAgIHN0YXJ0ID0gZW5kICsgMTsgICAgICAgICAgICAgICAgICAgIC8vIGRlcml2ZSBzdGFydCA8PSBsZW5ndGgtMVxuICAgIH1cbiAgICBjdXJyID0gbmV4dDtcbiAgfVxuXG4gIC8vIEJ5IHRoZSBpbnZhcmlhbnRzLCBzdGFydCA8PSBsZW5ndGgtMSwgc28gdGhlcmUgaXMgc29tZXRoaW5nIGxlZnQgb3Zlci5cbiAgLy8gSXQgaXMgZWl0aGVyIHRoZSB3aG9sZSBzdHJpbmcgb3IgYSBwYXJ0IHN0YXJ0aW5nIGZyb20gbm9uLXdoaXRlc3BhY2UuXG4gIHJlc3VsdCArPSAnXFxuJztcbiAgLy8gSW5zZXJ0IGEgYnJlYWsgaWYgdGhlIHJlbWFpbmRlciBpcyB0b28gbG9uZyBhbmQgdGhlcmUgaXMgYSBicmVhayBhdmFpbGFibGUuXG4gIGlmIChsaW5lLmxlbmd0aCAtIHN0YXJ0ID4gd2lkdGggJiYgY3VyciA+IHN0YXJ0KSB7XG4gICAgcmVzdWx0ICs9IGxpbmUuc2xpY2Uoc3RhcnQsIGN1cnIpICsgJ1xcbicgKyBsaW5lLnNsaWNlKGN1cnIgKyAxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gbGluZS5zbGljZShzdGFydCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LnNsaWNlKDEpOyAvLyBkcm9wIGV4dHJhIFxcbiBqb2luZXJcbn1cblxuLy8gRXNjYXBlcyBhIGRvdWJsZS1xdW90ZWQgc3RyaW5nLlxuZnVuY3Rpb24gZXNjYXBlU3RyaW5nKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIHZhciBjaGFyID0gMDtcbiAgdmFyIGVzY2FwZVNlcTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7IGNoYXIgPj0gMHgxMDAwMCA/IGkgKz0gMiA6IGkrKykge1xuICAgIGNoYXIgPSBjb2RlUG9pbnRBdChzdHJpbmcsIGkpO1xuICAgIGVzY2FwZVNlcSA9IEVTQ0FQRV9TRVFVRU5DRVNbY2hhcl07XG5cbiAgICBpZiAoIWVzY2FwZVNlcSAmJiBpc1ByaW50YWJsZShjaGFyKSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZ1tpXTtcbiAgICAgIGlmIChjaGFyID49IDB4MTAwMDApIHJlc3VsdCArPSBzdHJpbmdbaSArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgKz0gZXNjYXBlU2VxIHx8IGVuY29kZUhleChjaGFyKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB3cml0ZUZsb3dTZXF1ZW5jZShzdGF0ZSwgbGV2ZWwsIG9iamVjdCkge1xuICB2YXIgX3Jlc3VsdCA9ICcnLFxuICAgICAgX3RhZyAgICA9IHN0YXRlLnRhZyxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoLFxuICAgICAgdmFsdWU7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdmFsdWUgPSBvYmplY3RbaW5kZXhdO1xuXG4gICAgaWYgKHN0YXRlLnJlcGxhY2VyKSB7XG4gICAgICB2YWx1ZSA9IHN0YXRlLnJlcGxhY2VyLmNhbGwob2JqZWN0LCBTdHJpbmcoaW5kZXgpLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gV3JpdGUgb25seSB2YWxpZCBlbGVtZW50cywgcHV0IG51bGwgaW5zdGVhZCBvZiBpbnZhbGlkIGVsZW1lbnRzLlxuICAgIGlmICh3cml0ZU5vZGUoc3RhdGUsIGxldmVsLCB2YWx1ZSwgZmFsc2UsIGZhbHNlKSB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCwgbnVsbCwgZmFsc2UsIGZhbHNlKSkpIHtcblxuICAgICAgaWYgKF9yZXN1bHQgIT09ICcnKSBfcmVzdWx0ICs9ICcsJyArICghc3RhdGUuY29uZGVuc2VGbG93ID8gJyAnIDogJycpO1xuICAgICAgX3Jlc3VsdCArPSBzdGF0ZS5kdW1wO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnRhZyA9IF90YWc7XG4gIHN0YXRlLmR1bXAgPSAnWycgKyBfcmVzdWx0ICsgJ10nO1xufVxuXG5mdW5jdGlvbiB3cml0ZUJsb2NrU2VxdWVuY2Uoc3RhdGUsIGxldmVsLCBvYmplY3QsIGNvbXBhY3QpIHtcbiAgdmFyIF9yZXN1bHQgPSAnJyxcbiAgICAgIF90YWcgICAgPSBzdGF0ZS50YWcsXG4gICAgICBpbmRleCxcbiAgICAgIGxlbmd0aCxcbiAgICAgIHZhbHVlO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHZhbHVlID0gb2JqZWN0W2luZGV4XTtcblxuICAgIGlmIChzdGF0ZS5yZXBsYWNlcikge1xuICAgICAgdmFsdWUgPSBzdGF0ZS5yZXBsYWNlci5jYWxsKG9iamVjdCwgU3RyaW5nKGluZGV4KSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIFdyaXRlIG9ubHkgdmFsaWQgZWxlbWVudHMsIHB1dCBudWxsIGluc3RlYWQgb2YgaW52YWxpZCBlbGVtZW50cy5cbiAgICBpZiAod3JpdGVOb2RlKHN0YXRlLCBsZXZlbCArIDEsIHZhbHVlLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSkgfHxcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgIHdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwgKyAxLCBudWxsLCB0cnVlLCB0cnVlLCBmYWxzZSwgdHJ1ZSkpKSB7XG5cbiAgICAgIGlmICghY29tcGFjdCB8fCBfcmVzdWx0ICE9PSAnJykge1xuICAgICAgICBfcmVzdWx0ICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLmR1bXAgJiYgQ0hBUl9MSU5FX0ZFRUQgPT09IHN0YXRlLmR1bXAuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICBfcmVzdWx0ICs9ICctJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9yZXN1bHQgKz0gJy0gJztcbiAgICAgIH1cblxuICAgICAgX3Jlc3VsdCArPSBzdGF0ZS5kdW1wO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnRhZyA9IF90YWc7XG4gIHN0YXRlLmR1bXAgPSBfcmVzdWx0IHx8ICdbXSc7IC8vIEVtcHR5IHNlcXVlbmNlIGlmIG5vIHZhbGlkIHZhbHVlcy5cbn1cblxuZnVuY3Rpb24gd3JpdGVGbG93TWFwcGluZyhzdGF0ZSwgbGV2ZWwsIG9iamVjdCkge1xuICB2YXIgX3Jlc3VsdCAgICAgICA9ICcnLFxuICAgICAgX3RhZyAgICAgICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIG9iamVjdEtleUxpc3QgPSBPYmplY3Qua2V5cyhvYmplY3QpLFxuICAgICAgaW5kZXgsXG4gICAgICBsZW5ndGgsXG4gICAgICBvYmplY3RLZXksXG4gICAgICBvYmplY3RWYWx1ZSxcbiAgICAgIHBhaXJCdWZmZXI7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdEtleUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuXG4gICAgcGFpckJ1ZmZlciA9ICcnO1xuICAgIGlmIChfcmVzdWx0ICE9PSAnJykgcGFpckJ1ZmZlciArPSAnLCAnO1xuXG4gICAgaWYgKHN0YXRlLmNvbmRlbnNlRmxvdykgcGFpckJ1ZmZlciArPSAnXCInO1xuXG4gICAgb2JqZWN0S2V5ID0gb2JqZWN0S2V5TGlzdFtpbmRleF07XG4gICAgb2JqZWN0VmFsdWUgPSBvYmplY3Rbb2JqZWN0S2V5XTtcblxuICAgIGlmIChzdGF0ZS5yZXBsYWNlcikge1xuICAgICAgb2JqZWN0VmFsdWUgPSBzdGF0ZS5yZXBsYWNlci5jYWxsKG9iamVjdCwgb2JqZWN0S2V5LCBvYmplY3RWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF3cml0ZU5vZGUoc3RhdGUsIGxldmVsLCBvYmplY3RLZXksIGZhbHNlLCBmYWxzZSkpIHtcbiAgICAgIGNvbnRpbnVlOyAvLyBTa2lwIHRoaXMgcGFpciBiZWNhdXNlIG9mIGludmFsaWQga2V5O1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5kdW1wLmxlbmd0aCA+IDEwMjQpIHBhaXJCdWZmZXIgKz0gJz8gJztcblxuICAgIHBhaXJCdWZmZXIgKz0gc3RhdGUuZHVtcCArIChzdGF0ZS5jb25kZW5zZUZsb3cgPyAnXCInIDogJycpICsgJzonICsgKHN0YXRlLmNvbmRlbnNlRmxvdyA/ICcnIDogJyAnKTtcblxuICAgIGlmICghd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCwgb2JqZWN0VmFsdWUsIGZhbHNlLCBmYWxzZSkpIHtcbiAgICAgIGNvbnRpbnVlOyAvLyBTa2lwIHRoaXMgcGFpciBiZWNhdXNlIG9mIGludmFsaWQgdmFsdWUuXG4gICAgfVxuXG4gICAgcGFpckJ1ZmZlciArPSBzdGF0ZS5kdW1wO1xuXG4gICAgLy8gQm90aCBrZXkgYW5kIHZhbHVlIGFyZSB2YWxpZC5cbiAgICBfcmVzdWx0ICs9IHBhaXJCdWZmZXI7XG4gIH1cblxuICBzdGF0ZS50YWcgPSBfdGFnO1xuICBzdGF0ZS5kdW1wID0gJ3snICsgX3Jlc3VsdCArICd9Jztcbn1cblxuZnVuY3Rpb24gd3JpdGVCbG9ja01hcHBpbmcoc3RhdGUsIGxldmVsLCBvYmplY3QsIGNvbXBhY3QpIHtcbiAgdmFyIF9yZXN1bHQgICAgICAgPSAnJyxcbiAgICAgIF90YWcgICAgICAgICAgPSBzdGF0ZS50YWcsXG4gICAgICBvYmplY3RLZXlMaXN0ID0gT2JqZWN0LmtleXMob2JqZWN0KSxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoLFxuICAgICAgb2JqZWN0S2V5LFxuICAgICAgb2JqZWN0VmFsdWUsXG4gICAgICBleHBsaWNpdFBhaXIsXG4gICAgICBwYWlyQnVmZmVyO1xuXG4gIC8vIEFsbG93IHNvcnRpbmcga2V5cyBzbyB0aGF0IHRoZSBvdXRwdXQgZmlsZSBpcyBkZXRlcm1pbmlzdGljXG4gIGlmIChzdGF0ZS5zb3J0S2V5cyA9PT0gdHJ1ZSkge1xuICAgIC8vIERlZmF1bHQgc29ydGluZ1xuICAgIG9iamVjdEtleUxpc3Quc29ydCgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdGF0ZS5zb3J0S2V5cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIEN1c3RvbSBzb3J0IGZ1bmN0aW9uXG4gICAgb2JqZWN0S2V5TGlzdC5zb3J0KHN0YXRlLnNvcnRLZXlzKTtcbiAgfSBlbHNlIGlmIChzdGF0ZS5zb3J0S2V5cykge1xuICAgIC8vIFNvbWV0aGluZyBpcyB3cm9uZ1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdzb3J0S2V5cyBtdXN0IGJlIGEgYm9vbGVhbiBvciBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0S2V5TGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpckJ1ZmZlciA9ICcnO1xuXG4gICAgaWYgKCFjb21wYWN0IHx8IF9yZXN1bHQgIT09ICcnKSB7XG4gICAgICBwYWlyQnVmZmVyICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICB9XG5cbiAgICBvYmplY3RLZXkgPSBvYmplY3RLZXlMaXN0W2luZGV4XTtcbiAgICBvYmplY3RWYWx1ZSA9IG9iamVjdFtvYmplY3RLZXldO1xuXG4gICAgaWYgKHN0YXRlLnJlcGxhY2VyKSB7XG4gICAgICBvYmplY3RWYWx1ZSA9IHN0YXRlLnJlcGxhY2VyLmNhbGwob2JqZWN0LCBvYmplY3RLZXksIG9iamVjdFZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoIXdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwgKyAxLCBvYmplY3RLZXksIHRydWUsIHRydWUsIHRydWUpKSB7XG4gICAgICBjb250aW51ZTsgLy8gU2tpcCB0aGlzIHBhaXIgYmVjYXVzZSBvZiBpbnZhbGlkIGtleS5cbiAgICB9XG5cbiAgICBleHBsaWNpdFBhaXIgPSAoc3RhdGUudGFnICE9PSBudWxsICYmIHN0YXRlLnRhZyAhPT0gJz8nKSB8fFxuICAgICAgICAgICAgICAgICAgIChzdGF0ZS5kdW1wICYmIHN0YXRlLmR1bXAubGVuZ3RoID4gMTAyNCk7XG5cbiAgICBpZiAoZXhwbGljaXRQYWlyKSB7XG4gICAgICBpZiAoc3RhdGUuZHVtcCAmJiBDSEFSX0xJTkVfRkVFRCA9PT0gc3RhdGUuZHVtcC5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgIHBhaXJCdWZmZXIgKz0gJz8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFpckJ1ZmZlciArPSAnPyAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhaXJCdWZmZXIgKz0gc3RhdGUuZHVtcDtcblxuICAgIGlmIChleHBsaWNpdFBhaXIpIHtcbiAgICAgIHBhaXJCdWZmZXIgKz0gZ2VuZXJhdGVOZXh0TGluZShzdGF0ZSwgbGV2ZWwpO1xuICAgIH1cblxuICAgIGlmICghd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCArIDEsIG9iamVjdFZhbHVlLCB0cnVlLCBleHBsaWNpdFBhaXIpKSB7XG4gICAgICBjb250aW51ZTsgLy8gU2tpcCB0aGlzIHBhaXIgYmVjYXVzZSBvZiBpbnZhbGlkIHZhbHVlLlxuICAgIH1cblxuICAgIGlmIChzdGF0ZS5kdW1wICYmIENIQVJfTElORV9GRUVEID09PSBzdGF0ZS5kdW1wLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgIHBhaXJCdWZmZXIgKz0gJzonO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWlyQnVmZmVyICs9ICc6ICc7XG4gICAgfVxuXG4gICAgcGFpckJ1ZmZlciArPSBzdGF0ZS5kdW1wO1xuXG4gICAgLy8gQm90aCBrZXkgYW5kIHZhbHVlIGFyZSB2YWxpZC5cbiAgICBfcmVzdWx0ICs9IHBhaXJCdWZmZXI7XG4gIH1cblxuICBzdGF0ZS50YWcgPSBfdGFnO1xuICBzdGF0ZS5kdW1wID0gX3Jlc3VsdCB8fCAne30nOyAvLyBFbXB0eSBtYXBwaW5nIGlmIG5vIHZhbGlkIHBhaXJzLlxufVxuXG5mdW5jdGlvbiBkZXRlY3RUeXBlKHN0YXRlLCBvYmplY3QsIGV4cGxpY2l0KSB7XG4gIHZhciBfcmVzdWx0LCB0eXBlTGlzdCwgaW5kZXgsIGxlbmd0aCwgdHlwZSwgc3R5bGU7XG5cbiAgdHlwZUxpc3QgPSBleHBsaWNpdCA/IHN0YXRlLmV4cGxpY2l0VHlwZXMgOiBzdGF0ZS5pbXBsaWNpdFR5cGVzO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSB0eXBlTGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgdHlwZSA9IHR5cGVMaXN0W2luZGV4XTtcblxuICAgIGlmICgodHlwZS5pbnN0YW5jZU9mICB8fCB0eXBlLnByZWRpY2F0ZSkgJiZcbiAgICAgICAgKCF0eXBlLmluc3RhbmNlT2YgfHwgKCh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JykgJiYgKG9iamVjdCBpbnN0YW5jZW9mIHR5cGUuaW5zdGFuY2VPZikpKSAmJlxuICAgICAgICAoIXR5cGUucHJlZGljYXRlICB8fCB0eXBlLnByZWRpY2F0ZShvYmplY3QpKSkge1xuXG4gICAgICBpZiAoZXhwbGljaXQpIHtcbiAgICAgICAgaWYgKHR5cGUubXVsdGkgJiYgdHlwZS5yZXByZXNlbnROYW1lKSB7XG4gICAgICAgICAgc3RhdGUudGFnID0gdHlwZS5yZXByZXNlbnROYW1lKG9iamVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdGUudGFnID0gdHlwZS50YWc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnRhZyA9ICc/JztcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUucmVwcmVzZW50KSB7XG4gICAgICAgIHN0eWxlID0gc3RhdGUuc3R5bGVNYXBbdHlwZS50YWddIHx8IHR5cGUuZGVmYXVsdFN0eWxlO1xuXG4gICAgICAgIGlmIChfdG9TdHJpbmcuY2FsbCh0eXBlLnJlcHJlc2VudCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcbiAgICAgICAgICBfcmVzdWx0ID0gdHlwZS5yZXByZXNlbnQob2JqZWN0LCBzdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodHlwZS5yZXByZXNlbnQsIHN0eWxlKSkge1xuICAgICAgICAgIF9yZXN1bHQgPSB0eXBlLnJlcHJlc2VudFtzdHlsZV0ob2JqZWN0LCBzdHlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJyE8JyArIHR5cGUudGFnICsgJz4gdGFnIHJlc29sdmVyIGFjY2VwdHMgbm90IFwiJyArIHN0eWxlICsgJ1wiIHN0eWxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5kdW1wID0gX3Jlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBTZXJpYWxpemVzIGBvYmplY3RgIGFuZCB3cml0ZXMgaXQgdG8gZ2xvYmFsIGByZXN1bHRgLlxuLy8gUmV0dXJucyB0cnVlIG9uIHN1Y2Nlc3MsIG9yIGZhbHNlIG9uIGludmFsaWQgb2JqZWN0LlxuLy9cbmZ1bmN0aW9uIHdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwsIG9iamVjdCwgYmxvY2ssIGNvbXBhY3QsIGlza2V5LCBpc2Jsb2Nrc2VxKSB7XG4gIHN0YXRlLnRhZyA9IG51bGw7XG4gIHN0YXRlLmR1bXAgPSBvYmplY3Q7XG5cbiAgaWYgKCFkZXRlY3RUeXBlKHN0YXRlLCBvYmplY3QsIGZhbHNlKSkge1xuICAgIGRldGVjdFR5cGUoc3RhdGUsIG9iamVjdCwgdHJ1ZSk7XG4gIH1cblxuICB2YXIgdHlwZSA9IF90b1N0cmluZy5jYWxsKHN0YXRlLmR1bXApO1xuICB2YXIgaW5ibG9jayA9IGJsb2NrO1xuICB2YXIgdGFnU3RyO1xuXG4gIGlmIChibG9jaykge1xuICAgIGJsb2NrID0gKHN0YXRlLmZsb3dMZXZlbCA8IDAgfHwgc3RhdGUuZmxvd0xldmVsID4gbGV2ZWwpO1xuICB9XG5cbiAgdmFyIG9iamVjdE9yQXJyYXkgPSB0eXBlID09PSAnW29iamVjdCBPYmplY3RdJyB8fCB0eXBlID09PSAnW29iamVjdCBBcnJheV0nLFxuICAgICAgZHVwbGljYXRlSW5kZXgsXG4gICAgICBkdXBsaWNhdGU7XG5cbiAgaWYgKG9iamVjdE9yQXJyYXkpIHtcbiAgICBkdXBsaWNhdGVJbmRleCA9IHN0YXRlLmR1cGxpY2F0ZXMuaW5kZXhPZihvYmplY3QpO1xuICAgIGR1cGxpY2F0ZSA9IGR1cGxpY2F0ZUluZGV4ICE9PSAtMTtcbiAgfVxuXG4gIGlmICgoc3RhdGUudGFnICE9PSBudWxsICYmIHN0YXRlLnRhZyAhPT0gJz8nKSB8fCBkdXBsaWNhdGUgfHwgKHN0YXRlLmluZGVudCAhPT0gMiAmJiBsZXZlbCA+IDApKSB7XG4gICAgY29tcGFjdCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGR1cGxpY2F0ZSAmJiBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0pIHtcbiAgICBzdGF0ZS5kdW1wID0gJypyZWZfJyArIGR1cGxpY2F0ZUluZGV4O1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RPckFycmF5ICYmIGR1cGxpY2F0ZSAmJiAhc3RhdGUudXNlZER1cGxpY2F0ZXNbZHVwbGljYXRlSW5kZXhdKSB7XG4gICAgICBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIGlmIChibG9jayAmJiAoT2JqZWN0LmtleXMoc3RhdGUuZHVtcCkubGVuZ3RoICE9PSAwKSkge1xuICAgICAgICB3cml0ZUJsb2NrTWFwcGluZyhzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXAsIGNvbXBhY3QpO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyaXRlRmxvd01hcHBpbmcoc3RhdGUsIGxldmVsLCBzdGF0ZS5kdW1wKTtcbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyAnICcgKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICBpZiAoYmxvY2sgJiYgKHN0YXRlLmR1bXAubGVuZ3RoICE9PSAwKSkge1xuICAgICAgICBpZiAoc3RhdGUubm9BcnJheUluZGVudCAmJiAhaXNibG9ja3NlcSAmJiBsZXZlbCA+IDApIHtcbiAgICAgICAgICB3cml0ZUJsb2NrU2VxdWVuY2Uoc3RhdGUsIGxldmVsIC0gMSwgc3RhdGUuZHVtcCwgY29tcGFjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JpdGVCbG9ja1NlcXVlbmNlKHN0YXRlLCBsZXZlbCwgc3RhdGUuZHVtcCwgY29tcGFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cml0ZUZsb3dTZXF1ZW5jZShzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXApO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArICcgJyArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdbb2JqZWN0IFN0cmluZ10nKSB7XG4gICAgICBpZiAoc3RhdGUudGFnICE9PSAnPycpIHtcbiAgICAgICAgd3JpdGVTY2FsYXIoc3RhdGUsIHN0YXRlLmR1bXAsIGxldmVsLCBpc2tleSwgaW5ibG9jayk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnW29iamVjdCBVbmRlZmluZWRdJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUuc2tpcEludmFsaWQpIHJldHVybiBmYWxzZTtcbiAgICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCd1bmFjY2VwdGFibGUga2luZCBvZiBhbiBvYmplY3QgdG8gZHVtcCAnICsgdHlwZSk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnRhZyAhPT0gbnVsbCAmJiBzdGF0ZS50YWcgIT09ICc/Jykge1xuICAgICAgLy8gTmVlZCB0byBlbmNvZGUgYWxsIGNoYXJhY3RlcnMgZXhjZXB0IHRob3NlIGFsbG93ZWQgYnkgdGhlIHNwZWM6XG4gICAgICAvL1xuICAgICAgLy8gWzM1XSBucy1kZWMtZGlnaXQgICAgOjo9ICBbI3gzMC0jeDM5XSAvKiAwLTkgKi9cbiAgICAgIC8vIFszNl0gbnMtaGV4LWRpZ2l0ICAgIDo6PSAgbnMtZGVjLWRpZ2l0XG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB8IFsjeDQxLSN4NDZdIC8qIEEtRiAqLyB8IFsjeDYxLSN4NjZdIC8qIGEtZiAqL1xuICAgICAgLy8gWzM3XSBucy1hc2NpaS1sZXR0ZXIgOjo9ICBbI3g0MS0jeDVBXSAvKiBBLVogKi8gfCBbI3g2MS0jeDdBXSAvKiBhLXogKi9cbiAgICAgIC8vIFszOF0gbnMtd29yZC1jaGFyICAgIDo6PSAgbnMtZGVjLWRpZ2l0IHwgbnMtYXNjaWktbGV0dGVyIHwg4oCcLeKAnVxuICAgICAgLy8gWzM5XSBucy11cmktY2hhciAgICAgOjo9ICDigJwl4oCdIG5zLWhleC1kaWdpdCBucy1oZXgtZGlnaXQgfCBucy13b3JkLWNoYXIgfCDigJwj4oCdXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB8IOKAnDvigJ0gfCDigJwv4oCdIHwg4oCcP+KAnSB8IOKAnDrigJ0gfCDigJxA4oCdIHwg4oCcJuKAnSB8IOKAnD3igJ0gfCDigJwr4oCdIHwg4oCcJOKAnSB8IOKAnCzigJ1cbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHwg4oCcX+KAnSB8IOKAnC7igJ0gfCDigJwh4oCdIHwg4oCcfuKAnSB8IOKAnCrigJ0gfCDigJwn4oCdIHwg4oCcKOKAnSB8IOKAnCnigJ0gfCDigJxb4oCdIHwg4oCcXeKAnVxuICAgICAgLy9cbiAgICAgIC8vIEFsc28gbmVlZCB0byBlbmNvZGUgJyEnIGJlY2F1c2UgaXQgaGFzIHNwZWNpYWwgbWVhbmluZyAoZW5kIG9mIHRhZyBwcmVmaXgpLlxuICAgICAgLy9cbiAgICAgIHRhZ1N0ciA9IGVuY29kZVVSSShcbiAgICAgICAgc3RhdGUudGFnWzBdID09PSAnIScgPyBzdGF0ZS50YWcuc2xpY2UoMSkgOiBzdGF0ZS50YWdcbiAgICAgICkucmVwbGFjZSgvIS9nLCAnJTIxJyk7XG5cbiAgICAgIGlmIChzdGF0ZS50YWdbMF0gPT09ICchJykge1xuICAgICAgICB0YWdTdHIgPSAnIScgKyB0YWdTdHI7XG4gICAgICB9IGVsc2UgaWYgKHRhZ1N0ci5zbGljZSgwLCAxOCkgPT09ICd0YWc6eWFtbC5vcmcsMjAwMjonKSB7XG4gICAgICAgIHRhZ1N0ciA9ICchIScgKyB0YWdTdHIuc2xpY2UoMTgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFnU3RyID0gJyE8JyArIHRhZ1N0ciArICc+JztcbiAgICAgIH1cblxuICAgICAgc3RhdGUuZHVtcCA9IHRhZ1N0ciArICcgJyArIHN0YXRlLmR1bXA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGdldER1cGxpY2F0ZVJlZmVyZW5jZXMob2JqZWN0LCBzdGF0ZSkge1xuICB2YXIgb2JqZWN0cyA9IFtdLFxuICAgICAgZHVwbGljYXRlc0luZGV4ZXMgPSBbXSxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoO1xuXG4gIGluc3BlY3ROb2RlKG9iamVjdCwgb2JqZWN0cywgZHVwbGljYXRlc0luZGV4ZXMpO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBkdXBsaWNhdGVzSW5kZXhlcy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgc3RhdGUuZHVwbGljYXRlcy5wdXNoKG9iamVjdHNbZHVwbGljYXRlc0luZGV4ZXNbaW5kZXhdXSk7XG4gIH1cbiAgc3RhdGUudXNlZER1cGxpY2F0ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gaW5zcGVjdE5vZGUob2JqZWN0LCBvYmplY3RzLCBkdXBsaWNhdGVzSW5kZXhlcykge1xuICB2YXIgb2JqZWN0S2V5TGlzdCxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoO1xuXG4gIGlmIChvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICBpbmRleCA9IG9iamVjdHMuaW5kZXhPZihvYmplY3QpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChkdXBsaWNhdGVzSW5kZXhlcy5pbmRleE9mKGluZGV4KSA9PT0gLTEpIHtcbiAgICAgICAgZHVwbGljYXRlc0luZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdHMucHVzaChvYmplY3QpO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgICAgICAgIGluc3BlY3ROb2RlKG9iamVjdFtpbmRleF0sIG9iamVjdHMsIGR1cGxpY2F0ZXNJbmRleGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0S2V5TGlzdCA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdEtleUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgICAgICAgIGluc3BlY3ROb2RlKG9iamVjdFtvYmplY3RLZXlMaXN0W2luZGV4XV0sIG9iamVjdHMsIGR1cGxpY2F0ZXNJbmRleGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkdW1wKGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZShvcHRpb25zKTtcblxuICBpZiAoIXN0YXRlLm5vUmVmcykgZ2V0RHVwbGljYXRlUmVmZXJlbmNlcyhpbnB1dCwgc3RhdGUpO1xuXG4gIHZhciB2YWx1ZSA9IGlucHV0O1xuXG4gIGlmIChzdGF0ZS5yZXBsYWNlcikge1xuICAgIHZhbHVlID0gc3RhdGUucmVwbGFjZXIuY2FsbCh7ICcnOiB2YWx1ZSB9LCAnJywgdmFsdWUpO1xuICB9XG5cbiAgaWYgKHdyaXRlTm9kZShzdGF0ZSwgMCwgdmFsdWUsIHRydWUsIHRydWUpKSByZXR1cm4gc3RhdGUuZHVtcCArICdcXG4nO1xuXG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMuZHVtcCA9IGR1bXA7XG4iLCIvLyBKUy1ZQU1MJ3MgZGVmYXVsdCBzY2hlbWEgZm9yIGBzYWZlTG9hZGAgZnVuY3Rpb24uXG4vLyBJdCBpcyBub3QgZGVzY3JpYmVkIGluIHRoZSBZQU1MIHNwZWNpZmljYXRpb24uXG4vL1xuLy8gVGhpcyBzY2hlbWEgaXMgYmFzZWQgb24gc3RhbmRhcmQgWUFNTCdzIENvcmUgc2NoZW1hIGFuZCBpbmNsdWRlcyBtb3N0IG9mXG4vLyBleHRyYSB0eXBlcyBkZXNjcmliZWQgYXQgWUFNTCB0YWcgcmVwb3NpdG9yeS4gKGh0dHA6Ly95YW1sLm9yZy90eXBlLylcblxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvcmUnKS5leHRlbmQoe1xuICBpbXBsaWNpdDogW1xuICAgIHJlcXVpcmUoJy4uL3R5cGUvdGltZXN0YW1wJyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9tZXJnZScpXG4gIF0sXG4gIGV4cGxpY2l0OiBbXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9iaW5hcnknKSxcbiAgICByZXF1aXJlKCcuLi90eXBlL29tYXAnKSxcbiAgICByZXF1aXJlKCcuLi90eXBlL3BhaXJzJyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9zZXQnKVxuICBdXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbnZhciBZQU1MX0RBVEVfUkVHRVhQID0gbmV3IFJlZ0V4cChcbiAgJ14oWzAtOV1bMC05XVswLTldWzAtOV0pJyAgICAgICAgICArIC8vIFsxXSB5ZWFyXG4gICctKFswLTldWzAtOV0pJyAgICAgICAgICAgICAgICAgICAgKyAvLyBbMl0gbW9udGhcbiAgJy0oWzAtOV1bMC05XSkkJyk7ICAgICAgICAgICAgICAgICAgIC8vIFszXSBkYXlcblxudmFyIFlBTUxfVElNRVNUQU1QX1JFR0VYUCA9IG5ldyBSZWdFeHAoXG4gICdeKFswLTldWzAtOV1bMC05XVswLTldKScgICAgICAgICAgKyAvLyBbMV0geWVhclxuICAnLShbMC05XVswLTldPyknICAgICAgICAgICAgICAgICAgICsgLy8gWzJdIG1vbnRoXG4gICctKFswLTldWzAtOV0/KScgICAgICAgICAgICAgICAgICAgKyAvLyBbM10gZGF5XG4gICcoPzpbVHRdfFsgXFxcXHRdKyknICAgICAgICAgICAgICAgICArIC8vIC4uLlxuICAnKFswLTldWzAtOV0/KScgICAgICAgICAgICAgICAgICAgICsgLy8gWzRdIGhvdXJcbiAgJzooWzAtOV1bMC05XSknICAgICAgICAgICAgICAgICAgICArIC8vIFs1XSBtaW51dGVcbiAgJzooWzAtOV1bMC05XSknICAgICAgICAgICAgICAgICAgICArIC8vIFs2XSBzZWNvbmRcbiAgJyg/OlxcXFwuKFswLTldKikpPycgICAgICAgICAgICAgICAgICsgLy8gWzddIGZyYWN0aW9uXG4gICcoPzpbIFxcXFx0XSooWnwoWy0rXSkoWzAtOV1bMC05XT8pJyArIC8vIFs4XSB0eiBbOV0gdHpfc2lnbiBbMTBdIHR6X2hvdXJcbiAgJyg/OjooWzAtOV1bMC05XSkpPykpPyQnKTsgICAgICAgICAgIC8vIFsxMV0gdHpfbWludXRlXG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sVGltZXN0YW1wKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgaWYgKFlBTUxfREFURV9SRUdFWFAuZXhlYyhkYXRhKSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gIGlmIChZQU1MX1RJTUVTVEFNUF9SRUdFWFAuZXhlYyhkYXRhKSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbFRpbWVzdGFtcChkYXRhKSB7XG4gIHZhciBtYXRjaCwgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIGZyYWN0aW9uID0gMCxcbiAgICAgIGRlbHRhID0gbnVsbCwgdHpfaG91ciwgdHpfbWludXRlLCBkYXRlO1xuXG4gIG1hdGNoID0gWUFNTF9EQVRFX1JFR0VYUC5leGVjKGRhdGEpO1xuICBpZiAobWF0Y2ggPT09IG51bGwpIG1hdGNoID0gWUFNTF9USU1FU1RBTVBfUkVHRVhQLmV4ZWMoZGF0YSk7XG5cbiAgaWYgKG1hdGNoID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGUgcmVzb2x2ZSBlcnJvcicpO1xuXG4gIC8vIG1hdGNoOiBbMV0geWVhciBbMl0gbW9udGggWzNdIGRheVxuXG4gIHllYXIgPSArKG1hdGNoWzFdKTtcbiAgbW9udGggPSArKG1hdGNoWzJdKSAtIDE7IC8vIEpTIG1vbnRoIHN0YXJ0cyB3aXRoIDBcbiAgZGF5ID0gKyhtYXRjaFszXSk7XG5cbiAgaWYgKCFtYXRjaFs0XSkgeyAvLyBubyBob3VyXG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXkpKTtcbiAgfVxuXG4gIC8vIG1hdGNoOiBbNF0gaG91ciBbNV0gbWludXRlIFs2XSBzZWNvbmQgWzddIGZyYWN0aW9uXG5cbiAgaG91ciA9ICsobWF0Y2hbNF0pO1xuICBtaW51dGUgPSArKG1hdGNoWzVdKTtcbiAgc2Vjb25kID0gKyhtYXRjaFs2XSk7XG5cbiAgaWYgKG1hdGNoWzddKSB7XG4gICAgZnJhY3Rpb24gPSBtYXRjaFs3XS5zbGljZSgwLCAzKTtcbiAgICB3aGlsZSAoZnJhY3Rpb24ubGVuZ3RoIDwgMykgeyAvLyBtaWxsaS1zZWNvbmRzXG4gICAgICBmcmFjdGlvbiArPSAnMCc7XG4gICAgfVxuICAgIGZyYWN0aW9uID0gK2ZyYWN0aW9uO1xuICB9XG5cbiAgLy8gbWF0Y2g6IFs4XSB0eiBbOV0gdHpfc2lnbiBbMTBdIHR6X2hvdXIgWzExXSB0el9taW51dGVcblxuICBpZiAobWF0Y2hbOV0pIHtcbiAgICB0el9ob3VyID0gKyhtYXRjaFsxMF0pO1xuICAgIHR6X21pbnV0ZSA9ICsobWF0Y2hbMTFdIHx8IDApO1xuICAgIGRlbHRhID0gKHR6X2hvdXIgKiA2MCArIHR6X21pbnV0ZSkgKiA2MDAwMDsgLy8gZGVsdGEgaW4gbWlsaS1zZWNvbmRzXG4gICAgaWYgKG1hdGNoWzldID09PSAnLScpIGRlbHRhID0gLWRlbHRhO1xuICB9XG5cbiAgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBmcmFjdGlvbikpO1xuXG4gIGlmIChkZWx0YSkgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpIC0gZGVsdGEpO1xuXG4gIHJldHVybiBkYXRlO1xufVxuXG5mdW5jdGlvbiByZXByZXNlbnRZYW1sVGltZXN0YW1wKG9iamVjdCAvKiwgc3R5bGUqLykge1xuICByZXR1cm4gb2JqZWN0LnRvSVNPU3RyaW5nKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOnRpbWVzdGFtcCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sVGltZXN0YW1wLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxUaW1lc3RhbXAsXG4gIGluc3RhbmNlT2Y6IERhdGUsXG4gIHJlcHJlc2VudDogcmVwcmVzZW50WWFtbFRpbWVzdGFtcFxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxTZXQoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIGtleSwgb2JqZWN0ID0gZGF0YTtcblxuICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICBpZiAob2JqZWN0W2tleV0gIT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbFNldChkYXRhKSB7XG4gIHJldHVybiBkYXRhICE9PSBudWxsID8gZGF0YSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnLCB7XG4gIGtpbmQ6ICdtYXBwaW5nJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxTZXQsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbFNldFxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG52YXIgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxQYWlycyhkYXRhKSB7XG4gIGlmIChkYXRhID09PSBudWxsKSByZXR1cm4gdHJ1ZTtcblxuICB2YXIgaW5kZXgsIGxlbmd0aCwgcGFpciwga2V5cywgcmVzdWx0LFxuICAgICAgb2JqZWN0ID0gZGF0YTtcblxuICByZXN1bHQgPSBuZXcgQXJyYXkob2JqZWN0Lmxlbmd0aCk7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpciA9IG9iamVjdFtpbmRleF07XG5cbiAgICBpZiAoX3RvU3RyaW5nLmNhbGwocGFpcikgIT09ICdbb2JqZWN0IE9iamVjdF0nKSByZXR1cm4gZmFsc2U7XG5cbiAgICBrZXlzID0gT2JqZWN0LmtleXMocGFpcik7XG5cbiAgICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHJldHVybiBmYWxzZTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sUGFpcnMoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIFtdO1xuXG4gIHZhciBpbmRleCwgbGVuZ3RoLCBwYWlyLCBrZXlzLCByZXN1bHQsXG4gICAgICBvYmplY3QgPSBkYXRhO1xuXG4gIHJlc3VsdCA9IG5ldyBBcnJheShvYmplY3QubGVuZ3RoKTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBwYWlyID0gb2JqZWN0W2luZGV4XTtcblxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhwYWlyKTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOnBhaXJzJywge1xuICBraW5kOiAnc2VxdWVuY2UnLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbFBhaXJzLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxQYWlyc1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfdG9TdHJpbmcgICAgICAgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbE9tYXAoZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIG9iamVjdEtleXMgPSBbXSwgaW5kZXgsIGxlbmd0aCwgcGFpciwgcGFpcktleSwgcGFpckhhc0tleSxcbiAgICAgIG9iamVjdCA9IGRhdGE7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpciA9IG9iamVjdFtpbmRleF07XG4gICAgcGFpckhhc0tleSA9IGZhbHNlO1xuXG4gICAgaWYgKF90b1N0cmluZy5jYWxsKHBhaXIpICE9PSAnW29iamVjdCBPYmplY3RdJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChwYWlyS2V5IGluIHBhaXIpIHtcbiAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbChwYWlyLCBwYWlyS2V5KSkge1xuICAgICAgICBpZiAoIXBhaXJIYXNLZXkpIHBhaXJIYXNLZXkgPSB0cnVlO1xuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXBhaXJIYXNLZXkpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChvYmplY3RLZXlzLmluZGV4T2YocGFpcktleSkgPT09IC0xKSBvYmplY3RLZXlzLnB1c2gocGFpcktleSk7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbE9tYXAoZGF0YSkge1xuICByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRhdGEgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6b21hcCcsIHtcbiAga2luZDogJ3NlcXVlbmNlJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxPbWFwLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxPbWFwXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sTWVyZ2UoZGF0YSkge1xuICByZXR1cm4gZGF0YSA9PT0gJzw8JyB8fCBkYXRhID09PSBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjptZXJnZScsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sTWVyZ2Vcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKmVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UqL1xuXG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5cbi8vIFsgNjQsIDY1LCA2NiBdIC0+IFsgcGFkZGluZywgQ1IsIExGIF1cbnZhciBCQVNFNjRfTUFQID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XFxuXFxyJztcblxuXG5mdW5jdGlvbiByZXNvbHZlWWFtbEJpbmFyeShkYXRhKSB7XG4gIGlmIChkYXRhID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGNvZGUsIGlkeCwgYml0bGVuID0gMCwgbWF4ID0gZGF0YS5sZW5ndGgsIG1hcCA9IEJBU0U2NF9NQVA7XG5cbiAgLy8gQ29udmVydCBvbmUgYnkgb25lLlxuICBmb3IgKGlkeCA9IDA7IGlkeCA8IG1heDsgaWR4KyspIHtcbiAgICBjb2RlID0gbWFwLmluZGV4T2YoZGF0YS5jaGFyQXQoaWR4KSk7XG5cbiAgICAvLyBTa2lwIENSL0xGXG4gICAgaWYgKGNvZGUgPiA2NCkgY29udGludWU7XG5cbiAgICAvLyBGYWlsIG9uIGlsbGVnYWwgY2hhcmFjdGVyc1xuICAgIGlmIChjb2RlIDwgMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgYml0bGVuICs9IDY7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYW55IGJpdHMgbGVmdCwgc291cmNlIHdhcyBjb3JydXB0ZWRcbiAgcmV0dXJuIChiaXRsZW4gJSA4KSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEJpbmFyeShkYXRhKSB7XG4gIHZhciBpZHgsIHRhaWxiaXRzLFxuICAgICAgaW5wdXQgPSBkYXRhLnJlcGxhY2UoL1tcXHJcXG49XS9nLCAnJyksIC8vIHJlbW92ZSBDUi9MRiAmIHBhZGRpbmcgdG8gc2ltcGxpZnkgc2NhblxuICAgICAgbWF4ID0gaW5wdXQubGVuZ3RoLFxuICAgICAgbWFwID0gQkFTRTY0X01BUCxcbiAgICAgIGJpdHMgPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgLy8gQ29sbGVjdCBieSA2KjQgYml0cyAoMyBieXRlcylcblxuICBmb3IgKGlkeCA9IDA7IGlkeCA8IG1heDsgaWR4KyspIHtcbiAgICBpZiAoKGlkeCAlIDQgPT09IDApICYmIGlkeCkge1xuICAgICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gMTYpICYgMHhGRik7XG4gICAgICByZXN1bHQucHVzaCgoYml0cyA+PiA4KSAmIDB4RkYpO1xuICAgICAgcmVzdWx0LnB1c2goYml0cyAmIDB4RkYpO1xuICAgIH1cblxuICAgIGJpdHMgPSAoYml0cyA8PCA2KSB8IG1hcC5pbmRleE9mKGlucHV0LmNoYXJBdChpZHgpKTtcbiAgfVxuXG4gIC8vIER1bXAgdGFpbFxuXG4gIHRhaWxiaXRzID0gKG1heCAlIDQpICogNjtcblxuICBpZiAodGFpbGJpdHMgPT09IDApIHtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAxNikgJiAweEZGKTtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiA4KSAmIDB4RkYpO1xuICAgIHJlc3VsdC5wdXNoKGJpdHMgJiAweEZGKTtcbiAgfSBlbHNlIGlmICh0YWlsYml0cyA9PT0gMTgpIHtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAxMCkgJiAweEZGKTtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAyKSAmIDB4RkYpO1xuICB9IGVsc2UgaWYgKHRhaWxiaXRzID09PSAxMikge1xuICAgIHJlc3VsdC5wdXNoKChiaXRzID4+IDQpICYgMHhGRik7XG4gIH1cblxuICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gcmVwcmVzZW50WWFtbEJpbmFyeShvYmplY3QgLyosIHN0eWxlKi8pIHtcbiAgdmFyIHJlc3VsdCA9ICcnLCBiaXRzID0gMCwgaWR4LCB0YWlsLFxuICAgICAgbWF4ID0gb2JqZWN0Lmxlbmd0aCxcbiAgICAgIG1hcCA9IEJBU0U2NF9NQVA7XG5cbiAgLy8gQ29udmVydCBldmVyeSB0aHJlZSBieXRlcyB0byA0IEFTQ0lJIGNoYXJhY3RlcnMuXG5cbiAgZm9yIChpZHggPSAwOyBpZHggPCBtYXg7IGlkeCsrKSB7XG4gICAgaWYgKChpZHggJSAzID09PSAwKSAmJiBpZHgpIHtcbiAgICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMTgpICYgMHgzRl07XG4gICAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDEyKSAmIDB4M0ZdO1xuICAgICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiA2KSAmIDB4M0ZdO1xuICAgICAgcmVzdWx0ICs9IG1hcFtiaXRzICYgMHgzRl07XG4gICAgfVxuXG4gICAgYml0cyA9IChiaXRzIDw8IDgpICsgb2JqZWN0W2lkeF07XG4gIH1cblxuICAvLyBEdW1wIHRhaWxcblxuICB0YWlsID0gbWF4ICUgMztcblxuICBpZiAodGFpbCA9PT0gMCkge1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMTgpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAxMikgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDYpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFtiaXRzICYgMHgzRl07XG4gIH0gZWxzZSBpZiAodGFpbCA9PT0gMikge1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMTApICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiA0KSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPDwgMikgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWzY0XTtcbiAgfSBlbHNlIGlmICh0YWlsID09PSAxKSB7XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAyKSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPDwgNCkgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWzY0XTtcbiAgICByZXN1bHQgKz0gbWFwWzY0XTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzQmluYXJ5KG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICAnW29iamVjdCBVaW50OEFycmF5XSc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOmJpbmFyeScsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sQmluYXJ5LFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxCaW5hcnksXG4gIHByZWRpY2F0ZTogaXNCaW5hcnksXG4gIHJlcHJlc2VudDogcmVwcmVzZW50WWFtbEJpbmFyeVxufSk7XG4iLCIvLyBTdGFuZGFyZCBZQU1MJ3MgQ29yZSBzY2hlbWEuXG4vLyBodHRwOi8vd3d3LnlhbWwub3JnL3NwZWMvMS4yL3NwZWMuaHRtbCNpZDI4MDQ5MjNcbi8vXG4vLyBOT1RFOiBKUy1ZQU1MIGRvZXMgbm90IHN1cHBvcnQgc2NoZW1hLXNwZWNpZmljIHRhZyByZXNvbHV0aW9uIHJlc3RyaWN0aW9ucy5cbi8vIFNvLCBDb3JlIHNjaGVtYSBoYXMgbm8gZGlzdGluY3Rpb25zIGZyb20gSlNPTiBzY2hlbWEgaXMgSlMtWUFNTC5cblxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2pzb24nKTtcbiIsIi8vIFN0YW5kYXJkIFlBTUwncyBKU09OIHNjaGVtYS5cbi8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI2lkMjgwMzIzMVxuLy9cbi8vIE5PVEU6IEpTLVlBTUwgZG9lcyBub3Qgc3VwcG9ydCBzY2hlbWEtc3BlY2lmaWMgdGFnIHJlc29sdXRpb24gcmVzdHJpY3Rpb25zLlxuLy8gU28sIHRoaXMgc2NoZW1hIGlzIG5vdCBzdWNoIHN0cmljdCBhcyBkZWZpbmVkIGluIHRoZSBZQU1MIHNwZWNpZmljYXRpb24uXG4vLyBJdCBhbGxvd3MgbnVtYmVycyBpbiBiaW5hcnkgbm90YWlvbiwgdXNlIGBOdWxsYCBhbmQgYE5VTExgIGFzIGBudWxsYCwgZXRjLlxuXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFpbHNhZmUnKS5leHRlbmQoe1xuICBpbXBsaWNpdDogW1xuICAgIHJlcXVpcmUoJy4uL3R5cGUvbnVsbCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvYm9vbCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvaW50JyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9mbG9hdCcpXG4gIF1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxOdWxsKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiB0cnVlO1xuXG4gIHZhciBtYXggPSBkYXRhLmxlbmd0aDtcblxuICByZXR1cm4gKG1heCA9PT0gMSAmJiBkYXRhID09PSAnficpIHx8XG4gICAgICAgICAobWF4ID09PSA0ICYmIChkYXRhID09PSAnbnVsbCcgfHwgZGF0YSA9PT0gJ051bGwnIHx8IGRhdGEgPT09ICdOVUxMJykpO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sTnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzTnVsbChvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCA9PT0gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6bnVsbCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sTnVsbCxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sTnVsbCxcbiAgcHJlZGljYXRlOiBpc051bGwsXG4gIHJlcHJlc2VudDoge1xuICAgIGNhbm9uaWNhbDogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ34nOyAgICB9LFxuICAgIGxvd2VyY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ251bGwnOyB9LFxuICAgIHVwcGVyY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ05VTEwnOyB9LFxuICAgIGNhbWVsY2FzZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ051bGwnOyB9LFxuICAgIGVtcHR5OiAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gJyc7ICAgICB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogJ2xvd2VyY2FzZSdcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XG52YXIgVHlwZSAgID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5mdW5jdGlvbiBpc0hleENvZGUoYykge1xuICByZXR1cm4gKCgweDMwLyogMCAqLyA8PSBjKSAmJiAoYyA8PSAweDM5LyogOSAqLykpIHx8XG4gICAgICAgICAoKDB4NDEvKiBBICovIDw9IGMpICYmIChjIDw9IDB4NDYvKiBGICovKSkgfHxcbiAgICAgICAgICgoMHg2MS8qIGEgKi8gPD0gYykgJiYgKGMgPD0gMHg2Ni8qIGYgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNPY3RDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzNy8qIDcgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNEZWNDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxJbnRlZ2VyKGRhdGEpIHtcbiAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICB2YXIgbWF4ID0gZGF0YS5sZW5ndGgsXG4gICAgICBpbmRleCA9IDAsXG4gICAgICBoYXNEaWdpdHMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmICghbWF4KSByZXR1cm4gZmFsc2U7XG5cbiAgY2ggPSBkYXRhW2luZGV4XTtcblxuICAvLyBzaWduXG4gIGlmIChjaCA9PT0gJy0nIHx8IGNoID09PSAnKycpIHtcbiAgICBjaCA9IGRhdGFbKytpbmRleF07XG4gIH1cblxuICBpZiAoY2ggPT09ICcwJykge1xuICAgIC8vIDBcbiAgICBpZiAoaW5kZXggKyAxID09PSBtYXgpIHJldHVybiB0cnVlO1xuICAgIGNoID0gZGF0YVsrK2luZGV4XTtcblxuICAgIC8vIGJhc2UgMiwgYmFzZSA4LCBiYXNlIDE2XG5cbiAgICBpZiAoY2ggPT09ICdiJykge1xuICAgICAgLy8gYmFzZSAyXG4gICAgICBpbmRleCsrO1xuXG4gICAgICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICAgICAgY2ggPSBkYXRhW2luZGV4XTtcbiAgICAgICAgaWYgKGNoID09PSAnXycpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoY2ggIT09ICcwJyAmJiBjaCAhPT0gJzEnKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzRGlnaXRzICYmIGNoICE9PSAnXyc7XG4gICAgfVxuXG5cbiAgICBpZiAoY2ggPT09ICd4Jykge1xuICAgICAgLy8gYmFzZSAxNlxuICAgICAgaW5kZXgrKztcblxuICAgICAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgICAgIGNoID0gZGF0YVtpbmRleF07XG4gICAgICAgIGlmIChjaCA9PT0gJ18nKSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFpc0hleENvZGUoZGF0YS5jaGFyQ29kZUF0KGluZGV4KSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaGFzRGlnaXRzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNEaWdpdHMgJiYgY2ggIT09ICdfJztcbiAgICB9XG5cblxuICAgIGlmIChjaCA9PT0gJ28nKSB7XG4gICAgICAvLyBiYXNlIDhcbiAgICAgIGluZGV4Kys7XG5cbiAgICAgIGZvciAoOyBpbmRleCA8IG1heDsgaW5kZXgrKykge1xuICAgICAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBpZiAoY2ggPT09ICdfJykgY29udGludWU7XG4gICAgICAgIGlmICghaXNPY3RDb2RlKGRhdGEuY2hhckNvZGVBdChpbmRleCkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzRGlnaXRzICYmIGNoICE9PSAnXyc7XG4gICAgfVxuICB9XG5cbiAgLy8gYmFzZSAxMCAoZXhjZXB0IDApXG5cbiAgLy8gdmFsdWUgc2hvdWxkIG5vdCBzdGFydCB3aXRoIGBfYDtcbiAgaWYgKGNoID09PSAnXycpIHJldHVybiBmYWxzZTtcblxuICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgIGlmIChjaCA9PT0gJ18nKSBjb250aW51ZTtcbiAgICBpZiAoIWlzRGVjQ29kZShkYXRhLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNEaWdpdHMgPSB0cnVlO1xuICB9XG5cbiAgLy8gU2hvdWxkIGhhdmUgZGlnaXRzIGFuZCBzaG91bGQgbm90IGVuZCB3aXRoIGBfYFxuICBpZiAoIWhhc0RpZ2l0cyB8fCBjaCA9PT0gJ18nKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxJbnRlZ2VyKGRhdGEpIHtcbiAgdmFyIHZhbHVlID0gZGF0YSwgc2lnbiA9IDEsIGNoO1xuXG4gIGlmICh2YWx1ZS5pbmRleE9mKCdfJykgIT09IC0xKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9fL2csICcnKTtcbiAgfVxuXG4gIGNoID0gdmFsdWVbMF07XG5cbiAgaWYgKGNoID09PSAnLScgfHwgY2ggPT09ICcrJykge1xuICAgIGlmIChjaCA9PT0gJy0nKSBzaWduID0gLTE7XG4gICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgICBjaCA9IHZhbHVlWzBdO1xuICB9XG5cbiAgaWYgKHZhbHVlID09PSAnMCcpIHJldHVybiAwO1xuXG4gIGlmIChjaCA9PT0gJzAnKSB7XG4gICAgaWYgKHZhbHVlWzFdID09PSAnYicpIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIDIpO1xuICAgIGlmICh2YWx1ZVsxXSA9PT0gJ3gnKSByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCAxNik7XG4gICAgaWYgKHZhbHVlWzFdID09PSAnbycpIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIDgpO1xuICB9XG5cbiAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWx1ZSwgMTApO1xufVxuXG5mdW5jdGlvbiBpc0ludGVnZXIob2JqZWN0KSB7XG4gIHJldHVybiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkpID09PSAnW29iamVjdCBOdW1iZXJdJyAmJlxuICAgICAgICAgKG9iamVjdCAlIDEgPT09IDAgJiYgIWNvbW1vbi5pc05lZ2F0aXZlWmVybyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6aW50Jywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxJbnRlZ2VyLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxJbnRlZ2VyLFxuICBwcmVkaWNhdGU6IGlzSW50ZWdlcixcbiAgcmVwcmVzZW50OiB7XG4gICAgYmluYXJ5OiAgICAgIGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiA+PSAwID8gJzBiJyArIG9iai50b1N0cmluZygyKSA6ICctMGInICsgb2JqLnRvU3RyaW5nKDIpLnNsaWNlKDEpOyB9LFxuICAgIG9jdGFsOiAgICAgICBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogPj0gMCA/ICcwbycgICsgb2JqLnRvU3RyaW5nKDgpIDogJy0wbycgICsgb2JqLnRvU3RyaW5nKDgpLnNsaWNlKDEpOyB9LFxuICAgIGRlY2ltYWw6ICAgICBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmoudG9TdHJpbmcoMTApOyB9LFxuICAgIC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbiAgICBoZXhhZGVjaW1hbDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqID49IDAgPyAnMHgnICsgb2JqLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpIDogICctMHgnICsgb2JqLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnNsaWNlKDEpOyB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogJ2RlY2ltYWwnLFxuICBzdHlsZUFsaWFzZXM6IHtcbiAgICBiaW5hcnk6ICAgICAgWyAyLCAgJ2JpbicgXSxcbiAgICBvY3RhbDogICAgICAgWyA4LCAgJ29jdCcgXSxcbiAgICBkZWNpbWFsOiAgICAgWyAxMCwgJ2RlYycgXSxcbiAgICBoZXhhZGVjaW1hbDogWyAxNiwgJ2hleCcgXVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xudmFyIFR5cGUgICA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxudmFyIFlBTUxfRkxPQVRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXG4gIC8vIDIuNWU0LCAyLjUgYW5kIGludGVnZXJzXG4gICdeKD86Wy0rXT8oPzpbMC05XVswLTlfXSopKD86XFxcXC5bMC05X10qKT8oPzpbZUVdWy0rXT9bMC05XSspPycgK1xuICAvLyAuMmU0LCAuMlxuICAvLyBzcGVjaWFsIGNhc2UsIHNlZW1zIG5vdCBmcm9tIHNwZWNcbiAgJ3xcXFxcLlswLTlfXSsoPzpbZUVdWy0rXT9bMC05XSspPycgK1xuICAvLyAuaW5mXG4gICd8Wy0rXT9cXFxcLig/OmluZnxJbmZ8SU5GKScgK1xuICAvLyAubmFuXG4gICd8XFxcXC4oPzpuYW58TmFOfE5BTikpJCcpO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbEZsb2F0KGRhdGEpIHtcbiAgaWYgKGRhdGEgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICBpZiAoIVlBTUxfRkxPQVRfUEFUVEVSTi50ZXN0KGRhdGEpIHx8XG4gICAgICAvLyBRdWljayBoYWNrIHRvIG5vdCBhbGxvdyBpbnRlZ2VycyBlbmQgd2l0aCBgX2BcbiAgICAgIC8vIFByb2JhYmx5IHNob3VsZCB1cGRhdGUgcmVnZXhwICYgY2hlY2sgc3BlZWRcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXSA9PT0gJ18nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxGbG9hdChkYXRhKSB7XG4gIHZhciB2YWx1ZSwgc2lnbjtcblxuICB2YWx1ZSAgPSBkYXRhLnJlcGxhY2UoL18vZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gIHNpZ24gICA9IHZhbHVlWzBdID09PSAnLScgPyAtMSA6IDE7XG5cbiAgaWYgKCcrLScuaW5kZXhPZih2YWx1ZVswXSkgPj0gMCkge1xuICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSk7XG4gIH1cblxuICBpZiAodmFsdWUgPT09ICcuaW5mJykge1xuICAgIHJldHVybiAoc2lnbiA9PT0gMSkgPyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgOiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG5cbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJy5uYW4nKSB7XG4gICAgcmV0dXJuIE5hTjtcbiAgfVxuICByZXR1cm4gc2lnbiAqIHBhcnNlRmxvYXQodmFsdWUsIDEwKTtcbn1cblxuXG52YXIgU0NJRU5USUZJQ19XSVRIT1VUX0RPVCA9IC9eWy0rXT9bMC05XStlLztcblxuZnVuY3Rpb24gcmVwcmVzZW50WWFtbEZsb2F0KG9iamVjdCwgc3R5bGUpIHtcbiAgdmFyIHJlcztcblxuICBpZiAoaXNOYU4ob2JqZWN0KSkge1xuICAgIHN3aXRjaCAoc3R5bGUpIHtcbiAgICAgIGNhc2UgJ2xvd2VyY2FzZSc6IHJldHVybiAnLm5hbic7XG4gICAgICBjYXNlICd1cHBlcmNhc2UnOiByZXR1cm4gJy5OQU4nO1xuICAgICAgY2FzZSAnY2FtZWxjYXNlJzogcmV0dXJuICcuTmFOJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZID09PSBvYmplY3QpIHtcbiAgICBzd2l0Y2ggKHN0eWxlKSB7XG4gICAgICBjYXNlICdsb3dlcmNhc2UnOiByZXR1cm4gJy5pbmYnO1xuICAgICAgY2FzZSAndXBwZXJjYXNlJzogcmV0dXJuICcuSU5GJztcbiAgICAgIGNhc2UgJ2NhbWVsY2FzZSc6IHJldHVybiAnLkluZic7XG4gICAgfVxuICB9IGVsc2UgaWYgKE51bWJlci5ORUdBVElWRV9JTkZJTklUWSA9PT0gb2JqZWN0KSB7XG4gICAgc3dpdGNoIChzdHlsZSkge1xuICAgICAgY2FzZSAnbG93ZXJjYXNlJzogcmV0dXJuICctLmluZic7XG4gICAgICBjYXNlICd1cHBlcmNhc2UnOiByZXR1cm4gJy0uSU5GJztcbiAgICAgIGNhc2UgJ2NhbWVsY2FzZSc6IHJldHVybiAnLS5JbmYnO1xuICAgIH1cbiAgfSBlbHNlIGlmIChjb21tb24uaXNOZWdhdGl2ZVplcm8ob2JqZWN0KSkge1xuICAgIHJldHVybiAnLTAuMCc7XG4gIH1cblxuICByZXMgPSBvYmplY3QudG9TdHJpbmcoMTApO1xuXG4gIC8vIEpTIHN0cmluZ2lmaWVyIGNhbiBidWlsZCBzY2llbnRpZmljIGZvcm1hdCB3aXRob3V0IGRvdHM6IDVlLTEwMCxcbiAgLy8gd2hpbGUgWUFNTCByZXF1cmVzIGRvdDogNS5lLTEwMC4gRml4IGl0IHdpdGggc2ltcGxlIGhhY2tcblxuICByZXR1cm4gU0NJRU5USUZJQ19XSVRIT1VUX0RPVC50ZXN0KHJlcykgPyByZXMucmVwbGFjZSgnZScsICcuZScpIDogcmVzO1xufVxuXG5mdW5jdGlvbiBpc0Zsb2F0KG9iamVjdCkge1xuICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBOdW1iZXJdJykgJiZcbiAgICAgICAgIChvYmplY3QgJSAxICE9PSAwIHx8IGNvbW1vbi5pc05lZ2F0aXZlWmVybyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbEZsb2F0LFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxGbG9hdCxcbiAgcHJlZGljYXRlOiBpc0Zsb2F0LFxuICByZXByZXNlbnQ6IHJlcHJlc2VudFlhbWxGbG9hdCxcbiAgZGVmYXVsdFN0eWxlOiAnbG93ZXJjYXNlJ1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbEJvb2xlYW4oZGF0YSkge1xuICBpZiAoZGF0YSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBtYXggPSBkYXRhLmxlbmd0aDtcblxuICByZXR1cm4gKG1heCA9PT0gNCAmJiAoZGF0YSA9PT0gJ3RydWUnIHx8IGRhdGEgPT09ICdUcnVlJyB8fCBkYXRhID09PSAnVFJVRScpKSB8fFxuICAgICAgICAgKG1heCA9PT0gNSAmJiAoZGF0YSA9PT0gJ2ZhbHNlJyB8fCBkYXRhID09PSAnRmFsc2UnIHx8IGRhdGEgPT09ICdGQUxTRScpKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEJvb2xlYW4oZGF0YSkge1xuICByZXR1cm4gZGF0YSA9PT0gJ3RydWUnIHx8XG4gICAgICAgICBkYXRhID09PSAnVHJ1ZScgfHxcbiAgICAgICAgIGRhdGEgPT09ICdUUlVFJztcbn1cblxuZnVuY3Rpb24gaXNCb29sZWFuKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sQm9vbGVhbixcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sQm9vbGVhbixcbiAgcHJlZGljYXRlOiBpc0Jvb2xlYW4sXG4gIHJlcHJlc2VudDoge1xuICAgIGxvd2VyY2FzZTogZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gb2JqZWN0ID8gJ3RydWUnIDogJ2ZhbHNlJzsgfSxcbiAgICB1cHBlcmNhc2U6IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuIG9iamVjdCA/ICdUUlVFJyA6ICdGQUxTRSc7IH0sXG4gICAgY2FtZWxjYXNlOiBmdW5jdGlvbiAob2JqZWN0KSB7IHJldHVybiBvYmplY3QgPyAnVHJ1ZScgOiAnRmFsc2UnOyB9XG4gIH0sXG4gIGRlZmF1bHRTdHlsZTogJ2xvd2VyY2FzZSdcbn0pO1xuIiwiLy8gU3RhbmRhcmQgWUFNTCdzIEZhaWxzYWZlIHNjaGVtYS5cbi8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI2lkMjgwMjM0NlxuXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgU2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2NoZW1hKHtcbiAgZXhwbGljaXQ6IFtcbiAgICByZXF1aXJlKCcuLi90eXBlL3N0cicpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvc2VxJyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9tYXAnKVxuICBdXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIGRhdGEgIT09IG51bGwgPyBkYXRhIDogJyc7IH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6c2VxJywge1xuICBraW5kOiAnc2VxdWVuY2UnLFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIChkYXRhKSB7IHJldHVybiBkYXRhICE9PSBudWxsID8gZGF0YSA6IFtdOyB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOm1hcCcsIHtcbiAga2luZDogJ21hcHBpbmcnLFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIChkYXRhKSB7IHJldHVybiBkYXRhICE9PSBudWxsID8gZGF0YSA6IHt9OyB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyplc2xpbnQtZGlzYWJsZSBtYXgtbGVuKi9cblxudmFyIFlBTUxFeGNlcHRpb24gPSByZXF1aXJlKCcuL2V4Y2VwdGlvbicpO1xudmFyIFR5cGUgICAgICAgICAgPSByZXF1aXJlKCcuL3R5cGUnKTtcblxuXG5mdW5jdGlvbiBjb21waWxlTGlzdChzY2hlbWEsIG5hbWUpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHNjaGVtYVtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50VHlwZSkge1xuICAgIHZhciBuZXdJbmRleCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgICByZXN1bHQuZm9yRWFjaChmdW5jdGlvbiAocHJldmlvdXNUeXBlLCBwcmV2aW91c0luZGV4KSB7XG4gICAgICBpZiAocHJldmlvdXNUeXBlLnRhZyA9PT0gY3VycmVudFR5cGUudGFnICYmXG4gICAgICAgICAgcHJldmlvdXNUeXBlLmtpbmQgPT09IGN1cnJlbnRUeXBlLmtpbmQgJiZcbiAgICAgICAgICBwcmV2aW91c1R5cGUubXVsdGkgPT09IGN1cnJlbnRUeXBlLm11bHRpKSB7XG5cbiAgICAgICAgbmV3SW5kZXggPSBwcmV2aW91c0luZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVzdWx0W25ld0luZGV4XSA9IGN1cnJlbnRUeXBlO1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGNvbXBpbGVNYXAoLyogbGlzdHMuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgc2NhbGFyOiB7fSxcbiAgICAgICAgc2VxdWVuY2U6IHt9LFxuICAgICAgICBtYXBwaW5nOiB7fSxcbiAgICAgICAgZmFsbGJhY2s6IHt9LFxuICAgICAgICBtdWx0aToge1xuICAgICAgICAgIHNjYWxhcjogW10sXG4gICAgICAgICAgc2VxdWVuY2U6IFtdLFxuICAgICAgICAgIG1hcHBpbmc6IFtdLFxuICAgICAgICAgIGZhbGxiYWNrOiBbXVxuICAgICAgICB9XG4gICAgICB9LCBpbmRleCwgbGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3RUeXBlKHR5cGUpIHtcbiAgICBpZiAodHlwZS5tdWx0aSkge1xuICAgICAgcmVzdWx0Lm11bHRpW3R5cGUua2luZF0ucHVzaCh0eXBlKTtcbiAgICAgIHJlc3VsdC5tdWx0aVsnZmFsbGJhY2snXS5wdXNoKHR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRbdHlwZS5raW5kXVt0eXBlLnRhZ10gPSByZXN1bHRbJ2ZhbGxiYWNrJ11bdHlwZS50YWddID0gdHlwZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBhcmd1bWVudHNbaW5kZXhdLmZvckVhY2goY29sbGVjdFR5cGUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gU2NoZW1hKGRlZmluaXRpb24pIHtcbiAgcmV0dXJuIHRoaXMuZXh0ZW5kKGRlZmluaXRpb24pO1xufVxuXG5cblNjaGVtYS5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKGRlZmluaXRpb24pIHtcbiAgdmFyIGltcGxpY2l0ID0gW107XG4gIHZhciBleHBsaWNpdCA9IFtdO1xuXG4gIGlmIChkZWZpbml0aW9uIGluc3RhbmNlb2YgVHlwZSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQodHlwZSlcbiAgICBleHBsaWNpdC5wdXNoKGRlZmluaXRpb24pO1xuXG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uKSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQoWyB0eXBlMSwgdHlwZTIsIC4uLiBdKVxuICAgIGV4cGxpY2l0ID0gZXhwbGljaXQuY29uY2F0KGRlZmluaXRpb24pO1xuXG4gIH0gZWxzZSBpZiAoZGVmaW5pdGlvbiAmJiAoQXJyYXkuaXNBcnJheShkZWZpbml0aW9uLmltcGxpY2l0KSB8fCBBcnJheS5pc0FycmF5KGRlZmluaXRpb24uZXhwbGljaXQpKSkge1xuICAgIC8vIFNjaGVtYS5leHRlbmQoeyBleHBsaWNpdDogWyB0eXBlMSwgdHlwZTIsIC4uLiBdLCBpbXBsaWNpdDogWyB0eXBlMSwgdHlwZTIsIC4uLiBdIH0pXG4gICAgaWYgKGRlZmluaXRpb24uaW1wbGljaXQpIGltcGxpY2l0ID0gaW1wbGljaXQuY29uY2F0KGRlZmluaXRpb24uaW1wbGljaXQpO1xuICAgIGlmIChkZWZpbml0aW9uLmV4cGxpY2l0KSBleHBsaWNpdCA9IGV4cGxpY2l0LmNvbmNhdChkZWZpbml0aW9uLmV4cGxpY2l0KTtcblxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdTY2hlbWEuZXh0ZW5kIGFyZ3VtZW50IHNob3VsZCBiZSBhIFR5cGUsIFsgVHlwZSBdLCAnICtcbiAgICAgICdvciBhIHNjaGVtYSBkZWZpbml0aW9uICh7IGltcGxpY2l0OiBbLi4uXSwgZXhwbGljaXQ6IFsuLi5dIH0pJyk7XG4gIH1cblxuICBpbXBsaWNpdC5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCEodHlwZSBpbnN0YW5jZW9mIFR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignU3BlY2lmaWVkIGxpc3Qgb2YgWUFNTCB0eXBlcyAob3IgYSBzaW5nbGUgVHlwZSBvYmplY3QpIGNvbnRhaW5zIGEgbm9uLVR5cGUgb2JqZWN0LicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlLmxvYWRLaW5kICYmIHR5cGUubG9hZEtpbmQgIT09ICdzY2FsYXInKSB7XG4gICAgICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignVGhlcmUgaXMgYSBub24tc2NhbGFyIHR5cGUgaW4gdGhlIGltcGxpY2l0IGxpc3Qgb2YgYSBzY2hlbWEuIEltcGxpY2l0IHJlc29sdmluZyBvZiBzdWNoIHR5cGVzIGlzIG5vdCBzdXBwb3J0ZWQuJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUubXVsdGkpIHtcbiAgICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdUaGVyZSBpcyBhIG11bHRpIHR5cGUgaW4gdGhlIGltcGxpY2l0IGxpc3Qgb2YgYSBzY2hlbWEuIE11bHRpIHRhZ3MgY2FuIG9ubHkgYmUgbGlzdGVkIGFzIGV4cGxpY2l0LicpO1xuICAgIH1cbiAgfSk7XG5cbiAgZXhwbGljaXQuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIGlmICghKHR5cGUgaW5zdGFuY2VvZiBUeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJ1NwZWNpZmllZCBsaXN0IG9mIFlBTUwgdHlwZXMgKG9yIGEgc2luZ2xlIFR5cGUgb2JqZWN0KSBjb250YWlucyBhIG5vbi1UeXBlIG9iamVjdC4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciByZXN1bHQgPSBPYmplY3QuY3JlYXRlKFNjaGVtYS5wcm90b3R5cGUpO1xuXG4gIHJlc3VsdC5pbXBsaWNpdCA9ICh0aGlzLmltcGxpY2l0IHx8IFtdKS5jb25jYXQoaW1wbGljaXQpO1xuICByZXN1bHQuZXhwbGljaXQgPSAodGhpcy5leHBsaWNpdCB8fCBbXSkuY29uY2F0KGV4cGxpY2l0KTtcblxuICByZXN1bHQuY29tcGlsZWRJbXBsaWNpdCA9IGNvbXBpbGVMaXN0KHJlc3VsdCwgJ2ltcGxpY2l0Jyk7XG4gIHJlc3VsdC5jb21waWxlZEV4cGxpY2l0ID0gY29tcGlsZUxpc3QocmVzdWx0LCAnZXhwbGljaXQnKTtcbiAgcmVzdWx0LmNvbXBpbGVkVHlwZU1hcCAgPSBjb21waWxlTWFwKHJlc3VsdC5jb21waWxlZEltcGxpY2l0LCByZXN1bHQuY29tcGlsZWRFeHBsaWNpdCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlbWE7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBZQU1MRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9leGNlcHRpb24nKTtcblxudmFyIFRZUEVfQ09OU1RSVUNUT1JfT1BUSU9OUyA9IFtcbiAgJ2tpbmQnLFxuICAnbXVsdGknLFxuICAncmVzb2x2ZScsXG4gICdjb25zdHJ1Y3QnLFxuICAnaW5zdGFuY2VPZicsXG4gICdwcmVkaWNhdGUnLFxuICAncmVwcmVzZW50JyxcbiAgJ3JlcHJlc2VudE5hbWUnLFxuICAnZGVmYXVsdFN0eWxlJyxcbiAgJ3N0eWxlQWxpYXNlcydcbl07XG5cbnZhciBZQU1MX05PREVfS0lORFMgPSBbXG4gICdzY2FsYXInLFxuICAnc2VxdWVuY2UnLFxuICAnbWFwcGluZydcbl07XG5cbmZ1bmN0aW9uIGNvbXBpbGVTdHlsZUFsaWFzZXMobWFwKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBpZiAobWFwICE9PSBudWxsKSB7XG4gICAgT2JqZWN0LmtleXMobWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgbWFwW3N0eWxlXS5mb3JFYWNoKGZ1bmN0aW9uIChhbGlhcykge1xuICAgICAgICByZXN1bHRbU3RyaW5nKGFsaWFzKV0gPSBzdHlsZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gVHlwZSh0YWcsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChUWVBFX0NPTlNUUlVDVE9SX09QVElPTlMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdVbmtub3duIG9wdGlvbiBcIicgKyBuYW1lICsgJ1wiIGlzIG1ldCBpbiBkZWZpbml0aW9uIG9mIFwiJyArIHRhZyArICdcIiBZQU1MIHR5cGUuJyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBUT0RPOiBBZGQgdGFnIGZvcm1hdCBjaGVjay5cbiAgdGhpcy5vcHRpb25zICAgICAgID0gb3B0aW9uczsgLy8ga2VlcCBvcmlnaW5hbCBvcHRpb25zIGluIGNhc2UgdXNlciB3YW50cyB0byBleHRlbmQgdGhpcyB0eXBlIGxhdGVyXG4gIHRoaXMudGFnICAgICAgICAgICA9IHRhZztcbiAgdGhpcy5raW5kICAgICAgICAgID0gb3B0aW9uc1sna2luZCddICAgICAgICAgIHx8IG51bGw7XG4gIHRoaXMucmVzb2x2ZSAgICAgICA9IG9wdGlvbnNbJ3Jlc29sdmUnXSAgICAgICB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9O1xuICB0aGlzLmNvbnN0cnVjdCAgICAgPSBvcHRpb25zWydjb25zdHJ1Y3QnXSAgICAgfHwgZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIGRhdGE7IH07XG4gIHRoaXMuaW5zdGFuY2VPZiAgICA9IG9wdGlvbnNbJ2luc3RhbmNlT2YnXSAgICB8fCBudWxsO1xuICB0aGlzLnByZWRpY2F0ZSAgICAgPSBvcHRpb25zWydwcmVkaWNhdGUnXSAgICAgfHwgbnVsbDtcbiAgdGhpcy5yZXByZXNlbnQgICAgID0gb3B0aW9uc1sncmVwcmVzZW50J10gICAgIHx8IG51bGw7XG4gIHRoaXMucmVwcmVzZW50TmFtZSA9IG9wdGlvbnNbJ3JlcHJlc2VudE5hbWUnXSB8fCBudWxsO1xuICB0aGlzLmRlZmF1bHRTdHlsZSAgPSBvcHRpb25zWydkZWZhdWx0U3R5bGUnXSAgfHwgbnVsbDtcbiAgdGhpcy5tdWx0aSAgICAgICAgID0gb3B0aW9uc1snbXVsdGknXSAgICAgICAgIHx8IGZhbHNlO1xuICB0aGlzLnN0eWxlQWxpYXNlcyAgPSBjb21waWxlU3R5bGVBbGlhc2VzKG9wdGlvbnNbJ3N0eWxlQWxpYXNlcyddIHx8IG51bGwpO1xuXG4gIGlmIChZQU1MX05PREVfS0lORFMuaW5kZXhPZih0aGlzLmtpbmQpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdVbmtub3duIGtpbmQgXCInICsgdGhpcy5raW5kICsgJ1wiIGlzIHNwZWNpZmllZCBmb3IgXCInICsgdGFnICsgJ1wiIFlBTUwgdHlwZS4nKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFR5cGU7XG4iLCIvLyBZQU1MIGVycm9yIGNsYXNzLiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzg0NTg5ODRcbi8vXG4ndXNlIHN0cmljdCc7XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IoZXhjZXB0aW9uLCBjb21wYWN0KSB7XG4gIHZhciB3aGVyZSA9ICcnLCBtZXNzYWdlID0gZXhjZXB0aW9uLnJlYXNvbiB8fCAnKHVua25vd24gcmVhc29uKSc7XG5cbiAgaWYgKCFleGNlcHRpb24ubWFyaykgcmV0dXJuIG1lc3NhZ2U7XG5cbiAgaWYgKGV4Y2VwdGlvbi5tYXJrLm5hbWUpIHtcbiAgICB3aGVyZSArPSAnaW4gXCInICsgZXhjZXB0aW9uLm1hcmsubmFtZSArICdcIiAnO1xuICB9XG5cbiAgd2hlcmUgKz0gJygnICsgKGV4Y2VwdGlvbi5tYXJrLmxpbmUgKyAxKSArICc6JyArIChleGNlcHRpb24ubWFyay5jb2x1bW4gKyAxKSArICcpJztcblxuICBpZiAoIWNvbXBhY3QgJiYgZXhjZXB0aW9uLm1hcmsuc25pcHBldCkge1xuICAgIHdoZXJlICs9ICdcXG5cXG4nICsgZXhjZXB0aW9uLm1hcmsuc25pcHBldDtcbiAgfVxuXG4gIHJldHVybiBtZXNzYWdlICsgJyAnICsgd2hlcmU7XG59XG5cblxuZnVuY3Rpb24gWUFNTEV4Y2VwdGlvbihyZWFzb24sIG1hcmspIHtcbiAgLy8gU3VwZXIgY29uc3RydWN0b3JcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICB0aGlzLm5hbWUgPSAnWUFNTEV4Y2VwdGlvbic7XG4gIHRoaXMucmVhc29uID0gcmVhc29uO1xuICB0aGlzLm1hcmsgPSBtYXJrO1xuICB0aGlzLm1lc3NhZ2UgPSBmb3JtYXRFcnJvcih0aGlzLCBmYWxzZSk7XG5cbiAgLy8gSW5jbHVkZSBzdGFjayB0cmFjZSBpbiBlcnJvciBvYmplY3RcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgLy8gQ2hyb21lIGFuZCBOb2RlSlNcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGRiwgSUUgMTArIGFuZCBTYWZhcmkgNisuIEZhbGxiYWNrIGZvciBvdGhlcnNcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjayB8fCAnJztcbiAgfVxufVxuXG5cbi8vIEluaGVyaXQgZnJvbSBFcnJvclxuWUFNTEV4Y2VwdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5ZQU1MRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFlBTUxFeGNlcHRpb247XG5cblxuWUFNTEV4Y2VwdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhjb21wYWN0KSB7XG4gIHJldHVybiB0aGlzLm5hbWUgKyAnOiAnICsgZm9ybWF0RXJyb3IodGhpcywgY29tcGFjdCk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gWUFNTEV4Y2VwdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG5mdW5jdGlvbiBpc05vdGhpbmcoc3ViamVjdCkge1xuICByZXR1cm4gKHR5cGVvZiBzdWJqZWN0ID09PSAndW5kZWZpbmVkJykgfHwgKHN1YmplY3QgPT09IG51bGwpO1xufVxuXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHN1YmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcpICYmIChzdWJqZWN0ICE9PSBudWxsKTtcbn1cblxuXG5mdW5jdGlvbiB0b0FycmF5KHNlcXVlbmNlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHNlcXVlbmNlKSkgcmV0dXJuIHNlcXVlbmNlO1xuICBlbHNlIGlmIChpc05vdGhpbmcoc2VxdWVuY2UpKSByZXR1cm4gW107XG5cbiAgcmV0dXJuIFsgc2VxdWVuY2UgXTtcbn1cblxuXG5mdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgdmFyIGluZGV4LCBsZW5ndGgsIGtleSwgc291cmNlS2V5cztcblxuICBpZiAoc291cmNlKSB7XG4gICAgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gc291cmNlS2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgICBrZXkgPSBzb3VyY2VLZXlzW2luZGV4XTtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuXG5mdW5jdGlvbiByZXBlYXQoc3RyaW5nLCBjb3VudCkge1xuICB2YXIgcmVzdWx0ID0gJycsIGN5Y2xlO1xuXG4gIGZvciAoY3ljbGUgPSAwOyBjeWNsZSA8IGNvdW50OyBjeWNsZSArPSAxKSB7XG4gICAgcmVzdWx0ICs9IHN0cmluZztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gaXNOZWdhdGl2ZVplcm8obnVtYmVyKSB7XG4gIHJldHVybiAobnVtYmVyID09PSAwKSAmJiAoTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZID09PSAxIC8gbnVtYmVyKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cy5pc05vdGhpbmcgICAgICA9IGlzTm90aGluZztcbm1vZHVsZS5leHBvcnRzLmlzT2JqZWN0ICAgICAgID0gaXNPYmplY3Q7XG5tb2R1bGUuZXhwb3J0cy50b0FycmF5ICAgICAgICA9IHRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0cy5yZXBlYXQgICAgICAgICA9IHJlcGVhdDtcbm1vZHVsZS5leHBvcnRzLmlzTmVnYXRpdmVaZXJvID0gaXNOZWdhdGl2ZVplcm87XG5tb2R1bGUuZXhwb3J0cy5leHRlbmQgICAgICAgICA9IGV4dGVuZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0Rm9udEVtYmVkQ1NTID0gZXhwb3J0cy50b0Jsb2IgPSBleHBvcnRzLnRvSnBlZyA9IGV4cG9ydHMudG9QbmcgPSBleHBvcnRzLnRvUGl4ZWxEYXRhID0gZXhwb3J0cy50b0NhbnZhcyA9IGV4cG9ydHMudG9TdmcgPSB2b2lkIDA7XG52YXIgY2xvbmVfbm9kZV8xID0gcmVxdWlyZShcIi4vY2xvbmUtbm9kZVwiKTtcbnZhciBlbWJlZF9pbWFnZXNfMSA9IHJlcXVpcmUoXCIuL2VtYmVkLWltYWdlc1wiKTtcbnZhciBhcHBseV9zdHlsZV8xID0gcmVxdWlyZShcIi4vYXBwbHktc3R5bGVcIik7XG52YXIgZW1iZWRfd2ViZm9udHNfMSA9IHJlcXVpcmUoXCIuL2VtYmVkLXdlYmZvbnRzXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiB0b1N2Zyhub2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgd2lkdGgsIGhlaWdodCwgY2xvbmVkTm9kZSwgZGF0YXVyaTtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2EgPSAoMCwgdXRpbF8xLmdldEltYWdlU2l6ZSkobm9kZSwgb3B0aW9ucyksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgKDAsIGNsb25lX25vZGVfMS5jbG9uZU5vZGUpKG5vZGUsIG9wdGlvbnMsIHRydWUpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUgPSAoX2Iuc2VudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgKDAsIGVtYmVkX3dlYmZvbnRzXzEuZW1iZWRXZWJGb250cykoY2xvbmVkTm9kZSwgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgZW1iZWRfaW1hZ2VzXzEuZW1iZWRJbWFnZXMpKGNsb25lZE5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGFwcGx5X3N0eWxlXzEuYXBwbHlTdHlsZSkoY2xvbmVkTm9kZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sICgwLCB1dGlsXzEubm9kZVRvRGF0YVVSTCkoY2xvbmVkTm9kZSwgd2lkdGgsIGhlaWdodCldO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgZGF0YXVyaSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGRhdGF1cmldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMudG9TdmcgPSB0b1N2ZztcbmZ1bmN0aW9uIHRvQ2FudmFzKG5vZGUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hLCB3aWR0aCwgaGVpZ2h0LCBzdmcsIGltZywgY2FudmFzLCBjb250ZXh0LCByYXRpbywgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodDtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2EgPSAoMCwgdXRpbF8xLmdldEltYWdlU2l6ZSkobm9kZSwgb3B0aW9ucyksIHdpZHRoID0gX2Eud2lkdGgsIGhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdG9Tdmcobm9kZSwgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgc3ZnID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgdXRpbF8xLmNyZWF0ZUltYWdlKShzdmcpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGltZyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBvcHRpb25zLnBpeGVsUmF0aW8gfHwgKDAsIHV0aWxfMS5nZXRQaXhlbFJhdGlvKSgpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNXaWR0aCA9IG9wdGlvbnMuY2FudmFzV2lkdGggfHwgd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0hlaWdodCA9IG9wdGlvbnMuY2FudmFzSGVpZ2h0IHx8IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGggKiByYXRpbztcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodCAqIHJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcEF1dG9TY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKDAsIHV0aWxfMS5jaGVja0NhbnZhc0RpbWVuc2lvbnMpKGNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQoY2FudmFzV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCJcIi5jb25jYXQoY2FudmFzSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG9wdGlvbnMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNhbnZhc107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy50b0NhbnZhcyA9IHRvQ2FudmFzO1xuZnVuY3Rpb24gdG9QaXhlbERhdGEobm9kZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIHdpZHRoLCBoZWlnaHQsIGNhbnZhcywgY3R4O1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfYSA9ICgwLCB1dGlsXzEuZ2V0SW1hZ2VTaXplKShub2RlLCBvcHRpb25zKSwgd2lkdGggPSBfYS53aWR0aCwgaGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0b0NhbnZhcyhub2RlLCBvcHRpb25zKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBjYW52YXMgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY3R4LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnRvUGl4ZWxEYXRhID0gdG9QaXhlbERhdGE7XG5mdW5jdGlvbiB0b1BuZyhub2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjYW52YXM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRvQ2FudmFzKG5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNhbnZhcy50b0RhdGFVUkwoKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy50b1BuZyA9IHRvUG5nO1xuZnVuY3Rpb24gdG9KcGVnKG5vZGUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhbnZhcztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdG9DYW52YXMobm9kZSwgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycsIG9wdGlvbnMucXVhbGl0eSB8fCAxKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy50b0pwZWcgPSB0b0pwZWc7XG5mdW5jdGlvbiB0b0Jsb2Iobm9kZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FudmFzLCBibG9iO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0b0NhbnZhcyhub2RlLCBvcHRpb25zKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBjYW52YXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sICgwLCB1dGlsXzEuY2FudmFzVG9CbG9iKShjYW52YXMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGJsb2IgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBibG9iXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnRvQmxvYiA9IHRvQmxvYjtcbmZ1bmN0aW9uIGdldEZvbnRFbWJlZENTUyhub2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCAoMCwgZW1iZWRfd2ViZm9udHNfMS5nZXRXZWJGb250Q1NTKShub2RlLCBvcHRpb25zKV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5nZXRGb250RW1iZWRDU1MgPSBnZXRGb250RW1iZWRDU1M7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVtYmVkV2ViRm9udHMgPSBleHBvcnRzLmdldFdlYkZvbnRDU1MgPSB2b2lkIDA7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBkYXRhdXJsXzEgPSByZXF1aXJlKFwiLi9kYXRhdXJsXCIpO1xudmFyIGVtYmVkX3Jlc291cmNlc18xID0gcmVxdWlyZShcIi4vZW1iZWQtcmVzb3VyY2VzXCIpO1xudmFyIGNzc0ZldGNoQ2FjaGUgPSB7fTtcbmZ1bmN0aW9uIGZldGNoQ1NTKHVybCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNhY2hlLCByZXMsIGNzc1RleHQ7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGNhY2hlID0gY3NzRmV0Y2hDYWNoZVt1cmxdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNhY2hlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmZXRjaCh1cmwpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgcmVzLnRleHQoKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBjc3NUZXh0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBjYWNoZSA9IHsgdXJsOiB1cmwsIGNzc1RleHQ6IGNzc1RleHQgfTtcbiAgICAgICAgICAgICAgICAgICAgY3NzRmV0Y2hDYWNoZVt1cmxdID0gY2FjaGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBjYWNoZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZW1iZWRGb250cyhkYXRhLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3NzVGV4dCwgcmVnZXhVcmwsIGZvbnRMb2NzLCBsb2FkRm9udHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIGNzc1RleHQgPSBkYXRhLmNzc1RleHQ7XG4gICAgICAgICAgICByZWdleFVybCA9IC91cmxcXChbXCInXT8oW15cIicpXSspW1wiJ10/XFwpL2c7XG4gICAgICAgICAgICBmb250TG9jcyA9IGNzc1RleHQubWF0Y2goL3VybFxcKFteKV0rXFwpL2cpIHx8IFtdO1xuICAgICAgICAgICAgbG9hZEZvbnRzID0gZm9udExvY3MubWFwKGZ1bmN0aW9uIChsb2MpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsO1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gbG9jLnJlcGxhY2UocmVnZXhVcmwsICckMScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCdodHRwczovLycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBuZXcgVVJMKHVybCwgZGF0YS51cmwpLmhyZWY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sICgwLCBkYXRhdXJsXzEuZmV0Y2hBc0RhdGFVUkwpKHVybCwgb3B0aW9ucy5mZXRjaFJlcXVlc3RJbml0LCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX2EucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc1RleHQgPSBjc3NUZXh0LnJlcGxhY2UobG9jLCBcInVybChcIi5jb25jYXQocmVzdWx0LCBcIilcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbbG9jLCByZXN1bHRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFByb21pc2UuYWxsKGxvYWRGb250cykudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiBjc3NUZXh0OyB9KV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gcGFyc2VDU1Moc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBjb21tZW50c1JlZ2V4ID0gLyhcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKS9naTtcbiAgICAvLyBzdHJpcCBvdXQgY29tbWVudHNcbiAgICB2YXIgY3NzVGV4dCA9IHNvdXJjZS5yZXBsYWNlKGNvbW1lbnRzUmVnZXgsICcnKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXJlZ2V4LWxpdGVyYWxzXG4gICAgdmFyIGtleWZyYW1lc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnKChALio/a2V5ZnJhbWVzIFtcXFxcc1xcXFxTXSo/KXsoW1xcXFxzXFxcXFNdKj99XFxcXHMqPyl9KScsICdnaScpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IGtleWZyYW1lc1JlZ2V4LmV4ZWMoY3NzVGV4dCk7XG4gICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaChtYXRjaGVzWzBdKTtcbiAgICB9XG4gICAgY3NzVGV4dCA9IGNzc1RleHQucmVwbGFjZShrZXlmcmFtZXNSZWdleCwgJycpO1xuICAgIHZhciBpbXBvcnRSZWdleCA9IC9AaW1wb3J0W1xcc1xcU10qP3VybFxcKFteKV0qXFwpW1xcc1xcU10qPzsvZ2k7XG4gICAgLy8gdG8gbWF0Y2ggY3NzICYgbWVkaWEgcXVlcmllcyB0b2dldGhlclxuICAgIHZhciBjb21iaW5lZENTU1JlZ2V4ID0gJygoXFxcXHMqPyg/OlxcXFwvXFxcXCpbXFxcXHNcXFxcU10qP1xcXFwqXFxcXC8pP1xcXFxzKj9AbWVkaWFbXFxcXHNcXFxcU10nICtcbiAgICAgICAgJyo/KXsoW1xcXFxzXFxcXFNdKj8pfVxcXFxzKj99KXwoKFtcXFxcc1xcXFxTXSo/KXsoW1xcXFxzXFxcXFNdKj8pfSknO1xuICAgIC8vIHVuaWZpZWQgcmVnZXhcbiAgICB2YXIgdW5pZmllZFJlZ2V4ID0gbmV3IFJlZ0V4cChjb21iaW5lZENTU1JlZ2V4LCAnZ2knKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBpbXBvcnRSZWdleC5leGVjKGNzc1RleHQpO1xuICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbWF0Y2hlcyA9IHVuaWZpZWRSZWdleC5leGVjKGNzc1RleHQpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGltcG9ydFJlZ2V4Lmxhc3RJbmRleCA9IHVuaWZpZWRSZWdleC5sYXN0SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1bmlmaWVkUmVnZXgubGFzdEluZGV4ID0gaW1wb3J0UmVnZXgubGFzdEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5wdXNoKG1hdGNoZXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0Q1NTUnVsZXMoc3R5bGVTaGVldHMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXQsIGRlZmVycmVkcztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0ID0gW107XG4gICAgICAgICAgICBkZWZlcnJlZHMgPSBbXTtcbiAgICAgICAgICAgIC8vIEZpcnN0IGxvb3AgaW5saW5lcyBpbXBvcnRzXG4gICAgICAgICAgICBzdHlsZVNoZWV0cy5mb3JFYWNoKGZ1bmN0aW9uIChzaGVldCkge1xuICAgICAgICAgICAgICAgIGlmICgnY3NzUnVsZXMnIGluIHNoZWV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoMCwgdXRpbF8xLnRvQXJyYXkpKHNoZWV0LmNzc1J1bGVzIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IENTU1J1bGUuSU1QT1JUX1JVTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltcG9ydEluZGV4XzEgPSBpbmRleCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBpdGVtLmhyZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IGZldGNoQ1NTKHVybClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChtZXRhZGF0YSkgeyByZXR1cm4gZW1iZWRGb250cyhtZXRhZGF0YSwgb3B0aW9ucyk7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY3NzVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ1NTKGNzc1RleHQpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGVldC5pbnNlcnRSdWxlKHJ1bGUsIHJ1bGUuc3RhcnRzV2l0aCgnQGltcG9ydCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChpbXBvcnRJbmRleF8xICs9IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbnNlcnRpbmcgcnVsZSBmcm9tIHJlbW90ZSBjc3MnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlOiBydWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyByZW1vdGUgY3NzJywgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlubGluZV8xID0gc3R5bGVTaGVldHMuZmluZChmdW5jdGlvbiAoYSkgeyByZXR1cm4gYS5ocmVmID09IG51bGw7IH0pIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoZWV0LmhyZWYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkcy5wdXNoKGZldGNoQ1NTKHNoZWV0LmhyZWYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChtZXRhZGF0YSkgeyByZXR1cm4gZW1iZWRGb250cyhtZXRhZGF0YSwgb3B0aW9ucyk7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjc3NUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUNTUyhjc3NUZXh0KS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVfMS5pbnNlcnRSdWxlKHJ1bGUsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgcmVtb3RlIHN0eWxlc2hlZXQnLCBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5saW5pbmcgcmVtb3RlIGNzcyBmaWxlJywgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFByb21pc2UuYWxsKGRlZmVycmVkcykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNlY29uZCBsb29wIHBhcnNlcyBydWxlc1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0cy5mb3JFYWNoKGZ1bmN0aW9uIChzaGVldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCdjc3NSdWxlcycgaW4gc2hlZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgdXRpbF8xLnRvQXJyYXkpKHNoZWV0LmNzc1J1bGVzIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB3aGlsZSByZWFkaW5nIENTUyBydWxlcyBmcm9tIFwiLmNvbmNhdChzaGVldC5ocmVmKSwgZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRXZWJGb250UnVsZXMoY3NzUnVsZXMpIHtcbiAgICByZXR1cm4gY3NzUnVsZXNcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAocnVsZSkgeyByZXR1cm4gcnVsZS50eXBlID09PSBDU1NSdWxlLkZPTlRfRkFDRV9SVUxFOyB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChydWxlKSB7IHJldHVybiAoMCwgZW1iZWRfcmVzb3VyY2VzXzEuc2hvdWxkRW1iZWQpKHJ1bGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnc3JjJykpOyB9KTtcbn1cbmZ1bmN0aW9uIHBhcnNlV2ViRm9udFJ1bGVzKG5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdHlsZVNoZWV0cywgY3NzUnVsZXM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm93bmVyRG9jdW1lbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlZCBlbGVtZW50IGlzIG5vdCB3aXRoaW4gYSBEb2N1bWVudCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXRzID0gKDAsIHV0aWxfMS50b0FycmF5KShub2RlLm93bmVyRG9jdW1lbnQuc3R5bGVTaGVldHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBnZXRDU1NSdWxlcyhzdHlsZVNoZWV0cywgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgY3NzUnVsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBnZXRXZWJGb250UnVsZXMoY3NzUnVsZXMpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRXZWJGb250Q1NTKG5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBydWxlcywgY3NzVGV4dHM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHBhcnNlV2ViRm9udFJ1bGVzKG5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBQcm9taXNlLmFsbChydWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZVVybCA9IHJ1bGUucGFyZW50U3R5bGVTaGVldCA/IHJ1bGUucGFyZW50U3R5bGVTaGVldC5ocmVmIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIGVtYmVkX3Jlc291cmNlc18xLmVtYmVkUmVzb3VyY2VzKShydWxlLmNzc1RleHQsIGJhc2VVcmwsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGNzc1RleHRzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY3NzVGV4dHMuam9pbignXFxuJyldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZ2V0V2ViRm9udENTUyA9IGdldFdlYkZvbnRDU1M7XG5mdW5jdGlvbiBlbWJlZFdlYkZvbnRzKGNsb25lZE5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjc3NUZXh0LCBfYSwgX2IsIHN0eWxlTm9kZSwgc3l0bGVDb250ZW50O1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShvcHRpb25zLmZvbnRFbWJlZENTUyAhPSBudWxsKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XG4gICAgICAgICAgICAgICAgICAgIF9hID0gb3B0aW9ucy5mb250RW1iZWRDU1M7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLnNraXBGb250cykgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgIF9iID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzQgLyp5aWVsZCovLCBnZXRXZWJGb250Q1NTKGNsb25lZE5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIF9iID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICBfYSA9IF9iO1xuICAgICAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICBjc3NUZXh0ID0gX2E7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3NUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3l0bGVDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZU5vZGUuYXBwZW5kQ2hpbGQoc3l0bGVDb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbG9uZWROb2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWROb2RlLmluc2VydEJlZm9yZShzdHlsZU5vZGUsIGNsb25lZE5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWROb2RlLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZW1iZWRXZWJGb250cyA9IGVtYmVkV2ViRm9udHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbWJlZC13ZWJmb250cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVtYmVkSW1hZ2VzID0gdm9pZCAwO1xudmFyIGVtYmVkX3Jlc291cmNlc18xID0gcmVxdWlyZShcIi4vZW1iZWQtcmVzb3VyY2VzXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgZGF0YXVybF8xID0gcmVxdWlyZShcIi4vZGF0YXVybFwiKTtcbnZhciBtaW1lc18xID0gcmVxdWlyZShcIi4vbWltZXNcIik7XG5mdW5jdGlvbiBlbWJlZEJhY2tncm91bmQoY2xvbmVkTm9kZSwgb3B0aW9ucykge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBiYWNrZ3JvdW5kLCBjc3NTdHJpbmc7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQgPSAoX2EgPSBjbG9uZWROb2RlLnN0eWxlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJhY2tncm91bmQpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgZW1iZWRfcmVzb3VyY2VzXzEuZW1iZWRSZXNvdXJjZXMpKGJhY2tncm91bmQsIG51bGwsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGNzc1N0cmluZyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVkTm9kZS5zdHlsZS5zZXRQcm9wZXJ0eSgnYmFja2dyb3VuZCcsIGNzc1N0cmluZywgY2xvbmVkTm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KCdiYWNrZ3JvdW5kJykpO1xuICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZW1iZWRJbWFnZU5vZGUoY2xvbmVkTm9kZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCwgZGF0YVVSTDtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoY2xvbmVkTm9kZSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQgJiYgISgwLCBkYXRhdXJsXzEuaXNEYXRhVXJsKShjbG9uZWROb2RlLnNyYykpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhKGNsb25lZE5vZGUgaW5zdGFuY2VvZiBTVkdJbWFnZUVsZW1lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhKDAsIGRhdGF1cmxfMS5pc0RhdGFVcmwpKGNsb25lZE5vZGUuaHJlZi5iYXNlVmFsKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1cmwgPSBjbG9uZWROb2RlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBjbG9uZWROb2RlLnNyY1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBjbG9uZWROb2RlLmhyZWYuYmFzZVZhbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgKDAsIGRhdGF1cmxfMS5yZXNvdXJjZVRvRGF0YVVSTCkodXJsLCAoMCwgbWltZXNfMS5nZXRNaW1lVHlwZSkodXJsKSwgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgZGF0YVVSTCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUub25sb2FkID0gcmVzb2x2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWROb2RlLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsb25lZE5vZGUgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUuc3Jjc2V0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUuc3JjID0gZGF0YVVSTDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUuaHJlZi5iYXNlVmFsID0gZGF0YVVSTDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBlbWJlZENoaWxkcmVuKGNsb25lZE5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiwgZGVmZXJyZWRzO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9ICgwLCB1dGlsXzEudG9BcnJheSkoY2xvbmVkTm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRzID0gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gZW1iZWRJbWFnZXMoY2hpbGQsIG9wdGlvbnMpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoZGVmZXJyZWRzKS50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNsb25lZE5vZGU7IH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGVtYmVkSW1hZ2VzKGNsb25lZE5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGNsb25lZE5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGVtYmVkQmFja2dyb3VuZChjbG9uZWROb2RlLCBvcHRpb25zKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGVtYmVkSW1hZ2VOb2RlKGNsb25lZE5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZW1iZWRDaGlsZHJlbihjbG9uZWROb2RlLCBvcHRpb25zKV07XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmVtYmVkSW1hZ2VzID0gZW1iZWRJbWFnZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbWJlZC1pbWFnZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lbWJlZFJlc291cmNlcyA9IGV4cG9ydHMuc2hvdWxkRW1iZWQgPSBleHBvcnRzLmVtYmVkID0gZXhwb3J0cy5wYXJzZVVSTHMgPSB2b2lkIDA7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBtaW1lc18xID0gcmVxdWlyZShcIi4vbWltZXNcIik7XG52YXIgZGF0YXVybF8xID0gcmVxdWlyZShcIi4vZGF0YXVybFwiKTtcbnZhciBVUkxfUkVHRVggPSAvdXJsXFwoKFsnXCJdPykoW14nXCJdKz8pXFwxXFwpL2c7XG52YXIgVVJMX1dJVEhfRk9STUFUX1JFR0VYID0gL3VybFxcKFteKV0rXFwpXFxzKmZvcm1hdFxcKChbXCInXT8pKFteXCInXSspXFwxXFwpL2c7XG52YXIgRk9OVF9TUkNfUkVHRVggPSAvc3JjOlxccyooPzp1cmxcXChbXildK1xcKVxccypmb3JtYXRcXChbXildK1xcKVssO11cXHMqKSsvZztcbmZ1bmN0aW9uIHRvUmVnZXgodXJsKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtZXNjYXBlXG4gICAgdmFyIGVzY2FwZWQgPSB1cmwucmVwbGFjZSgvKFsuKis/XiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXCIodXJsXFxcXChbJ1xcXCJdPykoXCIuY29uY2F0KGVzY2FwZWQsIFwiKShbJ1xcXCJdP1xcXFwpKVwiKSwgJ2cnKTtcbn1cbmZ1bmN0aW9uIHBhcnNlVVJMcyhjc3NUZXh0KSB7XG4gICAgdmFyIHVybHMgPSBbXTtcbiAgICBjc3NUZXh0LnJlcGxhY2UoVVJMX1JFR0VYLCBmdW5jdGlvbiAocmF3LCBxdW90YXRpb24sIHVybCkge1xuICAgICAgICB1cmxzLnB1c2godXJsKTtcbiAgICAgICAgcmV0dXJuIHJhdztcbiAgICB9KTtcbiAgICByZXR1cm4gdXJscy5maWx0ZXIoZnVuY3Rpb24gKHVybCkgeyByZXR1cm4gISgwLCBkYXRhdXJsXzEuaXNEYXRhVXJsKSh1cmwpOyB9KTtcbn1cbmV4cG9ydHMucGFyc2VVUkxzID0gcGFyc2VVUkxzO1xuZnVuY3Rpb24gZW1iZWQoY3NzVGV4dCwgcmVzb3VyY2VVUkwsIGJhc2VVUkwsIG9wdGlvbnMsIGdldENvbnRlbnRGcm9tVXJsKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzb2x2ZWRVUkwsIGNvbnRlbnRUeXBlLCBkYXRhVVJMLCBjb250ZW50LCBlcnJvcl8xO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFVSTCA9IGJhc2VVUkwgPyAoMCwgdXRpbF8xLnJlc29sdmVVcmwpKHJlc291cmNlVVJMLCBiYXNlVVJMKSA6IHJlc291cmNlVVJMO1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZSA9ICgwLCBtaW1lc18xLmdldE1pbWVUeXBlKShyZXNvdXJjZVVSTCk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFVUkwgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2V0Q29udGVudEZyb21VcmwpIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBnZXRDb250ZW50RnJvbVVybChyZXNvbHZlZFVSTCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVVSTCA9ICgwLCBkYXRhdXJsXzEubWFrZURhdGFVcmwpKGNvbnRlbnQsIGNvbnRlbnRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgZGF0YXVybF8xLnJlc291cmNlVG9EYXRhVVJMKShyZXNvbHZlZFVSTCwgY29udGVudFR5cGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIGRhdGFVUkwgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovLCBjc3NUZXh0LnJlcGxhY2UodG9SZWdleChyZXNvdXJjZVVSTCksIFwiJDFcIi5jb25jYXQoZGF0YVVSTCwgXCIkM1wiKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNl07XG4gICAgICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIgLypyZXR1cm4qLywgY3NzVGV4dF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5lbWJlZCA9IGVtYmVkO1xuZnVuY3Rpb24gZmlsdGVyUHJlZmVycmVkRm9udEZvcm1hdChzdHIsIF9hKSB7XG4gICAgdmFyIHByZWZlcnJlZEZvbnRGb3JtYXQgPSBfYS5wcmVmZXJyZWRGb250Rm9ybWF0O1xuICAgIHJldHVybiAhcHJlZmVycmVkRm9udEZvcm1hdFxuICAgICAgICA/IHN0clxuICAgICAgICA6IHN0ci5yZXBsYWNlKEZPTlRfU1JDX1JFR0VYLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hID0gVVJMX1dJVEhfRk9STUFUX1JFR0VYLmV4ZWMobWF0Y2gpIHx8IFtdLCBzcmMgPSBfYVswXSwgZm9ybWF0ID0gX2FbMl07XG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0ID09PSBwcmVmZXJyZWRGb250Rm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInNyYzogXCIuY29uY2F0KHNyYywgXCI7XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5mdW5jdGlvbiBzaG91bGRFbWJlZCh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnNlYXJjaChVUkxfUkVHRVgpICE9PSAtMTtcbn1cbmV4cG9ydHMuc2hvdWxkRW1iZWQgPSBzaG91bGRFbWJlZDtcbmZ1bmN0aW9uIGVtYmVkUmVzb3VyY2VzKGNzc1RleHQsIGJhc2VVcmwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmaWx0ZXJlZENTU1RleHQsIHVybHM7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIGlmICghc2hvdWxkRW1iZWQoY3NzVGV4dCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY3NzVGV4dF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWx0ZXJlZENTU1RleHQgPSBmaWx0ZXJQcmVmZXJyZWRGb250Rm9ybWF0KGNzc1RleHQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdXJscyA9IHBhcnNlVVJMcyhmaWx0ZXJlZENTU1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHVybHMucmVkdWNlKGZ1bmN0aW9uIChkZWZlcnJlZCwgdXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC50aGVuKGZ1bmN0aW9uIChjc3MpIHsgcmV0dXJuIGVtYmVkKGNzcywgdXJsLCBiYXNlVXJsLCBvcHRpb25zKTsgfSk7XG4gICAgICAgICAgICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKGZpbHRlcmVkQ1NTVGV4dCkpXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmVtYmVkUmVzb3VyY2VzID0gZW1iZWRSZXNvdXJjZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbWJlZC1yZXNvdXJjZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jbG9uZU5vZGUgPSB2b2lkIDA7XG52YXIgbWltZXNfMSA9IHJlcXVpcmUoXCIuL21pbWVzXCIpO1xudmFyIGRhdGF1cmxfMSA9IHJlcXVpcmUoXCIuL2RhdGF1cmxcIik7XG52YXIgY2xvbmVfcHNldWRvc18xID0gcmVxdWlyZShcIi4vY2xvbmUtcHNldWRvc1wiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gY2xvbmVDYW52YXNFbGVtZW50KGNhbnZhcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGFVUkw7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIGRhdGFVUkwgPSBjYW52YXMudG9EYXRhVVJMKCk7XG4gICAgICAgICAgICBpZiAoZGF0YVVSTCA9PT0gJ2RhdGE6LCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY2FudmFzLmNsb25lTm9kZShmYWxzZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sICgwLCB1dGlsXzEuY3JlYXRlSW1hZ2UpKGRhdGFVUkwpXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjbG9uZVZpZGVvRWxlbWVudCh2aWRlbywgb3B0aW9ucykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBvc3RlciwgY29udGVudFR5cGUsIGRhdGFVUkw7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHBvc3RlciA9IHZpZGVvLnBvc3RlcjtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGUgPSAoMCwgbWltZXNfMS5nZXRNaW1lVHlwZSkocG9zdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgKDAsIGRhdGF1cmxfMS5yZXNvdXJjZVRvRGF0YVVSTCkocG9zdGVyLCBjb250ZW50VHlwZSwgb3B0aW9ucyldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgZGF0YVVSTCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sICgwLCB1dGlsXzEuY3JlYXRlSW1hZ2UpKGRhdGFVUkwpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjbG9uZVNpbmdsZU5vZGUobm9kZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBjbG9uZUNhbnZhc0VsZW1lbnQobm9kZSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIG5vZGUucG9zdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNsb25lVmlkZW9FbGVtZW50KG5vZGUsIG9wdGlvbnMpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBub2RlLmNsb25lTm9kZShmYWxzZSldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbnZhciBpc1Nsb3RFbGVtZW50ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS50YWdOYW1lICE9IG51bGwgJiYgbm9kZS50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdTTE9UJztcbn07XG5mdW5jdGlvbiBjbG9uZUNoaWxkcmVuKG5hdGl2ZU5vZGUsIGNsb25lZE5vZGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW47XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gaXNTbG90RWxlbWVudChuYXRpdmVOb2RlKSAmJiBuYXRpdmVOb2RlLmFzc2lnbmVkTm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKDAsIHV0aWxfMS50b0FycmF5KShuYXRpdmVOb2RlLmFzc2lnbmVkTm9kZXMoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKDAsIHV0aWxfMS50b0FycmF5KSgoKF9hID0gbmF0aXZlTm9kZS5zaGFkb3dSb290KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuYXRpdmVOb2RlKS5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCBuYXRpdmVOb2RlIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIGNsb25lZE5vZGVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGNoaWxkcmVuLnJlZHVjZShmdW5jdGlvbiAoZGVmZXJyZWQsIGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNsb25lTm9kZShjaGlsZCwgb3B0aW9ucyk7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjbG9uZWRDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xvbmVkQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE5vZGUuYXBwZW5kQ2hpbGQoY2xvbmVkQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY2xvbmVkTm9kZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY2xvbmVDU1NTdHlsZShuYXRpdmVOb2RlLCBjbG9uZWROb2RlKSB7XG4gICAgdmFyIHRhcmdldFN0eWxlID0gY2xvbmVkTm9kZS5zdHlsZTtcbiAgICBpZiAoIXRhcmdldFN0eWxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHNvdXJjZVN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF0aXZlTm9kZSk7XG4gICAgaWYgKHNvdXJjZVN0eWxlLmNzc1RleHQpIHtcbiAgICAgICAgdGFyZ2V0U3R5bGUuY3NzVGV4dCA9IHNvdXJjZVN0eWxlLmNzc1RleHQ7XG4gICAgICAgIHRhcmdldFN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IHNvdXJjZVN0eWxlLnRyYW5zZm9ybU9yaWdpbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICgwLCB1dGlsXzEudG9BcnJheSkoc291cmNlU3R5bGUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvbnQtc2l6ZScgJiYgdmFsdWUuZW5kc1dpdGgoJ3B4JykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVkdWNlZEZvbnQgPSBNYXRoLmZsb29yKHBhcnNlRmxvYXQodmFsdWUuc3Vic3RyaW5nKDAsIHZhbHVlLmxlbmd0aCAtIDIpKSkgLSAwLjE7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiLmNvbmNhdChyZWR1Y2VkRm9udCwgXCJweFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldFN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBzb3VyY2VTdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KG5hbWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xvbmVJbnB1dFZhbHVlKG5hdGl2ZU5vZGUsIGNsb25lZE5vZGUpIHtcbiAgICBpZiAobmF0aXZlTm9kZSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgY2xvbmVkTm9kZS5pbm5lckhUTUwgPSBuYXRpdmVOb2RlLnZhbHVlO1xuICAgIH1cbiAgICBpZiAobmF0aXZlTm9kZSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgY2xvbmVkTm9kZS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgbmF0aXZlTm9kZS52YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xvbmVTZWxlY3RWYWx1ZShuYXRpdmVOb2RlLCBjbG9uZWROb2RlKSB7XG4gICAgaWYgKG5hdGl2ZU5vZGUgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB2YXIgY2xvbmVkU2VsZWN0ID0gY2xvbmVkTm9kZTtcbiAgICAgICAgdmFyIHNlbGVjdGVkT3B0aW9uID0gQXJyYXkuZnJvbShjbG9uZWRTZWxlY3QuY2hpbGRyZW4pLmZpbmQoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiBuYXRpdmVOb2RlLnZhbHVlID09PSBjaGlsZC5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7IH0pO1xuICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9uLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBkZWNvcmF0ZShuYXRpdmVOb2RlLCBjbG9uZWROb2RlKSB7XG4gICAgaWYgKGNsb25lZE5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgIGNsb25lQ1NTU3R5bGUobmF0aXZlTm9kZSwgY2xvbmVkTm9kZSk7XG4gICAgICAgICgwLCBjbG9uZV9wc2V1ZG9zXzEuY2xvbmVQc2V1ZG9FbGVtZW50cykobmF0aXZlTm9kZSwgY2xvbmVkTm9kZSk7XG4gICAgICAgIGNsb25lSW5wdXRWYWx1ZShuYXRpdmVOb2RlLCBjbG9uZWROb2RlKTtcbiAgICAgICAgY2xvbmVTZWxlY3RWYWx1ZShuYXRpdmVOb2RlLCBjbG9uZWROb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lZE5vZGU7XG59XG5mdW5jdGlvbiBjbG9uZU5vZGUobm9kZSwgb3B0aW9ucywgaXNSb290KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBpZiAoIWlzUm9vdCAmJiBvcHRpb25zLmZpbHRlciAmJiAhb3B0aW9ucy5maWx0ZXIobm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgbnVsbF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgUHJvbWlzZS5yZXNvbHZlKG5vZGUpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjbG9uZWROb2RlKSB7IHJldHVybiBjbG9uZVNpbmdsZU5vZGUoY2xvbmVkTm9kZSwgb3B0aW9ucyk7IH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjbG9uZWROb2RlKSB7IHJldHVybiBjbG9uZUNoaWxkcmVuKG5vZGUsIGNsb25lZE5vZGUsIG9wdGlvbnMpOyB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY2xvbmVkTm9kZSkgeyByZXR1cm4gZGVjb3JhdGUobm9kZSwgY2xvbmVkTm9kZSk7IH0pXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmNsb25lTm9kZSA9IGNsb25lTm9kZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsb25lLW5vZGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldE1pbWVUeXBlID0gdm9pZCAwO1xudmFyIFdPRkYgPSAnYXBwbGljYXRpb24vZm9udC13b2ZmJztcbnZhciBKUEVHID0gJ2ltYWdlL2pwZWcnO1xudmFyIG1pbWVzID0ge1xuICAgIHdvZmY6IFdPRkYsXG4gICAgd29mZjI6IFdPRkYsXG4gICAgdHRmOiAnYXBwbGljYXRpb24vZm9udC10cnVldHlwZScsXG4gICAgZW90OiAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgIHBuZzogJ2ltYWdlL3BuZycsXG4gICAganBnOiBKUEVHLFxuICAgIGpwZWc6IEpQRUcsXG4gICAgZ2lmOiAnaW1hZ2UvZ2lmJyxcbiAgICB0aWZmOiAnaW1hZ2UvdGlmZicsXG4gICAgc3ZnOiAnaW1hZ2Uvc3ZnK3htbCcsXG59O1xuZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uKHVybCkge1xuICAgIHZhciBtYXRjaCA9IC9cXC4oW14uL10qPykkL2cuZXhlYyh1cmwpO1xuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG59XG5mdW5jdGlvbiBnZXRNaW1lVHlwZSh1cmwpIHtcbiAgICB2YXIgZXh0ZW5zaW9uID0gZ2V0RXh0ZW5zaW9uKHVybCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbWltZXNbZXh0ZW5zaW9uXSB8fCAnJztcbn1cbmV4cG9ydHMuZ2V0TWltZVR5cGUgPSBnZXRNaW1lVHlwZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pbWVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVzb3VyY2VUb0RhdGFVUkwgPSBleHBvcnRzLmZldGNoQXNEYXRhVVJMID0gZXhwb3J0cy5tYWtlRGF0YVVybCA9IGV4cG9ydHMuaXNEYXRhVXJsID0gdm9pZCAwO1xuZnVuY3Rpb24gZ2V0Q29udGVudEZyb21EYXRhVXJsKGRhdGFVUkwpIHtcbiAgICByZXR1cm4gZGF0YVVSTC5zcGxpdCgvLC8pWzFdO1xufVxuZnVuY3Rpb24gaXNEYXRhVXJsKHVybCkge1xuICAgIHJldHVybiB1cmwuc2VhcmNoKC9eKGRhdGE6KS8pICE9PSAtMTtcbn1cbmV4cG9ydHMuaXNEYXRhVXJsID0gaXNEYXRhVXJsO1xuZnVuY3Rpb24gbWFrZURhdGFVcmwoY29udGVudCwgbWltZVR5cGUpIHtcbiAgICByZXR1cm4gXCJkYXRhOlwiLmNvbmNhdChtaW1lVHlwZSwgXCI7YmFzZTY0LFwiKS5jb25jYXQoY29udGVudCk7XG59XG5leHBvcnRzLm1ha2VEYXRhVXJsID0gbWFrZURhdGFVcmw7XG5mdW5jdGlvbiBmZXRjaEFzRGF0YVVSTCh1cmwsIGluaXQsIHByb2Nlc3MpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXMsIGJsb2I7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIGZldGNoKHVybCwgaW5pdCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZXNvdXJjZSBcXFwiXCIuY29uY2F0KHJlcy51cmwsIFwiXFxcIiBub3QgZm91bmRcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHJlcy5ibG9iKCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgYmxvYiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9IHJlamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9jZXNzKHsgcmVzOiByZXMsIHJlc3VsdDogcmVhZGVyLnJlc3VsdCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmZldGNoQXNEYXRhVVJMID0gZmV0Y2hBc0RhdGFVUkw7XG52YXIgY2FjaGUgPSB7fTtcbmZ1bmN0aW9uIGdldENhY2hlS2V5KHVybCwgY29udGVudFR5cGUsIGluY2x1ZGVRdWVyeVBhcmFtcykge1xuICAgIHZhciBrZXkgPSB1cmwucmVwbGFjZSgvXFw/LiovLCAnJyk7XG4gICAgaWYgKGluY2x1ZGVRdWVyeVBhcmFtcykge1xuICAgICAgICBrZXkgPSB1cmw7XG4gICAgfVxuICAgIC8vIGZvbnQgcmVzb3VyY2VcbiAgICBpZiAoL3R0ZnxvdGZ8ZW90fHdvZmYyPy9pLnRlc3Qoa2V5KSkge1xuICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvLipcXC8vLCAnJyk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50VHlwZSA/IFwiW1wiLmNvbmNhdChjb250ZW50VHlwZSwgXCJdXCIpLmNvbmNhdChrZXkpIDoga2V5O1xufVxuZnVuY3Rpb24gcmVzb3VyY2VUb0RhdGFVUkwocmVzb3VyY2VVcmwsIGNvbnRlbnRUeXBlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FjaGVLZXksIGRhdGFVUkwsIGNvbnRlbnQsIGVycm9yXzEsIG1zZztcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVLZXkgPSBnZXRDYWNoZUtleShyZXNvdXJjZVVybCwgY29udGVudFR5cGUsIG9wdGlvbnMuaW5jbHVkZVF1ZXJ5UGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlW2NhY2hlS2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgY2FjaGVbY2FjaGVLZXldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyByZWY6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0FQSS9YTUxIdHRwUmVxdWVzdC9Vc2luZ19YTUxIdHRwUmVxdWVzdCNCeXBhc3NpbmdfdGhlX2NhY2hlXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNhY2hlQnVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZVVybCArPSAoL1xcPy8udGVzdChyZXNvdXJjZVVybCkgPyAnJicgOiAnPycpICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZmV0Y2hBc0RhdGFVUkwocmVzb3VyY2VVcmwsIG9wdGlvbnMuZmV0Y2hSZXF1ZXN0SW5pdCwgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcyA9IF9hLnJlcywgcmVzdWx0ID0gX2EucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29udGVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlID0gcmVzLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENvbnRlbnRGcm9tRGF0YVVybChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVVSTCA9IG1ha2VEYXRhVXJsKGNvbnRlbnQsIGNvbnRlbnRUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBlcnJvcl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBkYXRhVVJMID0gb3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICBtc2cgPSBcIkZhaWxlZCB0byBmZXRjaCByZXNvdXJjZTogXCIuY29uY2F0KHJlc291cmNlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yXzEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyA9IHR5cGVvZiBlcnJvcl8xID09PSAnc3RyaW5nJyA/IGVycm9yXzEgOiBlcnJvcl8xLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1zZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtjYWNoZUtleV0gPSBkYXRhVVJMO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZGF0YVVSTF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5yZXNvdXJjZVRvRGF0YVVSTCA9IHJlc291cmNlVG9EYXRhVVJMO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YXVybC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2xvbmVQc2V1ZG9FbGVtZW50cyA9IHZvaWQgMDtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gZm9ybWF0Q1NTVGV4dChzdHlsZSkge1xuICAgIHZhciBjb250ZW50ID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpO1xuICAgIHJldHVybiBcIlwiLmNvbmNhdChzdHlsZS5jc3NUZXh0LCBcIiBjb250ZW50OiAnXCIpLmNvbmNhdChjb250ZW50LnJlcGxhY2UoLyd8XCIvZywgJycpLCBcIic7XCIpO1xufVxuZnVuY3Rpb24gZm9ybWF0Q1NTUHJvcGVydGllcyhzdHlsZSkge1xuICAgIHJldHVybiAoMCwgdXRpbF8xLnRvQXJyYXkpKHN0eWxlKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG4gICAgICAgIHZhciBwcmlvcml0eSA9IHN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkobmFtZSk7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdChuYW1lLCBcIjogXCIpLmNvbmNhdCh2YWx1ZSkuY29uY2F0KHByaW9yaXR5ID8gJyAhaW1wb3J0YW50JyA6ICcnLCBcIjtcIik7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJyAnKTtcbn1cbmZ1bmN0aW9uIGdldFBzZXVkb0VsZW1lbnRTdHlsZShjbGFzc05hbWUsIHBzZXVkbywgc3R5bGUpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBcIi5cIi5jb25jYXQoY2xhc3NOYW1lLCBcIjpcIikuY29uY2F0KHBzZXVkbyk7XG4gICAgdmFyIGNzc1RleHQgPSBzdHlsZS5jc3NUZXh0XG4gICAgICAgID8gZm9ybWF0Q1NTVGV4dChzdHlsZSlcbiAgICAgICAgOiBmb3JtYXRDU1NQcm9wZXJ0aWVzKHN0eWxlKTtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIi5jb25jYXQoc2VsZWN0b3IsIFwie1wiKS5jb25jYXQoY3NzVGV4dCwgXCJ9XCIpKTtcbn1cbmZ1bmN0aW9uIGNsb25lUHNldWRvRWxlbWVudChuYXRpdmVOb2RlLCBjbG9uZWROb2RlLCBwc2V1ZG8pIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXRpdmVOb2RlLCBwc2V1ZG8pO1xuICAgIHZhciBjb250ZW50ID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpO1xuICAgIGlmIChjb250ZW50ID09PSAnJyB8fCBjb250ZW50ID09PSAnbm9uZScpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY2xhc3NOYW1lID0gKDAsIHV0aWxfMS51dWlkKSgpO1xuICAgIHRyeSB7XG4gICAgICAgIGNsb25lZE5vZGUuY2xhc3NOYW1lID0gXCJcIi5jb25jYXQoY2xvbmVkTm9kZS5jbGFzc05hbWUsIFwiIFwiKS5jb25jYXQoY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChnZXRQc2V1ZG9FbGVtZW50U3R5bGUoY2xhc3NOYW1lLCBwc2V1ZG8sIHN0eWxlKSk7XG4gICAgY2xvbmVkTm9kZS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuZnVuY3Rpb24gY2xvbmVQc2V1ZG9FbGVtZW50cyhuYXRpdmVOb2RlLCBjbG9uZWROb2RlKSB7XG4gICAgY2xvbmVQc2V1ZG9FbGVtZW50KG5hdGl2ZU5vZGUsIGNsb25lZE5vZGUsICc6YmVmb3JlJyk7XG4gICAgY2xvbmVQc2V1ZG9FbGVtZW50KG5hdGl2ZU5vZGUsIGNsb25lZE5vZGUsICc6YWZ0ZXInKTtcbn1cbmV4cG9ydHMuY2xvbmVQc2V1ZG9FbGVtZW50cyA9IGNsb25lUHNldWRvRWxlbWVudHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jbG9uZS1wc2V1ZG9zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubm9kZVRvRGF0YVVSTCA9IGV4cG9ydHMuc3ZnVG9EYXRhVVJMID0gZXhwb3J0cy5jcmVhdGVJbWFnZSA9IGV4cG9ydHMuY2FudmFzVG9CbG9iID0gZXhwb3J0cy5jaGVja0NhbnZhc0RpbWVuc2lvbnMgPSBleHBvcnRzLmdldFBpeGVsUmF0aW8gPSBleHBvcnRzLmdldEltYWdlU2l6ZSA9IGV4cG9ydHMudG9BcnJheSA9IGV4cG9ydHMuZGVsYXkgPSBleHBvcnRzLnV1aWQgPSBleHBvcnRzLnJlc29sdmVVcmwgPSB2b2lkIDA7XG5mdW5jdGlvbiByZXNvbHZlVXJsKHVybCwgYmFzZVVybCkge1xuICAgIC8vIHVybCBpcyBhYnNvbHV0ZSBhbHJlYWR5XG4gICAgaWYgKHVybC5tYXRjaCgvXlthLXpdKzpcXC9cXC8vaSkpIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgLy8gdXJsIGlzIGFic29sdXRlIGFscmVhZHksIHdpdGhvdXQgcHJvdG9jb2xcbiAgICBpZiAodXJsLm1hdGNoKC9eXFwvXFwvLykpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIHVybDtcbiAgICB9XG4gICAgLy8gZGF0YVVSSSwgbWFpbHRvOiwgdGVsOiwgZXRjLlxuICAgIGlmICh1cmwubWF0Y2goL15bYS16XSs6L2kpKSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICAgIHZhciBkb2MgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoKTtcbiAgICB2YXIgYmFzZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdiYXNlJyk7XG4gICAgdmFyIGEgPSBkb2MuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGRvYy5oZWFkLmFwcGVuZENoaWxkKGJhc2UpO1xuICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgIGlmIChiYXNlVXJsKSB7XG4gICAgICAgIGJhc2UuaHJlZiA9IGJhc2VVcmw7XG4gICAgfVxuICAgIGEuaHJlZiA9IHVybDtcbiAgICByZXR1cm4gYS5ocmVmO1xufVxuZXhwb3J0cy5yZXNvbHZlVXJsID0gcmVzb2x2ZVVybDtcbmV4cG9ydHMudXVpZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gZ2VuZXJhdGUgdXVpZCBmb3IgY2xhc3NOYW1lIG9mIHBzZXVkbyBlbGVtZW50cy5cbiAgICAvLyBXZSBzaG91bGQgbm90IHVzZSBHVUlEcywgb3RoZXJ3aXNlIHBzZXVkbyBlbGVtZW50cyBzb21ldGltZXMgY2Fubm90IGJlIGNhcHR1cmVkLlxuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAvLyByZWY6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzYyNDg3MjIvMjUxOTM3M1xuICAgIHZhciByYW5kb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgICAgIHJldHVybiBcIjAwMDBcIi5jb25jYXQoKChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMzYsIDQpKSA8PCAwKS50b1N0cmluZygzNikpLnNsaWNlKC00KTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgcmV0dXJuIFwidVwiLmNvbmNhdChyYW5kb20oKSkuY29uY2F0KGNvdW50ZXIpO1xuICAgIH07XG59KSgpO1xuZnVuY3Rpb24gZGVsYXkobXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlc29sdmUoYXJncyk7IH0sIG1zKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbmV4cG9ydHMuZGVsYXkgPSBkZWxheTtcbmZ1bmN0aW9uIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyYXlMaWtlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBhcnIucHVzaChhcnJheUxpa2VbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0cy50b0FycmF5ID0gdG9BcnJheTtcbmZ1bmN0aW9uIHB4KG5vZGUsIHN0eWxlUHJvcGVydHkpIHtcbiAgICB2YXIgd2luID0gbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICB2YXIgdmFsID0gd2luLmdldENvbXB1dGVkU3R5bGUobm9kZSkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZVByb3BlcnR5KTtcbiAgICByZXR1cm4gdmFsID8gcGFyc2VGbG9hdCh2YWwucmVwbGFjZSgncHgnLCAnJykpIDogMDtcbn1cbmZ1bmN0aW9uIGdldE5vZGVXaWR0aChub2RlKSB7XG4gICAgdmFyIGxlZnRCb3JkZXIgPSBweChub2RlLCAnYm9yZGVyLWxlZnQtd2lkdGgnKTtcbiAgICB2YXIgcmlnaHRCb3JkZXIgPSBweChub2RlLCAnYm9yZGVyLXJpZ2h0LXdpZHRoJyk7XG4gICAgcmV0dXJuIG5vZGUuY2xpZW50V2lkdGggKyBsZWZ0Qm9yZGVyICsgcmlnaHRCb3JkZXI7XG59XG5mdW5jdGlvbiBnZXROb2RlSGVpZ2h0KG5vZGUpIHtcbiAgICB2YXIgdG9wQm9yZGVyID0gcHgobm9kZSwgJ2JvcmRlci10b3Atd2lkdGgnKTtcbiAgICB2YXIgYm90dG9tQm9yZGVyID0gcHgobm9kZSwgJ2JvcmRlci1ib3R0b20td2lkdGgnKTtcbiAgICByZXR1cm4gbm9kZS5jbGllbnRIZWlnaHQgKyB0b3BCb3JkZXIgKyBib3R0b21Cb3JkZXI7XG59XG5mdW5jdGlvbiBnZXRJbWFnZVNpemUodGFyZ2V0Tm9kZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgdmFyIHdpZHRoID0gb3B0aW9ucy53aWR0aCB8fCBnZXROb2RlV2lkdGgodGFyZ2V0Tm9kZSk7XG4gICAgdmFyIGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IGdldE5vZGVIZWlnaHQodGFyZ2V0Tm9kZSk7XG4gICAgcmV0dXJuIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xufVxuZXhwb3J0cy5nZXRJbWFnZVNpemUgPSBnZXRJbWFnZVNpemU7XG5mdW5jdGlvbiBnZXRQaXhlbFJhdGlvKCkge1xuICAgIHZhciByYXRpbztcbiAgICB2YXIgRklOQUxfUFJPQ0VTUztcbiAgICB0cnkge1xuICAgICAgICBGSU5BTF9QUk9DRVNTID0gcHJvY2VzcztcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gcGFzc1xuICAgIH1cbiAgICB2YXIgdmFsID0gRklOQUxfUFJPQ0VTUyAmJiBGSU5BTF9QUk9DRVNTLmVudlxuICAgICAgICA/IEZJTkFMX1BST0NFU1MuZW52LmRldmljZVBpeGVsUmF0aW9cbiAgICAgICAgOiBudWxsO1xuICAgIGlmICh2YWwpIHtcbiAgICAgICAgcmF0aW8gPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgaWYgKE51bWJlci5pc05hTihyYXRpbykpIHtcbiAgICAgICAgICAgIHJhdGlvID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmF0aW8gfHwgd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbn1cbmV4cG9ydHMuZ2V0UGl4ZWxSYXRpbyA9IGdldFBpeGVsUmF0aW87XG4vLyBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9jYW52YXMjbWF4aW11bV9jYW52YXNfc2l6ZVxudmFyIGNhbnZhc0RpbWVuc2lvbkxpbWl0ID0gMTYzODQ7XG5mdW5jdGlvbiBjaGVja0NhbnZhc0RpbWVuc2lvbnMoY2FudmFzKSB7XG4gICAgaWYgKGNhbnZhcy53aWR0aCA+IGNhbnZhc0RpbWVuc2lvbkxpbWl0IHx8XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPiBjYW52YXNEaW1lbnNpb25MaW1pdCkge1xuICAgICAgICBpZiAoY2FudmFzLndpZHRoID4gY2FudmFzRGltZW5zaW9uTGltaXQgJiZcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPiBjYW52YXNEaW1lbnNpb25MaW1pdCkge1xuICAgICAgICAgICAgaWYgKGNhbnZhcy53aWR0aCA+IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ICo9IGNhbnZhc0RpbWVuc2lvbkxpbWl0IC8gY2FudmFzLndpZHRoO1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhc0RpbWVuc2lvbkxpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FudmFzLndpZHRoICo9IGNhbnZhc0RpbWVuc2lvbkxpbWl0IC8gY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2FudmFzRGltZW5zaW9uTGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2FudmFzLndpZHRoID4gY2FudmFzRGltZW5zaW9uTGltaXQpIHtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgKj0gY2FudmFzRGltZW5zaW9uTGltaXQgLyBjYW52YXMud2lkdGg7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggPSBjYW52YXNEaW1lbnNpb25MaW1pdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAqPSBjYW52YXNEaW1lbnNpb25MaW1pdCAvIGNhbnZhcy5oZWlnaHQ7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2FudmFzRGltZW5zaW9uTGltaXQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmNoZWNrQ2FudmFzRGltZW5zaW9ucyA9IGNoZWNrQ2FudmFzRGltZW5zaW9ucztcbmZ1bmN0aW9uIGNhbnZhc1RvQmxvYihjYW52YXMsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgIGlmIChjYW52YXMudG9CbG9iKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgY2FudmFzLnRvQmxvYihyZXNvbHZlLCBvcHRpb25zLnR5cGUgPyBvcHRpb25zLnR5cGUgOiAnaW1hZ2UvcG5nJywgb3B0aW9ucy5xdWFsaXR5ID8gb3B0aW9ucy5xdWFsaXR5IDogMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgdmFyIGJpbmFyeVN0cmluZyA9IHdpbmRvdy5hdG9iKGNhbnZhc1xuICAgICAgICAgICAgLnRvRGF0YVVSTChvcHRpb25zLnR5cGUgPyBvcHRpb25zLnR5cGUgOiB1bmRlZmluZWQsIG9wdGlvbnMucXVhbGl0eSA/IG9wdGlvbnMucXVhbGl0eSA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgIC5zcGxpdCgnLCcpWzFdKTtcbiAgICAgICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGg7XG4gICAgICAgIHZhciBiaW5hcnlBcnJheSA9IG5ldyBVaW50OEFycmF5KGxlbik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGJpbmFyeUFycmF5W2ldID0gYmluYXJ5U3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShuZXcgQmxvYihbYmluYXJ5QXJyYXldLCB7XG4gICAgICAgICAgICB0eXBlOiBvcHRpb25zLnR5cGUgPyBvcHRpb25zLnR5cGUgOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5jYW52YXNUb0Jsb2IgPSBjYW52YXNUb0Jsb2I7XG5mdW5jdGlvbiBjcmVhdGVJbWFnZSh1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlKGltZyk7IH07XG4gICAgICAgIGltZy5vbmVycm9yID0gcmVqZWN0O1xuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICAgICAgaW1nLmRlY29kaW5nID0gJ3N5bmMnO1xuICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgIH0pO1xufVxuZXhwb3J0cy5jcmVhdGVJbWFnZSA9IGNyZWF0ZUltYWdlO1xuZnVuY3Rpb24gc3ZnVG9EYXRhVVJMKHN2Zykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoc3ZnKTsgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZW5jb2RlVVJJQ29tcG9uZW50KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoaHRtbCkgeyByZXR1cm4gXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCxcIi5jb25jYXQoaHRtbCk7IH0pXTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnN2Z1RvRGF0YVVSTCA9IHN2Z1RvRGF0YVVSTDtcbmZ1bmN0aW9uIG5vZGVUb0RhdGFVUkwobm9kZSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHhtbG5zLCBzdmcsIGZvcmVpZ25PYmplY3Q7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHhtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbiAgICAgICAgICAgIHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3N2ZycpO1xuICAgICAgICAgICAgZm9yZWlnbk9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAgICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgXCJcIi5jb25jYXQod2lkdGgpKTtcbiAgICAgICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFwiXCIuY29uY2F0KGhlaWdodCkpO1xuICAgICAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIFwiMCAwIFwiLmNvbmNhdCh3aWR0aCwgXCIgXCIpLmNvbmNhdChoZWlnaHQpKTtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgICAgICBmb3JlaWduT2JqZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3Quc2V0QXR0cmlidXRlKCdleHRlcm5hbFJlc291cmNlc1JlcXVpcmVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHN2Zy5hcHBlbmRDaGlsZChmb3JlaWduT2JqZWN0KTtcbiAgICAgICAgICAgIGZvcmVpZ25PYmplY3QuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgc3ZnVG9EYXRhVVJMKHN2ZyldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMubm9kZVRvRGF0YVVSTCA9IG5vZGVUb0RhdGFVUkw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hcHBseVN0eWxlID0gdm9pZCAwO1xuZnVuY3Rpb24gYXBwbHlTdHlsZShub2RlLCBvcHRpb25zKSB7XG4gICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZTtcbiAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLndpZHRoKSB7XG4gICAgICAgIHN0eWxlLndpZHRoID0gXCJcIi5jb25jYXQob3B0aW9ucy53aWR0aCwgXCJweFwiKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgIHN0eWxlLmhlaWdodCA9IFwiXCIuY29uY2F0KG9wdGlvbnMuaGVpZ2h0LCBcInB4XCIpO1xuICAgIH1cbiAgICB2YXIgbWFudWFsID0gb3B0aW9ucy5zdHlsZTtcbiAgICBpZiAobWFudWFsICE9IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobWFudWFsKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHN0eWxlW2tleV0gPSBtYW51YWxba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZXhwb3J0cy5hcHBseVN0eWxlID0gYXBwbHlTdHlsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcGx5LXN0eWxlLmpzLm1hcCIsIi8vZG93bmxvYWQuanMgdjQuMiwgYnkgZGFuZGF2aXM7IDIwMDgtMjAxNi4gW01JVF0gc2VlIGh0dHA6Ly9kYW5tbC5jb20vZG93bmxvYWQuaHRtbCBmb3IgdGVzdHMvdXNhZ2Vcbi8vIHYxIGxhbmRlZCBhIEZGK0Nocm9tZSBjb21wYXQgd2F5IG9mIGRvd25sb2FkaW5nIHN0cmluZ3MgdG8gbG9jYWwgdW4tbmFtZWQgZmlsZXMsIHVwZ3JhZGVkIHRvIHVzZSBhIGhpZGRlbiBmcmFtZSBhbmQgb3B0aW9uYWwgbWltZVxuLy8gdjIgYWRkZWQgbmFtZWQgZmlsZXMgdmlhIGFbZG93bmxvYWRdLCBtc1NhdmVCbG9iLCBJRSAoMTArKSBzdXBwb3J0LCBhbmQgd2luZG93LlVSTCBzdXBwb3J0IGZvciBsYXJnZXIrZmFzdGVyIHNhdmVzIHRoYW4gZGF0YVVSTHNcbi8vIHYzIGFkZGVkIGRhdGFVUkwgYW5kIEJsb2IgSW5wdXQsIGJpbmQtdG9nZ2xlIGFyaXR5LCBhbmQgbGVnYWN5IGRhdGFVUkwgZmFsbGJhY2sgd2FzIGltcHJvdmVkIHdpdGggZm9yY2UtZG93bmxvYWQgbWltZSBhbmQgYmFzZTY0IHN1cHBvcnQuIDMuMSBpbXByb3ZlZCBzYWZhcmkgaGFuZGxpbmcuXG4vLyB2NCBhZGRzIEFNRC9VTUQsIGNvbW1vbkpTLCBhbmQgcGxhaW4gYnJvd3NlciBzdXBwb3J0XG4vLyB2NC4xIGFkZHMgdXJsIGRvd25sb2FkIGNhcGFiaWxpdHkgdmlhIHNvbG8gVVJMIGFyZ3VtZW50IChzYW1lIGRvbWFpbi9DT1JTIG9ubHkpXG4vLyB2NC4yIGFkZHMgc2VtYW50aWMgdmFyaWFibGUgbmFtZXMsIGxvbmcgKG92ZXIgMk1CKSBkYXRhVVJMIHN1cHBvcnQsIGFuZCBoaWRkZW4gYnkgZGVmYXVsdCB0ZW1wIGFuY2hvcnNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ybmRtZS9kb3dubG9hZFxuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuXHRcdC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuXHRcdC8vIGxpa2UgTm9kZS5cblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuXHRcdHJvb3QuZG93bmxvYWQgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG5cdHJldHVybiBmdW5jdGlvbiBkb3dubG9hZChkYXRhLCBzdHJGaWxlTmFtZSwgc3RyTWltZVR5cGUpIHtcblxuXHRcdHZhciBzZWxmID0gd2luZG93LCAvLyB0aGlzIHNjcmlwdCBpcyBvbmx5IGZvciBicm93c2VycyBhbnl3YXkuLi5cblx0XHRcdGRlZmF1bHRNaW1lID0gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIiwgLy8gdGhpcyBkZWZhdWx0IG1pbWUgYWxzbyB0cmlnZ2VycyBpZnJhbWUgZG93bmxvYWRzXG5cdFx0XHRtaW1lVHlwZSA9IHN0ck1pbWVUeXBlIHx8IGRlZmF1bHRNaW1lLFxuXHRcdFx0cGF5bG9hZCA9IGRhdGEsXG5cdFx0XHR1cmwgPSAhc3RyRmlsZU5hbWUgJiYgIXN0ck1pbWVUeXBlICYmIHBheWxvYWQsXG5cdFx0XHRhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSxcblx0XHRcdHRvU3RyaW5nID0gZnVuY3Rpb24oYSl7cmV0dXJuIFN0cmluZyhhKTt9LFxuXHRcdFx0bXlCbG9iID0gKHNlbGYuQmxvYiB8fCBzZWxmLk1vekJsb2IgfHwgc2VsZi5XZWJLaXRCbG9iIHx8IHRvU3RyaW5nKSxcblx0XHRcdGZpbGVOYW1lID0gc3RyRmlsZU5hbWUgfHwgXCJkb3dubG9hZFwiLFxuXHRcdFx0YmxvYixcblx0XHRcdHJlYWRlcjtcblx0XHRcdG15QmxvYj0gbXlCbG9iLmNhbGwgPyBteUJsb2IuYmluZChzZWxmKSA6IEJsb2IgO1xuXHQgIFxuXHRcdGlmKFN0cmluZyh0aGlzKT09PVwidHJ1ZVwiKXsgLy9yZXZlcnNlIGFyZ3VtZW50cywgYWxsb3dpbmcgZG93bmxvYWQuYmluZCh0cnVlLCBcInRleHQveG1sXCIsIFwiZXhwb3J0LnhtbFwiKSB0byBhY3QgYXMgYSBjYWxsYmFja1xuXHRcdFx0cGF5bG9hZD1bcGF5bG9hZCwgbWltZVR5cGVdO1xuXHRcdFx0bWltZVR5cGU9cGF5bG9hZFswXTtcblx0XHRcdHBheWxvYWQ9cGF5bG9hZFsxXTtcblx0XHR9XG5cblxuXHRcdGlmKHVybCAmJiB1cmwubGVuZ3RoPCAyMDQ4KXsgLy8gaWYgbm8gZmlsZW5hbWUgYW5kIG5vIG1pbWUsIGFzc3VtZSBhIHVybCB3YXMgcGFzc2VkIGFzIHRoZSBvbmx5IGFyZ3VtZW50XG5cdFx0XHRmaWxlTmFtZSA9IHVybC5zcGxpdChcIi9cIikucG9wKCkuc3BsaXQoXCI/XCIpWzBdO1xuXHRcdFx0YW5jaG9yLmhyZWYgPSB1cmw7IC8vIGFzc2lnbiBocmVmIHByb3AgdG8gdGVtcCBhbmNob3Jcblx0XHQgIFx0aWYoYW5jaG9yLmhyZWYuaW5kZXhPZih1cmwpICE9PSAtMSl7IC8vIGlmIHRoZSBicm93c2VyIGRldGVybWluZXMgdGhhdCBpdCdzIGEgcG90ZW50aWFsbHkgdmFsaWQgdXJsIHBhdGg6XG4gICAgICAgIFx0XHR2YXIgYWpheD1uZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgXHRcdGFqYXgub3BlbiggXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgXHRcdGFqYXgucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xuICAgICAgICBcdFx0YWpheC5vbmxvYWQ9IGZ1bmN0aW9uKGUpeyBcblx0XHRcdFx0ICBkb3dubG9hZChlLnRhcmdldC5yZXNwb25zZSwgZmlsZU5hbWUsIGRlZmF1bHRNaW1lKTtcblx0XHRcdFx0fTtcbiAgICAgICAgXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgYWpheC5zZW5kKCk7fSwgMCk7IC8vIGFsbG93cyBzZXR0aW5nIGN1c3RvbSBhamF4IGhlYWRlcnMgdXNpbmcgdGhlIHJldHVybjpcblx0XHRcdCAgICByZXR1cm4gYWpheDtcblx0XHRcdH0gLy8gZW5kIGlmIHZhbGlkIHVybD9cblx0XHR9IC8vIGVuZCBpZiB1cmw/XG5cblxuXHRcdC8vZ28gYWhlYWQgYW5kIGRvd25sb2FkIGRhdGFVUkxzIHJpZ2h0IGF3YXlcblx0XHRpZigvXmRhdGE6KFtcXHcrLV0rXFwvW1xcdysuLV0rKT9bLDtdLy50ZXN0KHBheWxvYWQpKXtcblx0XHRcblx0XHRcdGlmKHBheWxvYWQubGVuZ3RoID4gKDEwMjQqMTAyNCoxLjk5OSkgJiYgbXlCbG9iICE9PSB0b1N0cmluZyApe1xuXHRcdFx0XHRwYXlsb2FkPWRhdGFVcmxUb0Jsb2IocGF5bG9hZCk7XG5cdFx0XHRcdG1pbWVUeXBlPXBheWxvYWQudHlwZSB8fCBkZWZhdWx0TWltZTtcblx0XHRcdH1lbHNle1x0XHRcdFxuXHRcdFx0XHRyZXR1cm4gbmF2aWdhdG9yLm1zU2F2ZUJsb2IgPyAgLy8gSUUxMCBjYW4ndCBkbyBhW2Rvd25sb2FkXSwgb25seSBCbG9iczpcblx0XHRcdFx0XHRuYXZpZ2F0b3IubXNTYXZlQmxvYihkYXRhVXJsVG9CbG9iKHBheWxvYWQpLCBmaWxlTmFtZSkgOlxuXHRcdFx0XHRcdHNhdmVyKHBheWxvYWQpIDsgLy8gZXZlcnlvbmUgZWxzZSBjYW4gc2F2ZSBkYXRhVVJMcyB1bi1wcm9jZXNzZWRcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1lbHNley8vbm90IGRhdGEgdXJsLCBpcyBpdCBhIHN0cmluZyB3aXRoIHNwZWNpYWwgbmVlZHM/XG5cdFx0XHRpZigvKFtcXHg4MC1cXHhmZl0pLy50ZXN0KHBheWxvYWQpKXtcdFx0XHQgIFxuXHRcdFx0XHR2YXIgaT0wLCB0ZW1wVWlBcnI9IG5ldyBVaW50OEFycmF5KHBheWxvYWQubGVuZ3RoKSwgbXg9dGVtcFVpQXJyLmxlbmd0aDtcblx0XHRcdFx0Zm9yKGk7aTxteDsrK2kpIHRlbXBVaUFycltpXT0gcGF5bG9hZC5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0IFx0cGF5bG9hZD1uZXcgbXlCbG9iKFt0ZW1wVWlBcnJdLCB7dHlwZTogbWltZVR5cGV9KTtcblx0XHRcdH1cdFx0ICBcblx0XHR9XG5cdFx0YmxvYiA9IHBheWxvYWQgaW5zdGFuY2VvZiBteUJsb2IgP1xuXHRcdFx0cGF5bG9hZCA6XG5cdFx0XHRuZXcgbXlCbG9iKFtwYXlsb2FkXSwge3R5cGU6IG1pbWVUeXBlfSkgO1xuXG5cblx0XHRmdW5jdGlvbiBkYXRhVXJsVG9CbG9iKHN0clVybCkge1xuXHRcdFx0dmFyIHBhcnRzPSBzdHJVcmwuc3BsaXQoL1s6OyxdLyksXG5cdFx0XHR0eXBlPSBwYXJ0c1sxXSxcblx0XHRcdGRlY29kZXI9IHBhcnRzWzJdID09IFwiYmFzZTY0XCIgPyBhdG9iIDogZGVjb2RlVVJJQ29tcG9uZW50LFxuXHRcdFx0YmluRGF0YT0gZGVjb2RlciggcGFydHMucG9wKCkgKSxcblx0XHRcdG14PSBiaW5EYXRhLmxlbmd0aCxcblx0XHRcdGk9IDAsXG5cdFx0XHR1aUFycj0gbmV3IFVpbnQ4QXJyYXkobXgpO1xuXG5cdFx0XHRmb3IoaTtpPG14OysraSkgdWlBcnJbaV09IGJpbkRhdGEuY2hhckNvZGVBdChpKTtcblxuXHRcdFx0cmV0dXJuIG5ldyBteUJsb2IoW3VpQXJyXSwge3R5cGU6IHR5cGV9KTtcblx0XHQgfVxuXG5cdFx0ZnVuY3Rpb24gc2F2ZXIodXJsLCB3aW5Nb2RlKXtcblxuXHRcdFx0aWYgKCdkb3dubG9hZCcgaW4gYW5jaG9yKSB7IC8vaHRtbDUgQVtkb3dubG9hZF1cblx0XHRcdFx0YW5jaG9yLmhyZWYgPSB1cmw7XG5cdFx0XHRcdGFuY2hvci5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCBmaWxlTmFtZSk7XG5cdFx0XHRcdGFuY2hvci5jbGFzc05hbWUgPSBcImRvd25sb2FkLWpzLWxpbmtcIjtcblx0XHRcdFx0YW5jaG9yLmlubmVySFRNTCA9IFwiZG93bmxvYWRpbmcuLi5cIjtcblx0XHRcdFx0YW5jaG9yLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhbmNob3IpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGFuY2hvci5jbGljaygpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYW5jaG9yKTtcblx0XHRcdFx0XHRpZih3aW5Nb2RlPT09dHJ1ZSl7c2V0VGltZW91dChmdW5jdGlvbigpeyBzZWxmLlVSTC5yZXZva2VPYmplY3RVUkwoYW5jaG9yLmhyZWYpO30sIDI1MCApO31cblx0XHRcdFx0fSwgNjYpO1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaGFuZGxlIG5vbi1hW2Rvd25sb2FkXSBzYWZhcmkgYXMgYmVzdCB3ZSBjYW46XG5cdFx0XHRpZigvKFZlcnNpb24pXFwvKFxcZCspXFwuKFxcZCspKD86XFwuKFxcZCspKT8uKlNhZmFyaVxcLy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuXHRcdFx0XHRpZigvXmRhdGE6Ly50ZXN0KHVybCkpXHR1cmw9XCJkYXRhOlwiK3VybC5yZXBsYWNlKC9eZGF0YTooW1xcd1xcL1xcLVxcK10rKS8sIGRlZmF1bHRNaW1lKTtcblx0XHRcdFx0aWYoIXdpbmRvdy5vcGVuKHVybCkpeyAvLyBwb3B1cCBibG9ja2VkLCBvZmZlciBkaXJlY3QgZG93bmxvYWQ6XG5cdFx0XHRcdFx0aWYoY29uZmlybShcIkRpc3BsYXlpbmcgTmV3IERvY3VtZW50XFxuXFxuVXNlIFNhdmUgQXMuLi4gdG8gZG93bmxvYWQsIHRoZW4gY2xpY2sgYmFjayB0byByZXR1cm4gdG8gdGhpcyBwYWdlLlwiKSl7IGxvY2F0aW9uLmhyZWY9dXJsOyB9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vZG8gaWZyYW1lIGRhdGFVUkwgZG93bmxvYWQgKG9sZCBjaCtGRik6XG5cdFx0XHR2YXIgZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGYpO1xuXG5cdFx0XHRpZighd2luTW9kZSAmJiAvXmRhdGE6Ly50ZXN0KHVybCkpeyAvLyBmb3JjZSBhIG1pbWUgdGhhdCB3aWxsIGRvd25sb2FkOlxuXHRcdFx0XHR1cmw9XCJkYXRhOlwiK3VybC5yZXBsYWNlKC9eZGF0YTooW1xcd1xcL1xcLVxcK10rKS8sIGRlZmF1bHRNaW1lKTtcblx0XHRcdH1cblx0XHRcdGYuc3JjPXVybDtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChmKTsgfSwgMzMzKTtcblxuXHRcdH0vL2VuZCBzYXZlclxuXG5cblxuXG5cdFx0aWYgKG5hdmlnYXRvci5tc1NhdmVCbG9iKSB7IC8vIElFMTArIDogKGhhcyBCbG9iLCBidXQgbm90IGFbZG93bmxvYWRdIG9yIFVSTClcblx0XHRcdHJldHVybiBuYXZpZ2F0b3IubXNTYXZlQmxvYihibG9iLCBmaWxlTmFtZSk7XG5cdFx0fVxuXG5cdFx0aWYoc2VsZi5VUkwpeyAvLyBzaW1wbGUgZmFzdCBhbmQgbW9kZXJuIHdheSB1c2luZyBCbG9iIGFuZCBVUkw6XG5cdFx0XHRzYXZlcihzZWxmLlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYiksIHRydWUpO1xuXHRcdH1lbHNle1xuXHRcdFx0Ly8gaGFuZGxlIG5vbi1CbG9iKCkrbm9uLVVSTCBicm93c2Vyczpcblx0XHRcdGlmKHR5cGVvZiBibG9iID09PSBcInN0cmluZ1wiIHx8IGJsb2IuY29uc3RydWN0b3I9PT10b1N0cmluZyApe1xuXHRcdFx0XHR0cnl7XG5cdFx0XHRcdFx0cmV0dXJuIHNhdmVyKCBcImRhdGE6XCIgKyAgbWltZVR5cGUgICArIFwiO2Jhc2U2NCxcIiAgKyAgc2VsZi5idG9hKGJsb2IpICApO1xuXHRcdFx0XHR9Y2F0Y2goeSl7XG5cdFx0XHRcdFx0cmV0dXJuIHNhdmVyKCBcImRhdGE6XCIgKyAgbWltZVR5cGUgICArIFwiLFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGJsb2IpICApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJsb2IgYnV0IG5vdCBVUkwgc3VwcG9ydDpcblx0XHRcdHJlYWRlcj1uZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0cmVhZGVyLm9ubG9hZD1mdW5jdGlvbihlKXtcblx0XHRcdFx0c2F2ZXIodGhpcy5yZXN1bHQpO1xuXHRcdFx0fTtcblx0XHRcdHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTsgLyogZW5kIGRvd25sb2FkKCkgKi9cbn0pKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
