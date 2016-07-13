/**
 * maryamyriameliamurphies.js
 * A library of Haskell-style morphisms ported to ES2015 JavaScript.
 *
 * index.js
 *
 * @file Top level index.
 * @license ISC
 */

/** @module maryamyriameliamurphies */

export {
  defines,
  dataType,
  type,
  typeCheck
} from './type';

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

export {
  isEq,
  isNotEq
} from './eq';

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

export {
  mempty,
  mappend,
  mconcat
} from './monoid';

export {
  fmap,
  fmapReplaceBy
} from './functor';

export {
  pure,
  ap,
  apFlip,
  then,
  skip,
  liftA,
  liftA2,
  liftA3
} from './applicative';

export {
  inject,
  bind,
  chain,
  bindFlip,
  join,
  liftM,
  Do
} from './monad';

export {
  fold,
  foldMap,
  foldr
} from './foldable';

export {
  traverse,
  mapM,
  sequence
} from './traversable';

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

export {
  error,
  throwError
} from './error';
