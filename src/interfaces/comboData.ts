// Define a common sub-schema for combo data
export interface IComboData {
  comboStarters: string[];
  comboRoute: string;
  difficulty: 'Easy' | 'Intermediate' | 'Difficult';
}
