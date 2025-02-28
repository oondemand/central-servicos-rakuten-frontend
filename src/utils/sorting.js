export const stateToSortBy = (sorting) => {
  if (!sorting || sorting.length == 0) return undefined;

  const sort = sorting[0];

  return `${sort.id}.${sort.desc ? "desc" : "asc"}`;
};

export const sortByToState = (sortBy) => {
  if (!sortBy) return [];

  const [id, desc] = sortBy.split(".");
  return [{ id, desc: desc === "desc" }];
};
