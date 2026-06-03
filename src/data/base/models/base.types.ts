export interface DatasResource<T> {
    items: T[];
    total: number;
}

export type ModalizeHelperVisible = {
    open: () => void,
    close: () => void,
}
