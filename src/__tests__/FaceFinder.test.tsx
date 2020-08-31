import { Line } from "canvas/Geometry/Line";
import { Point } from "canvas/Geometry/Point";
import { FaceFinder } from "canvas/Geometry/FaceFinder";

test("a triangle has 1 face", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const triangle = [new Line(p1, p2), new Line(p2, p3), new Line(p3, p1)];
    expect(FaceFinder.FindFaces(triangle)).toEqual([[0, 2, 1]]);
});

test("a split square has 2 faces", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const p4 = new Point(0, 1);
    const splitSquare = [new Line(p1, p2), new Line(p3, p2), new Line(p3, p1), new Line(p1, p4), new Line(p3, p4)];
    const result = FaceFinder.FindFaces(splitSquare);
    expect(result).toContainEqual([0, 2, 1]);
    expect(result).toContainEqual([2, 3, 4]);
    expect(result).toHaveLength(2);
});