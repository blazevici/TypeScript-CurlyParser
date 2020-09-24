interface parsedObject {
    type?: string;
    attributes?: string[];
    content?: string;
}

const parsedArray: Array<parsedObject> = [];

class FileData {

    constructor(private filePath: string) { // Parameter properties, squeezing three-line declarations in one line within constructor
    }

    public async getFile() {
        const response = await fetch(this.filePath);
        return response.text();
    }
}

class Parser {
    private curlies: string[] = [];
    private tempData: string;

    constructor(private data: string) {
        this.tempData = this.data.replace(/[¶\r\n\t]/g, " ").replace(/[”]/g, "\"");
        this.curlies = this.getCurlies(this.tempData);
    }

    parseData() {
        for (let i = 0; i < this.curlies.length; i++) {
            let elementType = "";     
            let attributes: string[] = []; 
            let elementContent = "";
            let obj: parsedObject = {};

            let beginning = this.tempData.indexOf(this.curlies[i]);
            elementType = this.getWord(this.tempData.substring(beginning + 1, this.tempData.indexOf("}")));

            let attributesExist = this.getAttributes(this.curlies[i]);
            if (attributesExist) {
                this.parseAttributes(this.curlies[i], attributesExist, attributes);
            }

            if (!this.curlies[i].includes("/}")) {                           
                elementContent = this.tempData.substring(this.tempData.indexOf("}"), this.tempData.indexOf("{/")).slice(1);   
            } else {                                                                                           
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

    private getCurlies(data: string) {
        let pattern = /{([^}]+)}/g;
        return data.match(pattern)!.filter(element => !(element.includes("{/")));
    }

    private getWord(elementType: string) {
        let pattern = /\b(\w*\w*)\b/g;                    
        let word = elementType.match(pattern)!.toString();
        return word.substring(0, word.indexOf(","));
    }

    private getAttributes(elementAttributes: string) {
        let pattern = /(\w+)[=]/g;
        let attributes = elementAttributes.match(pattern);

        if (attributes) {
            return attributes.toString();
        }
    }

    private parseAttributes(element: string, attributesExist: string, attributes: string[]) {

        while(attributesExist) {    
            let attributeStart = element.indexOf(" ");      
            let equalSign = element.indexOf("=");          
            let tmpAtrribute = element.substring(attributeStart, equalSign).trim();  
            let tmpValue = this.getBetweenQuotes(element);      

            element = element.slice(element.indexOf('"', equalSign + 2) + 1).trim();

            if (attributesExist.indexOf(",") > -1) {                                          
                attributesExist = attributesExist.slice(attributesExist.indexOf(",") + 1);    
            } else {                                                                         
                attributesExist = "";                                                     
            }

            attributes.push(tmpAtrribute + ": " + tmpValue);                  
        }
    }

    private getBetweenQuotes(attributeValue: string) {
        let pattern = /[”"'](.*?)[”"']/g;
        attributeValue = attributeValue.match(pattern)!.toString();

        if (attributeValue.toString().includes(",")) {                 
            attributeValue = attributeValue.slice(0, attributeValue.indexOf(",")); 
        }
        return attributeValue.slice(1, -1).trim();          
    }

    pushToArray(parsedData: string) {
        return parsedData;
    }
}

async function TSParser() {
    const file1 = new FileData("primjer1.txt");
    const file2 = new FileData("primjer2.txt");

    const parsedFile1 = await file1.getFile().then(data => new Parser(data).parseData());
    const parsedFile2 = await file2.getFile().then(data => new Parser(data).parseData());

    console.log(parsedArray);
}

document.addEventListener("DOMContentLoaded", TSParser);
