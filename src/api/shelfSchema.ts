export namespace ShelfSchema {
  export interface Item {
    kind?: string;
    id?: number;
    selfLink?: string;
    title?: string;
    access?: string;
    updated?: Date;
    created?: string;
    volumeCount?: number;
    volumesLastUpdated?: Date;
  }

  export interface RootObject {
    kind?: string;
    items?: Item[];
  }
}
