const basePath = ` https://dog.ceo/api/`;

const messageField = document.getElementById("message");

class Entry {
  breedName: string;
  subbreedName: string;
}

const index: Map<string, Entry> = new Map();

// Fetch breeds from servers and put into a map
const allBreeds = fetch(basePath + "breeds/list/all");
allBreeds.then((response) => {
  response.text().then((text) => {
    const message = JSON.parse(text);

    if (!message.status || message.status !== "success") {
      messageField.innerText = "Fehler vom Server.";
    } else { // Fill index
      for (const [breed, subbreeds] of Object.entries(message.message)) {
        const entry: Entry = {
          breedName: breed,
          subbreedName: null,
        };

        const words = breed.split(" ");

        for (const word of words) {
          index.set(word, entry);
        }

        for (const subbreed of <Array<string>>subbreeds) {
          const entry: Entry = {
            breedName: breed,
            subbreedName: subbreed,
          };

          const words = subbreed.split(" ");

          for (const word of words) {
            index.set(word, entry);
          }
        }
      }
    }
  }, (reason) => messageField.innerText = "Fehler: " + reason);
}, (reason) => messageField.innerText = "Fehler: " + reason);

// Listen to query changes and search
const queryField = <HTMLInputElement>document.getElementById("query");
const results = document.getElementById("results");
queryField.addEventListener("input", (event) => {
  const query = queryField.value.trim().toLowerCase();
  const queryWords = query.split(" ");

  const resultList: Set<Entry> = new Set<Entry>();

  for (const word of queryWords) {
    const entry = index.get(word);

    if (entry != null) {
      resultList.add(entry);
    }
  }

  while (results.children.length !== 0) {
    results.removeChild(results.lastChild);
  }

  for (const result of resultList) {
    const node = document.createElement("div");
    node.classList.add("result");
    
    // text container
    const textContainer = document.createElement("div");
    textContainer.classList.add("result__text");
    let textNode: Text;
    if (result.subbreedName === null) {
      textNode = document.createTextNode(result.breedName);
    } else {
      textNode = document.createTextNode(result.breedName + ", " + result.subbreedName);
    }
    textContainer.appendChild(textNode);
    node.appendChild(textContainer);

    // Fetch random image
    const images = fetch(basePath + "breed/" + result.breedName + "/images/random");

    images.then((response) => {
      response.text().then((text) => {
        const message = JSON.parse(text);

        if (message.status === "success") {
          const imagePath: string = message.message;
          
          // img container
          const imgContainer = document.createElement("div");
          imgContainer.classList.add("result__img");
          const img = document.createElement("img");
          img.setAttribute("src", imagePath);
          img.classList.add("dog-img");
          imgContainer.appendChild(img);
          node.appendChild(imgContainer);
        } else {
          messageField.innerText = "Fehler.";
        }
      }, (reason) => messageField.innerText = "Fehler: " + reason);
    }, (reason) => messageField.innerText = "Fehler: " + reason);
    
    results.appendChild(node);
  }
})