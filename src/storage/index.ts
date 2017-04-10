
export { EntityStorage } from './entity_storage';
export { EntityNamesStorage } from './entity_names_storage';
export { ENTITY_FIELDS, ENTITY_NAMES_FIELDS } from './db/schemas';

// export * from './categories';
import * as Config from './config';
export { Config }

import { createTables } from './db/create_tables';
import { deleteTables } from './db/delete_tables';
export { createTables, deleteTables }
