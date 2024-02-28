// Define a common sub-schema for move data
export interface IMoveData {
  move: string;
  description?: string;
  hitLevel?: string;
  damage?: string[];
  startUpFrame?: string;
  blockFrame?: string;
  hitFrame?: string;
  counterHitFrame?: string;
  notes?: string;
}
