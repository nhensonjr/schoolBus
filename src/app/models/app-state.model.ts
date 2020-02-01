export class AppState {
  savingsGoal: number;
  totalSaved: number;
  transactions: string[];

  constructor(savingsGoal: number, totalSaved: number, transactions: string[]) {
    this.savingsGoal = savingsGoal;
    this.totalSaved = totalSaved;
    this.transactions = transactions;
  }
}
