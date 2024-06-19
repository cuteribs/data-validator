export type Nullable<T> = T | null | undefined;

export type Dictionary = Record<string, Nullable<any>>;

export function isNumber(value: Nullable<string>): boolean {
	const str = value ?? '';
	return !isNaN(parseFloat(str)) && isFinite(Number(str));
}
