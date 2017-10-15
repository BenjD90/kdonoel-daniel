export class Kdo {
	public title: string;
	public description?: string;
	public status?: KdoState;
	public historic?: object[];
}

export type KdoState = 'FREE' | 'RESERVED' | 'BOUGHT';
