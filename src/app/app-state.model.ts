export class AppState {
  savingsGoal: number;
  totalSaved: number;

  constructor(savingsGoal: number, totalSaved: number) {
    this.savingsGoal = savingsGoal;
    this.totalSaved = totalSaved;
  }
}
