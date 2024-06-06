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

    // THIS MUST NOT BE FORGOTTEN: initialise the entity manager!
    EntityManager.initialise();
  }
}

const application = new MyApplication();
export { application as default };
