export interface DynamicKeyValue<T> {
	[key: string]: T;
}

export declare type DynamicObject = DynamicKeyValue<any>;
