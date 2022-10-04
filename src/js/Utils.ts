import {Vector3} from "babylonjs";

export function distance(a: Vector3, b: Vector3): number {
	return a.subtract(b).length();
}