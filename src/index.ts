const BasePath = new URL("https://dog.ceo/api/");

const ErrorMessageField = document.getElementById("message");

class IndexDocument {
  text: string;
}

/* class Index {
  private invertedIndex: Map<string, IndexEntry>;

  constructor() {}

  private tokenize(text: string): string[] {
    const words = text.split(" ");

    return words;
  }

  insert(title: string, indexDocument: IndexDocument): void {
    const text = sanitizeText(indexDocument.text);
    const tokens = this.tokenize(text);

    for (const word of tokens) {
      this.invertedIndex.set(word, entry);
    }
  }
} */

type IndexEntry = {
  breedName: string;
  subbreedName?: string;
};

type RandomImagesMessage = {
  message: string[];
  status: string;
};

type ListAllBreedsMessage = {
  message: object;
  status: string;
};

type RandomBreedImagesMessage = {
  message: string;
  status: string;
};

function insertEntryIntoIndex(searchIndex: Map<string, IndexEntry>, entry: IndexEntry, ...tokens: string[]): void {
  for (const word of tokens) {
    searchIndex.set(word, entry);
  }
}

function displayError(error: string = undefined): void {
  if (error === undefined) {
    ErrorMessageField.innerText = "Fehler.";
  } else {
    ErrorMessageField.innerText = `Fehler: ${error}`;
  }
}

function buildIndex(searchIndex: Map<string, IndexEntry>): void {
  // Fetch breeds from servers and put into a map
  const allBreeds = fetch(new URL("breeds/list/all", BasePath));
  allBreeds.then((response) => {
    response.json().then((message: ListAllBreedsMessage) => {
      if (!message.status || message.status !== "success") {
        displayError("Fehler vom Server.");
      } else { // Fill index
        for (const [breed, subbreeds] of Object.entries(message.message)) {
          const entry: IndexEntry = {
            breedName: breed,
          };

          const words = breed.split(" ");
          insertEntryIntoIndex(searchIndex, entry, ...words);

          for (const subbreed of <Array<string>>subbreeds) {
            const entry: IndexEntry = {
              breedName: breed,
              subbreedName: subbreed,
            };

            const words = subbreed.split(" ");
            insertEntryIntoIndex(searchIndex, entry, ...words);
          }
        }
      }
    }, (reason) => displayError(reason));
  }, (reason) => displayError(reason));
}

function clearResultsPage(resultsContainer: HTMLElement): void {
  if (resultsContainer == null) {
    return;
  }

  while (resultsContainer.children.length !== 0) {
    resultsContainer.removeChild(resultsContainer.lastChild);
  }
}

function appendResultToPage(resultsContainer: HTMLElement, imagePath: string, title: string = undefined): void {
  const resultNode = document.createElement("div");
  resultNode.classList.add("result");

  // Text container
  if (title !== undefined) {
    const textContainer = document.createElement("div");
    textContainer.classList.add("result__text");
    let textNode: Text = document.createTextNode(title);
    textContainer.appendChild(textNode);
    resultNode.appendChild(textContainer);
  }

  // img container
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("result__img");
  const img = document.createElement("img");
  img.setAttribute("src", imagePath);
  img.classList.add("dog-img");
  imgContainer.appendChild(img);
  resultNode.appendChild(imgContainer);

  resultsContainer.appendChild(resultNode);
}

async function displayRandomResults(resultsContainer: HTMLElement): Promise<void> {
  clearResultsPage(resultsContainer);

  const randomImage = await fetch(new URL("breeds/image/random/9", BasePath));
  const result: RandomImagesMessage = await randomImage.json();

  for (const image of result.message) {
    appendResultToPage(resultsContainer, image);
  }
}

function sanitizeText(text: string): string {
  text = text.trim();

  text.toLowerCase();

  const re = /\s+/;

  text = text.replace(re, " ");

  return text;
}

function search(queryField: HTMLInputElement, resultsContainer: HTMLElement, searchIndex: Map<string, IndexEntry>): void {
  const results: Set<IndexEntry> = new Set();

  const query = sanitizeText(queryField.value);
  if (query.length === 0) {
    displayRandomResults(resultsContainer).catch((reason) => displayError(reason));
    return;
  }
  const queryWords = query.split(" ");
  for (const word of queryWords) {
    const entry = searchIndex.get(word);

    if (entry != null) {
      results.add(entry);
    }
  }

  clearResultsPage(resultsContainer);

  for (const result of results) {
    let title: string;
    if (result.subbreedName == null) {
      title = result.breedName;
    } else {
      title = result.breedName + ", " + result.subbreedName;
    }

    // Fetch random image
    const images = fetch(new URL("breed/" + result.breedName + "/images/random", BasePath));

    images.then((response) => {
      response.json().then((message: RandomBreedImagesMessage) => {
        if (message.status === "success") {
          const imagePath = message.message;

          appendResultToPage(resultsContainer, imagePath, title);
        } else {
          displayError();
        }
      }, (reason) => displayError(reason));
    }, (reason) => displayError(reason));
  }

  if (results.size === 0) {
    displayError("No dogs found.");
  }
}

function triggerSearchOnInputChange(queryField: HTMLInputElement, resultsContainer: HTMLElement, searchIndex: Map<string, IndexEntry>): void {
  let searchTimeout: NodeJS.Timeout;

  queryField.addEventListener("input", (event) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(search, 500, queryField, resultsContainer, searchIndex);
  });
}



// ---------------------------- "main"
const QueryField = document.getElementById("query") as HTMLInputElement;

const SearchIndex: Map<string, IndexEntry> = new Map();

const ResultsContainer = document.getElementById("results");

buildIndex(SearchIndex);

displayRandomResults(ResultsContainer).catch((reason) => displayError(reason));

triggerSearchOnInputChange(QueryField, ResultsContainer, SearchIndex);