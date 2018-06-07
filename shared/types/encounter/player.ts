export interface Player {
	_id: number;
	name: string;
	tokenUrl: string;
	maxHp: number;
	hp: number;
	speed: number;
	location: Object;
}