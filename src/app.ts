const parsedArray: string[] = [];

class FileData {
    filePath: string;

    constructor(path: string) {
        this.filePath = path;
    }

    public async getFile() {
        const response = await fetch(this.filePath);
        return response.text();
    }
}

class Parser {
    data: string;

    constructor(fileData: string) {
        this.data = fileData;
    }

    public parse() {
        return this.data;
    }
}

async function TSParser() {
    const file1 = new FileData("primjer1.txt");
    const file2 = new FileData("primjer2.txt");

    const parsedData = await file1.getFile().then(data => new Parser(data).parse());

    console.log(parsedArray);
}

document.addEventListener("DOMContentLoaded", TSParser);
