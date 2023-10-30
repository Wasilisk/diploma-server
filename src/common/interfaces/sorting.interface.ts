export interface Sorting {
  property: string;
  direction: SortingDirection;
}

export type SortingDirection = 'desc' | 'asc';
