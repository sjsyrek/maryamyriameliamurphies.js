/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * list/index.js
 *
 * Top level index for List data type.
 */

export {List} from './list';

// Basic list functions

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

// List transformation functions

export {
  map,
  reverse,
  intersperse,
  intercalate,
  transpose
} from './trans';

// Functions for reducing lists

export {foldl} from './reducing';

// Special folds for lists

export {
  concat,
  concatMap
} from './folds';

// Functions for building lists

export {
  scanl,
  scanr
} from './building';

// Infinite list functions

export {
  listInf,
  listInfBy,
  iterate,
  repeat,
  replicate,
  cycle
} from './inf';

// Sublist functions

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

// Functions for searching lists

export {
  lookup,
  filter
} from './searching';

// Functions for indexing lists

export {
  index,
  elemIndex,
  elemIndices,
  find,
  findIndex,
  findIndices
} from './indexing';

// Functions for zipping and unzipping lists

export {
  zip,
  zip3,
  zipWith,
  zipWith3
} from './zip';

// "Set" operations on lists

export {
  nub,
  nubBy,
  deleteL,
  deleteLBy,
  deleteFirsts,
  deleteFirstsBy
} from './set';

// Functions for ordering lists

export {
  sort,
  sortBy,
  mergeSort,
  mergeSortBy,
  insert,
  insertBy
} from './ordering';
