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
const parsedArray = [];
class FileData {
    constructor(filePath) {
        this.filePath = filePath;
    }
    getFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.filePath);
            return response.text();
        });
    }
}
class Parser {
    constructor(data) {
        this.data = data;
        this.curlies = [];
        this.tempData = this.data.replace(/[¶\r\n\t]/g, " ").replace(/[”]/g, "\"");
        this.curlies = this.getCurlies(this.tempData);
    }
    parseData() {
        for (let i = 0; i < this.curlies.length; i++) {
            let elementType = "";
            let attributes = [];
            let elementContent = "";
            let obj = {};
            let beginning = this.tempData.indexOf(this.curlies[i]);
            elementType = this.getWord(this.tempData.substring(beginning + 1, this.tempData.indexOf("}")));
            let attributesExist = this.getAttributes(this.curlies[i]);
            if (attributesExist) {
                this.parseAttributes(this.curlies[i], attributesExist, attributes);
            }
            if (!this.curlies[i].includes("/}")) {
                elementContent = this.tempData.substring(this.tempData.indexOf("}"), this.tempData.indexOf("{/")).slice(1);
            }
            else {
                elementContent = "";
            }
            obj["type"] = elementType;
            if (attributes.length > 0) {
                obj["attributes"] = attributes;
            }
            if (elementContent !== "") {
                obj["content"] = elementContent;
            }
            parsedArray.push(obj);
            this.tempData = this.tempData.slice(this.tempData.indexOf(this.curlies[i + 1])).trim();
        }
    }
    getCurlies(data) {
        let pattern = /{([^}]+)}/g;
        return data.match(pattern).filter(element => !(element.includes("{/")));
    }
    getWord(elementType) {
        let pattern = /\b(\w*\w*)\b/g;
        let word = elementType.match(pattern).toString();
        return word.substring(0, word.indexOf(","));
    }
    getAttributes(elementAttributes) {
        let pattern = /(\w+)[=]/g;
        let attributes = elementAttributes.match(pattern);
        if (attributes) {
            return attributes.toString();
        }
    }
    parseAttributes(element, attributesExist, attributes) {
        while (attributesExist) {
            let attributeStart = element.indexOf(" ");
            let equalSign = element.indexOf("=");
            let tmpAtrribute = element.substring(attributeStart, equalSign).trim();
            let tmpValue = this.getBetweenQuotes(element);
            element = element.slice(element.indexOf('"', equalSign + 2) + 1).trim();
            if (attributesExist.indexOf(",") > -1) {
                attributesExist = attributesExist.slice(attributesExist.indexOf(",") + 1);
            }
            else {
                attributesExist = "";
            }
            attributes.push(tmpAtrribute + ": " + tmpValue);
        }
    }
    getBetweenQuotes(attributeValue) {
        let pattern = /[”"'](.*?)[”"']/g;
        attributeValue = attributeValue.match(pattern).toString();
        if (attributeValue.toString().includes(",")) {
            attributeValue = attributeValue.slice(0, attributeValue.indexOf(","));
        }
        return attributeValue.slice(1, -1).trim();
    }
    pushToArray(parsedData) {
        return parsedData;
    }
}
function TSParser() {
    return __awaiter(this, void 0, void 0, function* () {
        const file1 = new FileData("primjer1.txt");
        const file2 = new FileData("primjer2.txt");
        const parsedFile1 = yield file1.getFile().then(data => new Parser(data).parseData());
        const parsedFile2 = yield file2.getFile().then(data => new Parser(data).parseData());
        console.log(parsedArray);
    });
}
document.addEventListener("DOMContentLoaded", TSParser);
//# sourceMappingURL=app.js.map