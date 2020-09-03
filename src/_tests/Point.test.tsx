import { Point } from "canvas/Geometry/Point";

test("clone", async () => {
    const p1 = new Point(2, 3);
    const p2 = p1.clone();

    expect(p2.equals(p1)).toBeTruthy();
    expect(p2 === p1).toBeFalsy();

    const p3 = new Point(Math.PI, Math.sqrt(2));
    const p4 = new Point(Math.PI * Math.sqrt(2) * Math.sqrt(2) / 2, Math.sqrt(2) * Math.PI / Math.PI);

    expect(p3.equals(p4)).toBeTruthy();
    expect(p3 === p4).toBeFalsy();
});