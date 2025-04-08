import { ResultObject } from './result-object';
import { SearchOptions } from './search-option';

export class BaseSearch {
  items: [];

  searchOptions: SearchOptions;

  result: ResultObject = new ResultObject();
}
