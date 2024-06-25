import { mwf } from '../Main.js';
import { entities } from '../Main.js';

export default class ListviewViewController extends mwf.ViewController {
  // instance attributes set by mwf after instantiation
  args;
  root;
  crudops;

  addNewMediaItemElement;
  toggleRemoteBtn;

  constructor() {
    super();
    console.log('ListviewViewController()');
  }

  /**
   * Erstellt ein neues MediaItem-Objekt mit Standardwerten und zeigt einen Dialog an, um es zur Listenansicht hinzuzufügen.
   */
  createNewItem() {
    var newItem = new entities.MediaItem(
      '',
      'https://placehold.co/100x100?text=New+Item'
    );
    this.showDialog('mediaItemDialog', {
      item: newItem,
      actionBindings: {
        submitForm: (event) => {
          event.original.preventDefault();
          newItem.create().then(() => {
            this.addToListview(newItem);
          });
          this.hideDialog();
        },
      },
    });
  }

  /**
   * Löscht ein Element aus der Listenansicht und entfernt es aus der Ansicht.
   *
   * @param {Object} item - Das zu löschende Element.
   */
  deleteItem(item) {
    item.delete(() => {
      this.removeFromListview(item._id);
    });
  }

  deleteItemWithConfirm(item) {
    this.showDialog('mediaItemConfirmDeleteDialog', {
      item: item,
      actionBindings: {
        submitForm: (event) => {
          event.original.preventDefault();
          item.delete().then(() => {
            this.removeFromListview(item._id);
            this.hideDialog();
          });
        },
        cancelDeleteItem: () => {
          this.hideDialog()
        }
      },
    });
  }


  /**
   * Öffnet den Dialog, der beim Löschen oder Bearbeiten eines Listeneintrags verwendet wird.
   * Es wird die Möglichkeit gegeben, ein Item zu bearbeiten oder zu löschen.
   *
   * @param {Object} item - Das zu bearbeitende Element.
   * @return {void} Diese Funktion gibt nichts zurück.
   */
  editItem(item) {
    console.log("editem item executed")
    this.showDialog('mediaItemDialog', {
      item: item,
      actionBindings: {
        submitForm: (event) => {
          event.original.preventDefault();
          item.update().then(() => {
            this.updateInListview(item._id, item);
          });
          this.hideDialog();
        },
        deleteItem: (event) => {
          this.deleteItem(item);
          this.hideDialog();
        },
      },
    });
  }

  async oncreate() {

    /**
      * listen on CRUDScopeUpdated Event to: 
      * refetch the data from the local/clientside data (IndexedDB)
      * -> if currentCRUDScope === "local"
      *
      * or refetch the data from remote/serverside (mongoDB)
      * -> if currentCRUDScope === "remote"
    */
    window.addEventListener("CRUDScopeUpdated", (e) => {
      console.log(e)
      entities.MediaItem.readAll().then((items) => {
        this.initialiseListview(items);
      });
    })

    this.addNewMediaItemElement = this.root.querySelector('#addNewMediaItem');
    this.addNewMediaItemElement.onclick = () => {
      this.createNewItem();
    };

    super.oncreate();
  }

  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    if (
      nextviewid == 'mediaReadview' &&
      returnValue &&
      returnValue.deletedItem
    ) {
      this.removeFromListview(returnValue.deletedItem._id);
    }
  }

  /*
   * for views with listviews: react to the selection of a listitem menu option
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
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
