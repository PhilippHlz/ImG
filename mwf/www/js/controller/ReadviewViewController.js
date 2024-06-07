/**
 * @author Jörn Kreutel
 */
import { mwf } from '../Main.js';
import { entities } from '../Main.js';

export default class ReadviewViewController extends mwf.ViewController {
  // instance attributes set by mwf after instantiation
  args;
  root;
  viewProxy;

  /**
   * Initialisiert die View bei jeder Ansicht
   * Diese Methode wird aufgerufen, wenn die View erstellt wird.
   * Hier werden Daten gebunden, Listener gesetzt und die View initialisiert.
   */
  async oncreate() {
    // Bestimmen des Medienobjekts, das angezeigt werden soll
    var mediaItem = this.args.item;

    // Erstellen eines viewProxy und Binden des mediaItem anhand des Templates 'mediaReadviewTemplate'
    this.viewProxy = this.bindElement(
      'mediaReadviewTemplate',
      { item: mediaItem },
      this.root
    ).viewProxy;

    // Binden der Löschaktion an den deleteItem-Button
    // Wenn der Button geklickt wird, wird das Medienobjekt gelöscht
    this.viewProxy.bindAction('deleteItem', () => {
      mediaItem.delete().then(() => {
        // Zur vorherigen Ansicht zurückkehren und das gelöschte Element übergeben
        this.previousView({ deletedItem: mediaItem });
      });
    });

    // call the superclass once creation is done
    super.oncreate();
  }

  constructor() {
    super();
    console.log('ReadviewViewController()'); // Logging für die Erstellung des Controllers
  }

  /*
   * for views that initiate transitions to other views
   * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
   */
  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
  }

  /*
   * for views with listviews: bind a list item to an item view
   * TODO: delete if no listview is used or if databinding uses ractive templates
   */
  bindListItemView(listviewid, itemview, itemobj) {
    // TODO: implement how attributes of itemobj shall be displayed in itemview
  }

  /*
   * for views with listviews: react to the selection of a listitem
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemSelected(itemobj, listviewid) {
    // TODO: implement how selection of itemobj shall be handled
  }

  /*
   * for views with listviews: react to the selection of a listitem menu option
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
  }

  /*
   * for views with dialogs
   * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
   */
  bindDialog(dialogid, dialogview, dialogdataobj) {
    // call the supertype function
    super.bindDialog(dialogid, dialogview, dialogdataobj);

    // TODO: implement action bindings for dialog, accessing dialog.root
  }
}
