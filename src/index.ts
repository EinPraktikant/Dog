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

const queryField = <HTMLInputElement>document.getElementById("query");
const results = document.getElementById("results");

function addResult(imagePath: string, title?: string) {
  const node = document.createElement("div");
  node.classList.add("result");
  
  // Text container
  if (title !== undefined) {
    const textContainer = document.createElement("div");
    textContainer.classList.add("result__text");
    let textNode: Text;
    textNode = document.createTextNode(title);
    textContainer.appendChild(textNode);
    node.appendChild(textContainer);
  }
  
  // img container
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("result__img");
  const img = document.createElement("img");
  img.setAttribute("src", imagePath);
  img.classList.add("dog-img");
  imgContainer.appendChild(img);
  node.appendChild(imgContainer);
  
  results.appendChild(node);
}

function search() {
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
    let title: string;
    if (result.subbreedName === null) {
      title = result.breedName;
    } else {
      title = result.breedName + ", " + result.subbreedName;
    }

    // Fetch random image
    const images = fetch(basePath + "breed/" + result.breedName + "/images/random");

    let imagePath = "";

    images.then((response) => {
      response.text().then((text) => {
        const message = JSON.parse(text);

        if (message.status === "success") {
          imagePath = message.message;
        } else {
          messageField.innerText = "Fehler.";
        }
    
        addResult(imagePath, title);
      }, (reason) => messageField.innerText = "Fehler: " + reason);
    }, (reason) => messageField.innerText = "Fehler: " + reason);
  }

  if (resultList.size === 0) {
    messageField.innerText = "No dogs found."
  }
}

// Listen to query changes and wait until user stopped typing to not hammer the API server
let timeout;
queryField.addEventListener("input", (event) => {
  clearTimeout(timeout);
  timeout = setTimeout(search, 500);
});

// Random image on page load
const randImage = fetch(basePath + "breeds/image/random/9");
randImage.then((response) => {
  response.text().then((text) => {
    const result = JSON.parse(text);

    const images = result.message;

    for (const image of images) {
      addResult(image);
    }
  })
}, (reason) => messageField.innerText = "Fehler: " + reason);