/**
 * Utility functions
 * @module utils
 */
import { Point } from './point.js';

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

export function substract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function scale(p, factor) {
    return new Point(p.x * factor, p.y * factor);
}

// convert the function to its name string
// eg. function foo(){} -> "foo"
export function getFunctionName(func) {
    return func.name;
}

export function bindFunctionToElement(func, elementId = getFunctionName(func), eventName = "click") {
    const element = document.getElementById(elementId);
    element.addEventListener(eventName, func);
}