export function distance(a, b) {
    return a.subtract(b).length();
}
/**
 * Return a `Vector3` whose magnitude is clamped to the upper bound of `limit`. The vector itself is not affected.
 * @param v Input vector to clamp
 * @param limit The maximum magnitude for the vector
 * @return The resulting clamped `Vector3`.
 */
export function limit(v, limit) {
    return v.normalize().scale(Math.max(limit, v.length()));
}
