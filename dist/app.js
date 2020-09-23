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
    constructor(path) {
        this.filePath = path;
    }
    getFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.filePath);
            return response.text();
        });
    }
}
class Parser {
    constructor(fileData) {
        this.data = fileData;
    }
    parse() {
        return this.data;
    }
}
function TSParser() {
    return __awaiter(this, void 0, void 0, function* () {
        const file1 = new FileData("primjer1.txt");
        const file2 = new FileData("primjer2.txt");
        const parsedData = yield file1.getFile().then(data => new Parser(data).parse());
        console.log(parsedArray);
    });
}
document.addEventListener("DOMContentLoaded", TSParser);
//# sourceMappingURL=app.js.map