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

export function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

export function magnitude(p) {
    return Math.hypot(p.x, p.y);
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

export function translate(loc, angle, offset) {
    const dx = offset * Math.cos(angle);
    const dy = offset * Math.sin(angle);
    return new Point(loc.x + dx, loc.y + dy);
}

export function angle(p) {
    return Math.atan2(p.y, p.x);
}

export function getIntersection(A,B,C,D){
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const eps = 0.0001;
    if(Math.abs(bottom) > eps){
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    } // parallel lines
    return null;
}

export function lerp(A, B, t){
    return A + (B - A) * t;
}

export function average(p1, p2){
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function dot(p1, p2){
    return p1.x * p2.x + p1.y * p2.y;
}

export function lerp2D(A, B, t){
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

export function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(substract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}