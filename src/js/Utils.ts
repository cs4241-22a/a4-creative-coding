import {Vector3} from "babylonjs";

export function distance(a: Vector3, b: Vector3): number {
	return a.subtract(b).length();
}

/**
 * Return a `Vector3` whose magnitude is clamped to the upper bound of `limit`. The vector itself is not affected.
 * @param v Input vector to clamp
 * @param limit The maximum magnitude for the vector
 * @return The resulting clamped `Vector3`.
 */
export function limit(v: Vector3, limit: number): Vector3 {
	return v.normalize().scale(Math.max(limit, v.length()))
}