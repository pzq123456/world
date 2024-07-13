export function getNearestPoint(point, points, threshold = 10) {
    let nearest = null;
    let minDist = threshold;
    for (const p of points) {
        const dist = distance(point, p);
        if (dist < minDist) {
            nearest = p;
            minDist = dist;
        }
    }
    return nearest;
}

export function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}