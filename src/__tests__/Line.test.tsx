import { Point } from "canvas/Geometry/Point";
import { Line } from "canvas/Geometry/Line";

test("a line segment should have a different start and end", async () => {
    const p = new Point(3, 4);
    expect(() => new Line(p, p)).toThrow();
});