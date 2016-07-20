/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * index.js
 *
 * Top level index.
 */

// Base

export {
  partial,
  $,
  flip,
  id,
  constant,
  until,
  and,
  or,
  not,
  even,
  odd,
  show,
  print
} from './base';

// Type

export {
  defines,
  dataType,
  type,
  typeCheck
} from './type';

// Eq

export {
  isEq,
  isNotEq
} from './eq';

// Ord

export {
  EQ,
  LT,
  GT,
  compare,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  max,
  min
} from './ord';

// Monoid

export {
  mempty,
  mappend,
  mconcat
} from './monoid';

// Foldable

export {
  fold,
  foldMap,
  foldr
} from './foldable';

// Traversable

export {
  traverse,
  mapM,
  sequence
} from './traversable';

// Functor

export {
  fmap,
  fmapReplaceBy
} from './functor';

// Applicative

export {
  pure,
  ap,
  apFlip,
  then,
  skip,
  liftA,
  liftA2
} from './applicative';

// Monad

export {
  inject,
  flatMap,
  chain,
  flatMapFlip,
  join,
  liftM,
  Do
} from './monad';

// Maybe

export {
  Nothing,
  just,
  maybe,
  isMaybe,
  isJust,
  isNothing,
  fromJust,
  fromMaybe,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe
} from './maybe';

// Tuple

export {
  unit,
  tuple,
  fst,
  snd,
  curry,
  uncurry,
  swap,
  isTuple,
  isUnit,
  fromArrayToTuple,
  fromTupleToArray
} from './tuple';

// List

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
  fromStringToList,
  map,
  reverse,
  intersperse,
  intercalate,
  transpose,
  foldl,
  concat,
  concatMap,
  scanl,
  scanr,
  listInf,
  listInfBy,
  iterate,
  repeat,
  replicate,
  cycle,
  take,
  drop,
  splitAt,
  takeWhile,
  dropWhile,
  span,
  spanNot,
  stripPrefix,
  group,
  groupBy,
  lookup,
  filter,
  index,
  elemIndex,
  elemIndices,
  find,
  findIndex,
  findIndices,
  zip,
  zip3,
  zipWith,
  zipWith3,
  nub,
  nubBy,
  deleteL,
  deleteLBy,
  deleteFirsts,
  deleteFirstsBy,
  sort,
  sortBy,
  mergeSort,
  mergeSortBy,
  insert,
  insertBy
} from './list';

// Error

export {
  error,
  throwError
} from './error';
