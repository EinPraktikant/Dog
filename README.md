# crash-course-frontend

FiPo24 - Crash Course

1. npm install
2. npm start

## References:

#### Node (JavaScript Interpreter)

[Node - Introduction (Official)](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

Kurzbeschreibung:

- Wird genutzt um JavaScript unabhängig vom Browser auszuführen
- Kann auch Backend darstellen und als HTTP-Anwendung laufen
- Bildet Basis für jede moderne Web-Anwendung heutzutage

#### WebPack - Hot-Reload-Modul

[webpack (Official)](https://webpack.js.org/)

Kurzbeschreibung:

- Webpack minified und bundled alle JS-Dateien in eine Datei, damit der Nutzer nur noch eine viel kleinere Datei herunterladen muss
- Minimiert auch in der Entwicklung das nervige Einbinden sämtlicher JS-Datei.
- Automatisiert und optimiert auch die Abhängigkeiten, sodass es zu keiner Order-Problemen kommt
- Kann auch zur automatischen Detektion geänderter Inhalte gucken und somit automatisch die Seite reloaden, womit es konform ist zu entwickeln

##### Cheat-Sheets HTML / CSS

- [HTML / CSS](https://htmlcheatsheet.com/css/)

##### Befehlreferenzen

- `mkdir <name>`
  - Erzeugt ein neuen Ordner im aktuellen Kontext
- `touch <name>`
  - Erzeugt eine neue Datei im aktuellen Kontext
- `npm -v | node -v`
  - Gibt die Version des aktuellen npm | node aus
- `npm init`
  - Initialisiert das node-projekt und erzeugt eine package-json, worin alles notwendige zum Projekt steht, sowie launch-scripts
- `npm install <package-name> | npm i <package-name>`
  - Installiert `package-name` via npm und schreibt es in die package.json als Referenz
- `npm install --save-dev`
  - Das `--save-dev` speichert es in einen bestimmten tag-tree, den devDependencies, das bedeutet, dass dieses Paket nur in der lokalen Entwicklung installiert und gebaut wird, im Deployment-Prozess aber nicht, das betrifft zum Beispiel Test-Packages oder Debugging-Packages
- `npm start`
  - Beachte, dass hier ist ein custom-script, welches in package-json festgelegt ist, es muss nicht zwangsweise start heißen, es könnte auch "run" sein oder "boot" oder sonstiges, das wird in der package.json manuell festgelegt, hinter den scripts verbirgt sich meist ein Befehl wie `node index.js` oder `nodemon app.js`

##### Web-Referenzen

[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)  

[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)    

[TypeScript Handbuch](https://www.typescriptlang.org/docs/handbook/intro.html)
