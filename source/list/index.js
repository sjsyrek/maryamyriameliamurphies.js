/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/index.js
 *
 * @file Top level index for List data type.
 * @license ISC
 */

/** @module list */

export {List} from './list';

export {
  emptyList,
  list,
  listRange,
  listRangeLazy,
  listRangeLazyBy,
  listFilter,
  listAppend,
  cons,
  head,
  last,
  tail,
  init,
  uncons,
  empty,
  length,
  isList,
  isEmpty,
  fromArrayToList,
  fromListToArray,
  fromListToString,
  fromStringToList
} from './func';

export {
  map,
  reverse,
  intersperse,
  intercalate,
  transpose
} from './trans';

export {foldl} from './reducing';

export {
  concat,
  concatMap
} from './folds';

export {
  scanl,
  scanr
} from './building';

export {
  listInf,
  listInfBy,
  iterate,
  repeat,
  replicate,
  cycle
} from './inf';

export {
  take,
  drop,
  splitAt,
  takeWhile,
  dropWhile,
  span,
  spanNot,
  stripPrefix,
  group,
  groupBy
} from './sub';

export {
  lookup,
  filter
} from './searching';

export {
  index,
  elemIndex,
  elemIndices,
  find,
  findIndex,
  findIndices
} from './indexing';

export {
  zip,
  zip3,
  zipWith,
  zipWith3
} from './zip';

export {
  nub,
  nubBy,
  deleteL,
  deleteLBy,
  deleteFirsts,
  deleteFirstsBy
} from './set';

export {
  sort,
  sortBy,
  mergeSort,
  mergeSortBy,
  insert,
  insertBy
} from './ordering';
