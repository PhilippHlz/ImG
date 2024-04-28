const playlistUl = document.getElementById('playlist');
const syncButton = document.getElementById('sync-button');
const addButton = document.getElementById('add-button');
const viewButton = document.getElementById('change-view-button');

// Daten beim Start laden
fetchAndDisplayItems();

// Eventlistener für den Aktualisierungsbutton, um die Liste neu zu laden
syncButton.addEventListener('click', fetchAndDisplayItems);

// Eventlistener für den Hinzufügen-Button, um ein fest definiertes Element hinzuzufügen
addButton.addEventListener('click', addItem);

/**
 * Erstellt ein neues Listenelement mit den gegebenen Daten.
 *
 * @param title Der Titel des Liedes.
 * @param owner Der Besitzer des Liedes.
 * @param added Das Datum, an dem das Lied hinzugefügt wurde.
 * @param numOfTags Die Anzahl der wiedergaben des Liedes.
 * @param src Der Pfad zur Bilddatei des Liedes.
 * @return Ein neues Listenelement (li), das alle gegebenen Daten enthält.
 */
function createListItem(title, owner, added, numOfTags, src) {
  // Erstellt ein neues Listenelement
  let newListItem = document.createElement('li');
  newListItem.className = 'playlist-container-list-view';

  // Erstellt und fügt das Bild zum Listenelement hinzu
  let imgElement = document.createElement('img');
  imgElement.className = 'song-img-list-view';
  imgElement.src = src;
  imgElement.alt = 'Song Image';
  newListItem.appendChild(imgElement);

  // Erstellt und fügt den Besitzer zum Listenelement hinzu
  let ownerElement = document.createElement('p');
  ownerElement.textContent = owner;
  newListItem.appendChild(ownerElement);

  // Erstellt und fügt das Hinzufügedatum zum Listenelement hinzu
  let addedElement = document.createElement('p');
  addedElement.textContent = added;
  newListItem.appendChild(addedElement);

  // Erstellt und fügt den Titel zum Listenelement hinzu
  let titleElement = document.createElement('h2');
  titleElement.textContent = title;
  newListItem.appendChild(titleElement);

  // Erstellt den Container für den Abspielknopf und die Abspielanzahl und fügt ihn zum Listenelement hinzu
  let songPlayContainer = document.createElement('div');
  songPlayContainer.className = 'song-play-container';
  newListItem.appendChild(songPlayContainer);

  // Erstellt und fügt den Abspielknopf zum Abspielcontainer hinzu
  let playButton = document.createElement('button');
  playButton.className = 'imgbutton play-item';
  songPlayContainer.appendChild(playButton);

  // Erstellt und fügt die Abspielanzahl zum Abspielcontainer hinzu
  let numOfTagsElement = document.createElement('p');
  numOfTagsElement.textContent = numOfTags;
  songPlayContainer.appendChild(numOfTagsElement);

  // Erstellt und fügt den Mehr-Optionen-Knopf zum Listenelement hinzu
  let moreOptionsButton = document.createElement('button');
  moreOptionsButton.className = 'imgbutton more-options-item-list-view';
  newListItem.appendChild(moreOptionsButton);

  // Gibt das erstellte Listenelement zurück
  return newListItem;
}

/**
 * Iteriert über ein Array von Daten und fügt für jeden Eintrag ein neues Listenelement zur Playlist hinzu.
 *
 * Für jeden Eintrag im Array wird ein neues Listenelement erstellt, indem die Funktion createListItem aufgerufen wird.
 * Das erstellte Listenelement wird dann dem übergeordneten ul-Element hinzugefügt.
 *
 * @see createListItem
 * @param {Array} data Ein Array von Objekten, wobei jedes Objekt die notwendigen Daten für ein Lied enthält.
 */
function addPlaylistItems(data) {
  data.forEach((element) => {
    let newListItem = createListItem(
      element.title,
      element.owner,
      element.added,
      element.numOfTags,
      element.src
    );
    playlistUl.appendChild(newListItem);
  });
}

/**
 * Lädt Daten von einer externen Quelle und fügt die entsprechenden Listenelemente zur Playlist hinzu.
 *
 * Diese Funktion leert zunächst alle Einträge aus der UL und sendet dann einen GET-Request an die angegebene URL, um die Daten zu laden.
 * Nachdem die Daten geladen wurden, werden sie in ein JSON-Format umgewandelt.
 * Anschließend wird die Funktion addPlaylistItems aufgerufen, um die entsprechenden Listenelemente zur Playlist hinzuzufügen.
 * Wenn während des Prozesses ein Fehler auftritt, wird dieser Fehler in der Konsole ausgegeben.
 * @see dofetch
 * @see addPlaylistItems
 */
function fetchAndDisplayItems() {
  while (playlistUl.firstChild) {
    playlistUl.removeChild(playlistUl.firstChild);
  }

  dofetch('GET', '../data/listitems.json')
    .then((response) => response.json())
    .then((data) => addPlaylistItems(data))
    .catch((error) => console.error(error));
}

/**
 * Erstellt und fügt ein neues ListenElement hinzu.
 *
 * Diese Funktion erstellt ein neues Listenelement mit dem aktuellen Datum und fügt es dem übergeordneten 'ul'-Element hinzu.
 * Abhängig vom aktuellen Ansichtsmodus (Grid oder Liste), wird das neue Element entsprechend formatiert.
 * Wenn der Ansichtsbutton die Klasse .grid-view-item enthält, wird das hinzugefügte Lied als Kachel dargestellt.
 * Andernfalls wird es als Listenelement hinzugefügt.
 *
 * @see createListItem
 * @see changeListItemElementsView
 */
function addItem() {
  let newListItem = createListItem(
    'Title',
    'Owner',
    new Date().toLocaleDateString(),
    90,
    'https://placekitten.com/200/150'
  );

  playlistUl.appendChild(newListItem);
  if (viewButton.classList.contains('grid-view-item')) {
    newListItem.classList.toggle('playlist-container-grid-view');
    changeListItemElementsView(newListItem);
  }
}
