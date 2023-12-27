export interface Filtering {
  property: string;
  rule: string;
  value: string;
}

export interface FilteringV2 {
  [key: string]: string;
}
