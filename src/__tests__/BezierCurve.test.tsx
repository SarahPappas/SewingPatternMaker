import { BezierCurve } from "canvas/Geometry/BezierCurve";
import { Point } from "canvas/Geometry/Point";

test("splitting bezier curve", async () => {
    const curve = new BezierCurve(new Point(0, 0), new Point(2, 0), new Point(1, 2));

    const parts = curve.split(new Point(1, 1));
    expect(parts[0].getStart()).toEqual(curve.getStart());
    expect(parts[0].getEnd()).toEqual(parts[1].getStart());
    expect(parts[1].getEnd()).toEqual(curve.getEnd());

});