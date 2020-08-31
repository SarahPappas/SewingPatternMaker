import { Point } from "canvas/Geometry/Point";
import { Line } from "canvas/Geometry/Line";
import { Vector } from "canvas/Geometry/Vector";

test("a line segment should have a different start and end", async () => {
    const p1 = new Point(3, 4);
    const p2 = new Point(3, 4);
    expect(() => new Line(p1, p2)).toThrow();
});

test("get length of a line", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    const l = new Line(p1, p2);
    expect(l.getLength()).toEqual(5);
});

test("get tangent", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    const l = new Line(p1, p2);

    expect(() => l.getTangent(-0.2)).toThrow();
    expect(() => l.getTangent(1.2)).toThrow();
    expect(Vector.changeInAngle(Vector.vectorBetweenPoints(p1, p2), l.getTangent(0))).toEqual(0);
    expect(Vector.changeInAngle(Vector.vectorBetweenPoints(p1, p2), l.getTangent(0.75))).toEqual(0);
});

test("split", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(6, 8);
    const l = new Line(p1, p2);
    const lines = l.split(new Point(3, 4));

    expect(lines[0].getStart()).toEqual(l.getStart());
    expect(lines[1].getEnd()).toEqual(l.getEnd());
    expect(lines[0].getEnd()).toEqual(lines[1].getStart());
    expect(lines[0].getLength() + lines[1].getLength()).toEqual(l.getLength());
});

test("is point near segment", async () => {
    const l = new Line(new Point(0, 0), new Point(6, 8));
    const p1 = new Point(0, 0);
    const p2 = new Point(6, 8);
    const p3 = new Point(3, 4);
    const p4 = new Point(3.1, 4);
    const p5 = new Point(-0.1, 0);
    const p6 = new Point(6.1, 8);
    const p7 = new Point(3, 5);

    expect(l.isPointNearSegment(p1, 0.1)).toEqual(p1);
    expect(l.isPointNearSegment(p2, 0.1)).toEqual(p2);
    expect(l.isPointNearSegment(p3, 0.1)?.equals(p3)).toBeTruthy();
    expect(l.isPointNearSegment(p4, 0.1)).toBeTruthy();
    expect(l.isPointNearSegment(p5, 0.1)).toBeFalsy();
    expect(l.isPointNearSegment(p6, 0.1)).toBeFalsy();
    expect(l.isPointNearSegment(p7, 0.1)).toBeFalsy();
});

test("find intersection point of two lines", async () => {
    // parallel segments
    let p1 = new Point(0, 0);
    let p2 = new Point(3, 4);
    let p3 = new Point(2, 0);
    let p4 = new Point(5, 4);
    let l1 = new Line(p1, p2);
    let l2 = new Line(p3, p4);
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, false)).toBeNull();
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, true)).toBeNull();

    // segments that meet
    p1 = new Point(0, 0);
    p2 = new Point(2, 4);
    p3 = new Point(0, 3);
    p4 = new Point(3, 0);
    let i = new Point(1, 2);
    l1 = new Line(p1, p2);
    l2 = new Line(p3, p4);
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, false)?.equals(i)).toBeTruthy();
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, true)?.equals(i)).toBeTruthy();

    // segments don't meet but lines do
    p1 = new Point(0, 0);
    p2 = new Point(2, 4);
    p3 = new Point(3, 0);
    p4 = new Point(6, -3);
    i = new Point(1, 2);
    l1 = new Line(p1, p2);
    l2 = new Line(p3, p4);
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, false)?.equals(i)).toBeTruthy();
    expect(Line.findIntersectionPointOfTwoLines(l1, l2, true)).toBeNull();
});