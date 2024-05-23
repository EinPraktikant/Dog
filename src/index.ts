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
  }, (text) => {
    messageField.innerText = "Fehler";
  });
}, (response) => {
  messageField.innerText = "Fehler";
});

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
})