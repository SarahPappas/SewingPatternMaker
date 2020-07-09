import { PatternPathType } from './Enums';

const PatternPathColor: Map<PatternPathType, string> = new Map();
PatternPathColor.set(PatternPathType.Edge, '#F2E74B');
PatternPathColor.set(PatternPathType.Fold, '#84BFA4');
PatternPathColor.set(PatternPathType.Seam, '#248EA6');

export { PatternPathColor };