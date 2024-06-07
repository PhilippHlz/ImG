/**
 * Created by master on 17.02.16.
 */
import { mwf } from './Main.js';
import { mwfUtils } from './Main.js';
import { EntityManager } from './Main.js';
import { GenericCRUDImplLocal } from './Main.js';
import { GenericCRUDImplRemote } from './Main.js';
import { entities } from './Main.js';

class MyApplication extends mwf.Application {
  constructor() {
    super();
  }

  toggleCrudBtn
  crudScopeLabel

  async oncreate() {
    console.log('MyApplication.oncreate(): calling supertype oncreate');

    // first call the supertype method and pass a callback
    await super.oncreate();

    console.log('MyApplication.oncreate(): initialising local database');
    // initialise the local database
    await GenericCRUDImplLocal.initialiseDB('mwftutdb', 1, [
      'MyEntity',
      'MediaItem',
    ]);

    console.log('MyApplication.oncreate(): local database initialised');

    // register MediaItem entity and CRUD operations
    this.registerEntity('MediaItem', entities.MediaItem, true);
    this.registerCRUD(
      'MediaItem',
      this.CRUDOPS.LOCAL,
      GenericCRUDImplLocal.newInstance('MediaItem')
    );
    this.registerCRUD(
      'MediaItem',
      this.CRUDOPS.REMOTE,
      GenericCRUDImplRemote.newInstance('MediaItem')
    );

    // activate the local crud operations
    this.initialiseCRUD(this.CRUDOPS.LOCAL, EntityManager);

    console.log(
      'MyApplication.oncreate(): CRUD operations for MediaItem initialised'
    );

    // TODO: do any further application specific initialisations here

    // TODO: using setTimeout is an ugly workaround because the DOMs from the Controllers aren't initialized yet
    // therefore we need to wait 200ms until they got initialized - so we can access their DOM-Elements
    // maybe try sth like this instead: documentaddEventListener("DOMContentLoaded", (event) => {}); 
    setTimeout(() => {
      // dispatch initial scope - see line 48 above (this.initialiseCRUD(this.CRUDOPS.LOCAL, EntityManager);)
      this.dispatchUpdatedCRUDScope(this.CRUDOPS.LOCAL)

      this.toggleCrudBtn = document.querySelector("#toggle-crud-btn")
      this.crudScopeLabel = document.querySelector("#crud-scope-label")

      // set initial text-value for crudScopeLabel to current Crud scope
      this.crudScopeLabel.innerText = this.currentCRUDScope
      
      // toggle crud button event handler
      this.toggleCrudBtn.onclick = () => {
        const newCRUDScope = this.currentCRUDScope === this.CRUDOPS.REMOTE 
          ? this.CRUDOPS.LOCAL 
          : this.CRUDOPS.REMOTE
        this.switchCRUD(newCRUDScope)

        this.dispatchUpdatedCRUDScope(newCRUDScope)

        // set updated text-value for crudScopeLabel to new Crud scope
        this.crudScopeLabel.innerText = newCRUDScope
      }
    }, 200)

    // THIS MUST NOT BE FORGOTTEN: initialise the entity manager!
    EntityManager.initialise();


    
  }

  /************************
   * ****** helpers *******
   ***********************/

  /**
   * dispatches new event that signalise other Controllers (i.e. ListviewViewController) that
   * the CRUDScope has changed - and therefore the data needs to be refetched
   * @param {*} newScope "local" | "remote" | "synced"
   */
  dispatchUpdatedCRUDScope(newScope) {
    const crudScopUpdateEvent = new CustomEvent("CRUDScopeUpdated", {
      detail: {
        action: "didCrudUpdated",
        payload: newScope
      }
    });
    window.dispatchEvent(crudScopUpdateEvent) 
  }
}

const application = new MyApplication();
export { application as default };
