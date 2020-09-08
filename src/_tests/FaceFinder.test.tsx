import { LineSegment } from "canvas/Geometry/LineSegment";
import { Point } from "canvas/Geometry/Point";
import { FaceFinder } from "canvas/Geometry/FaceFinder";
import { PatternPath } from "canvas/PatternPaths/PatternPath";
import { PatternPathType } from "canvas/Enums";

test("find the inside face of a triangle", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const p1p2 = new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p2)]);
    const p2p3 = new PatternPath(PatternPathType.Edge, [new LineSegment(p2, p3)]);
    const p3p1 = new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p1)]);
    const triangle = [p1p2, p2p3, p3p1];
    let faces = FaceFinder.FindFaces(triangle);
    expect(faces.length).toEqual(1);
    expect(faces[0][0].equals(p1p2)).toBeTruthy();
    expect(faces[0][1].equals(p2p3)).toBeTruthy();
    expect(faces[0][2].equals(p3p1)).toBeTruthy();

    const reverseTriangle = [p1p2.reversedClone(), p2p3.reversedClone(), p3p1.reversedClone()];
    faces = FaceFinder.FindFaces(reverseTriangle);
    expect(faces).toHaveLength(1);
    expect(faces[0][0].equals(p1p2)).toBeTruthy();
    expect(faces[0][1].equals(p2p3)).toBeTruthy();
    expect(faces[0][2].equals(p3p1)).toBeTruthy();
});

test("find the inside faces of a split square", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const p4 = new Point(0, 1);
    const p1p2 = new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p2)]);
    const p3p2 = new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p2)]);
    const p3p1 = new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p1)]);
    const p3p4 = new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p4)]);
    const p1p4 = new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p4)]);
    const splitSquare = [p1p2, p3p2, p3p1, p3p4, p1p4];
    const faces = FaceFinder.FindFaces(splitSquare);
    expect(faces).toHaveLength(2);
    expect(faces[0][0].equals(p1p2)).toBeTruthy();
    expect(faces[0][1].equals(p3p2.reversedClone())).toBeTruthy();
    expect(faces[0][2].equals(p3p1)).toBeTruthy();
    expect(faces[1][0].equals(p3p1.reversedClone())).toBeTruthy();
    expect(faces[1][1].equals(p3p4)).toBeTruthy();
    expect(faces[1][2].equals(p1p4.reversedClone())).toBeTruthy();
});