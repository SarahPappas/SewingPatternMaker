import { Point } from "canvas/Geometry/Point";

test("clone", async () => {
    const p1 = new Point(2, 3);
    const p2 = p1.clone();

    expect(p2.equals(p1)).toBeTruthy();
    expect(p2 === p1).toBeFalsy();
});