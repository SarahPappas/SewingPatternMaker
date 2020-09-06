import { PatternPath } from "./PatternPath";
import { Point } from "canvas/Geometry/Point";
import { Segment } from "canvas/Geometry/Segment";
import { LineSegment } from "canvas/Geometry/LineSegment";
import { PatternPathType } from "canvas/Enums";

export class AllowanceFinder {
    static FindAllowance = (path: PatternPath, allowanceSize: number): PatternPath => {
        if (path.getType() === PatternPathType.Allowance) {
            throw new Error("Cannot find the allowance of an allowance.");
        }
        
        // Get the path that is offset from this one
        let offsetSegments: Segment[] = [];
        path.getSegments().forEach(segment => {
            offsetSegments = offsetSegments.concat(segment.getOffsetSegments(allowanceSize));
        });
        const lengthOfLineSegmentProlongations = 200;
    
        // Add a line segment at the beginning of the offset path,
        // following the tangent of the offset at that point  
        const firstSegment = offsetSegments[0];      
        const p1 = firstSegment.getStart();
        const p2 = Point.translate(p1, firstSegment.getTangent(0).normalize().multiplyByScalar(-1 * lengthOfLineSegmentProlongations));
        
        // Add a line segment at the end of the offset path,
        // following the tangent of the offset at that point
        const lastSegment = offsetSegments[offsetSegments.length - 1];
        const q1 = lastSegment.getEnd();
        const q2 = Point.translate(q1, lastSegment.getTangent(1).normalize().multiplyByScalar(lengthOfLineSegmentProlongations));
        
        let result: Segment[] = [new LineSegment(p2, p1)];
        result = result.concat(offsetSegments);
        result.push(new LineSegment(q1, q2));
        return new PatternPath(PatternPathType.Allowance, result);
    };
}