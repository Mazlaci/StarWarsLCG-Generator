const fs = require("fs")
const YAML = require("js-yaml")

module.exports = YAML.load(fs.readFileSync("data/cardType.yaml", "utf8"))