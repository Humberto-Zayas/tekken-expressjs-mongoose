// Define a common sub-schema for combo data
export interface IComboData {
  comboStarters: string[];
  comboRoute: string;
  difficulty: 'Easy' | 'Intermediate' | 'Difficult';
  type: 'Normal' |'Counter Hit' | 'Heat Dash' | 'Wall Ender' | 'Wall Tornado';
  notes: string;
}
