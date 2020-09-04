import { LineSegment } from "canvas/Geometry/LineSegment";
import { Point } from "canvas/Geometry/Point";
import { FaceFinder } from "canvas/Geometry/FaceFinder";
import { PatternPath } from "canvas/PatternPaths/PatternPath";
import { PatternPathType } from "canvas/Enums";

test("find the inside face of a triangle", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const triangle = [new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p2)]), 
                      new PatternPath(PatternPathType.Edge, [new LineSegment(p2, p3)]), 
                      new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p1)])];
    const reverseTriangle = [new PatternPath(PatternPathType.Edge, [new LineSegment(p2, p1)]), 
                            new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p2)]), 
                            new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p3)])];
    expect(FaceFinder.FindFaces(triangle)).toEqual([[0, 1, 2]]);
    expect(FaceFinder.FindFaces(reverseTriangle)).toEqual([[0, 1, 2]]);
});

test("find the inside faces of a split square", async () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(1, 0);
    const p3 = new Point(1, 1);
    const p4 = new Point(0, 1);
    const splitSquare = [new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p2)]), 
                         new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p2)]), 
                         new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p1)]), 
                         new PatternPath(PatternPathType.Edge, [new LineSegment(p3, p4)]), 
                         new PatternPath(PatternPathType.Edge, [new LineSegment(p1, p4)])];
    const result = FaceFinder.FindFaces(splitSquare);
    expect(result).toContainEqual([0, 1, 2]);
    expect(result).toContainEqual([2, 3, 4]);
    expect(result).toHaveLength(2);
});