export interface PlayerData {
	_id: string;
	name: string;
	tokenUrl: string;
	maxHp: number;
	hp: number;
	speed: number;
	location: {x: number, y: number};
}