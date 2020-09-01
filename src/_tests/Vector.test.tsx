import { Vector } from "canvas/Geometry/Vector"

test("norm should return the length of a vector", async () => {
    const v1 = new Vector(0, 0);
    expect(v1.norm()).toEqual(0);

    const v2 = new Vector(-3, 4);
    expect(v2.norm()).toEqual(5);
});

test("normalize should scale a vector to become of norm 1", async () => {
    const v0 = new Vector(0, 0);
    expect(() => v0.normalize()).toThrow();
    
    const v1 = new Vector(2, -4);
    v1.normalize();
    expect(v1.norm()).toBeCloseTo(1, 10);
});

test("multiplyByScalar", async () => {
    const v1 = new Vector(3, -1);
    v1.multiplyByScalar(3);
    expect(v1.x).toEqual(9);
    expect(v1.y).toEqual(-3);
});

test("getAngle should return the angle between the vector and the positive x axis", async () => {
    const v1 = new Vector(0, 0);
    expect(v1.getAngle()).toEqual(0);

    const v2 = new Vector(1, 0);
    expect(v2.getAngle()).toEqual(0);

    const v3 = new Vector(14, 14);
    expect(v3.getAngle()).toEqual(Math.PI / 4);

    const v4 = new Vector(-1, 1);
    expect(v4.getAngle()).toEqual(3 * Math.PI / 4);

    const v5 = new Vector(-1, 0);
    expect(v5.getAngle()).toEqual(Math.PI);

    const v6 = new Vector(-1, -1);
    expect(v6.getAngle()).toEqual(-3 * Math.PI / 4);
});

test("changeInAngle should return the change in angle from one vector to the next, choosing an angle in ]-PI, PI]", async () => {
    const v1 = new Vector(1, -1);
    const v2 = new Vector(1, 1);
    expect(Vector.changeInAngle(v1, v2)).toEqual(Math.PI / 2);
    expect(Vector.changeInAngle(v2, v1)).toEqual(-Math.PI / 2);

    const v3 = new Vector(-1, -1);
    expect(Vector.changeInAngle(v2, v3)).toEqual(Math.PI);
    expect(Vector.changeInAngle(v3, v2)).toEqual(Math.PI);

    const v4 = new Vector(17, -17);
    expect(Vector.changeInAngle(v1, v4)).toEqual(0);
});

test("findPerpVector should return that is at a +PI / 2 angle from the inputted vector", async () => {
    const v1 = new Vector(1, 0);
    const v1perp = Vector.findPerpVector(v1);
    expect(v1perp.x === 0).toBeTruthy();
    expect(v1perp.y === 1).toBeTruthy();
    expect(Vector.changeInAngle(v1, v1perp)).toEqual(Math.PI / 2);

    const v2 = new Vector(0, 0);
    const v2perp = Vector.findPerpVector(v2);
    expect(v2perp.x === 0).toBeTruthy();
    expect(v2perp.y === 0).toBeTruthy();
});

test("find opposite should return a vector that is opposite direction and of equal length", async () => {
    const v1 = new Vector(5, -2);

    expect(Vector.changeInAngle(Vector.findOpposite(v1), v1)).toEqual(Math.PI);
    expect(Vector.findOpposite(v1).norm()).toEqual(v1.norm());
});