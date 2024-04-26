// Zugriff auf die Elemente 'change-view-button' und 'playlist' aus index.html
const changeViewButton = document.getElementById('change-view-button');
const playlist = document.getElementById('playlist');

/*
 * Fügt einen Event-Listener zum 'change-view-button' hinzu. Dieser löst die Funktion 'togglePlaylist' aus, wenn auf den Button geklickt wird.
 * Durch diesen Klick wird der Übergang zwischen den Ansichten initiiert und ausgeführt.
 */
changeViewButton.addEventListener('click', togglePlaylist);

/**
 * Fügt der Playlist einen Klick-Event-Listener hinzu.
 *
 * Die Unordered List (ul) erhält einen EventListener, der das geklickte Element in der ul anhand des Targets ermittelt.
 * Danach wird der passende Listeneintrag mit der Methode closest('li') ermittelt, welche das nächstgelegene 'li'-Element des geklickten Elements ist.
 * Anhand dessen werden mit einem querySelector die passenden Textelemente gefiltert und für den späteren Gebrauch für die Alerts gespeichert.
 *
 * Wenn das direkt ausgewählte Element (nicht das übergeordnete) die Klasse .more-options-item-list-view hat, wird der Alert mit URL und Titel erzeugt, sonst nur mit dem Titel.
 * Der Button enthält immer diese Klasse, da die Grid-Klassen nur getoggelt werden und somit nicht die .more-options-item-list-view entfernen.
 *
 * @see style.css für die zugehörigen CSS-Regeln.
 * @see changeListItemElementsView für die Logik des Klassenwechsels.
 * @event click Das Event, auf das der Listener reagiert.
 */
playlist.addEventListener('click', function (event) {
  let clickedElement = event.target;
  let selectedListElement = clickedElement.closest('li');

  if (selectedListElement !== null) {
    let title = selectedListElement.querySelector('h2').textContent;
    let url = selectedListElement.querySelector('p').textContent;

    if (clickedElement.classList.contains('more-options-item-list-view')) {
      alert(title + '\n' + url);
    } else {
      alert(title);
    }
  }
});

/**
 * Diese Funktion ändert das Format des Hauptbereichs (Playlist) und aktualisiert das Icon im Header.
 *
 * Zuerst wird die Sichtbarkeit der Playlist durch Änderung der Deckkraft angepasst, wodurch der Inhalt ausgeblendet wird.
 * Anschließend wird der Hauptbereich modifiziert und wechselt entweder in die Listen- oder Kachelansicht.
 * Schließlich wird das Icon des Ansichtswechsel-Buttons entsprechend dem aktuellen Layout aktualisiert.
 * @see toggleOpacity
 * @see changeUnorderedListView
 * @see changeListItemView
 */
function togglePlaylist() {
  toggleOpacity(playlist);
  playlist.addEventListener('transitionend', function handler() {
    // Anischt wird geändert
    changeUnorderedListView(playlist);
    changeListItemView(playlist);

    // Button wird geändert
    changeViewButton.classList.toggle('grid-view-item');

    // Inhalt wird wieder eingeblendet
    toggleOpacity(playlist);
    playlist.removeEventListener('transitionend', handler);
  });
}

/**
 * Wechselt die Deckkraft eines Elements
 *
 * Wenn die Deckkraft bei 0 liegt wird sie auf 1 geändert und wenn die deckkraft eine 1 ist wird sie zur null geändert.
 * Die Zeit für den Übergang wird in den jeiweligen css Klassen festgelegt (für die Kachel- und Listenanischt).
 * @see style.css
 * @param {HTMLElement} element Das Element, dessen Deckkraft geändert werden soll
 */
function toggleOpacity(element) {
  element.style.opacity = element.style.opacity === '0' ? '1' : '0';
}

/**
 * Fügt oder entfernt Klassen, um das Gitterlayout der ungeordneten Liste (ul) zu ändern.
 *
 * Fügt die Klasse .playlist-grid-view hinzu oder entfernt sie, um das Gitterlayout anzuzeigen oder zu entfernen.
 * @see style.css
 * @see changeUnorderedListView
 * @param {HTMLElement} unorderedList Das Element der ungeordneten Liste oder sein übergeordnetes Element, dessen Darstellung umgeschaltet werden soll.
 */
function changeUnorderedListView(unorderedList) {
  unorderedList.classList.toggle('playlist-grid-view');
}

/**
/**
 * Ändert die Darstellung jedes Listenelements (li) in einer ungeordneten Liste (ul).
 * 
 * Diese Funktion fügt oder entfernt die Klasse .playlist-container-grid-view von jedem Listenelement hinzu, um zwischen verschiedenen Ansichten zu wechseln.
 * @see style.css
 * @see changeListItemElementsView
 * @param {HTMLElement} unorderedList Die ungeordnete Liste, deren Listenelemente geändert werden sollen.
 */
function changeListItemView(unorderedList) {
  const playlistItems = unorderedList.children;
  for (let i = 0; i < playlistItems.length; i++) {
    const listItem = playlistItems[i];
    listItem.classList.toggle('playlist-container-grid-view');
    changeListItemElementsView(listItem);
  }
}

/**
 * Ändert die Darstellung jedes Elements innerhalb eines Listenelements (li).
 *
 * Diese Funktion passt die Darstellung der Elemente innerhalb des übergebenen Listenelements an, basierend auf ihrer Klasse.
 * Wenn das jeweilige Element der Klasse .song-img-list-view oder .more-options-item-list-view angehört, wird die Ansicht auf ein Rasterlayout (Grid) umgestellt.
 * Wenn das Element keiner dieser Klassen angehört, wird es ausgeblendet.
 * @param {HTMLElement} listItem Das Listenelement, dessen Elemente geändert werden sollen.
 */
function changeListItemElementsView(listItem) {
  const elements = listItem.children;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    switch (true) {
      case element.classList.contains('song-img-list-view'):
        element.classList.toggle('song-img-grid-view');
        break;

      case element.classList.contains('more-options-item-list-view'):
        element.classList.toggle('more-options-item-grid-view');
        break;

      default:
        element.style.display = element.style.display === 'none' ? '' : 'none';
        break;
    }
  }
}
