export function isEmptyObject(obj: object | null | undefined): boolean {
    return obj ? Object.keys(obj).length === 0 : true;
}
