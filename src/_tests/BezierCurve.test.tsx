import { BezierCurve } from "canvas/Geometry/BezierCurve";
import { Point } from "canvas/Geometry/Point";

test("splitting bezier curve", async () => {
    const curve = new BezierCurve(new Point(0, 0), new Point(20, 0), new Point(10, 20));

    const parts = curve.split(new Point(10, 10));
    expect(parts[0].getStart().equals(curve.getStart())).toBeTruthy();
    expect(parts[0].getEnd().equals(parts[1].getStart())).toBeTruthy();
    expect(parts[1].getEnd().equals(curve.getEnd())).toBeTruthy();

});