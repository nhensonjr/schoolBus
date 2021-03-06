import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppState} from './models/app-state.model';
import {BackendService} from './backend.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <div><h1>{{title}}</h1></div>
      <div class="header-buttons">
        <i (click)="toggleSettings()" class="w3-xlarge fa fa-cog cursor"></i>
      </div>
    </div>

    <div class="body">
      <div *ngIf="currentState" class="saving-target">
        <h1>Goal: \${{currentState.totalSaved}}/\${{currentState.savingsGoal}}</h1>
      </div>

      <div class="image-slider">
        <div class="fill" [style.width.%]="percentageSaved">
          <img src="../assets/color_bus.png"/>
        </div>
        <img src="../assets/white_bus.png"/>
      </div>

      <div class="add-money-container">
        <div class="w3-container modal-content">
          <div class="center"><i class="w3-xlarge fa fa-dollar w3-text-green"></i></div>
          <div class="funds-to-add-input center-input">
            <input class="w3-input w3-border" type="text" [formControl]="fundsToAdd" placeholder="$0.00">
          </div>
          <div (click)="updateTotalSaved()" class="center">
            <i class="w3-xlarge fa fa-check-square w3-hover-text-green"></i>
          </div>
        </div>
      </div>

      <div [ngClass]="showSettings ? 'w3-modal show' : 'hide'">
        <div class="w3-modal-content w3-card-4">
          <header class="modal-header w3-green">
            <div class="w3-container"><h3>Settings</h3></div>
            <div (click)="toggleSettings()" class="w3-container cursor">X</div>
          </header>
          <div class="w3-container modal-content content-section">
            <div class="savings-goal-input">
              <div class="center">
                <i class="w3-xlarge fa fa-dollar w3-text-green"></i>
              </div>
              <div class="center-input">
                <input class="w3-input w3-border" type="text" [formControl]="goalToSet" placeholder="Savings Goal">
              </div>
              <div (click)="updateSavingsGoal()" class="center">
                <i class="w3-xlarge fa fa-check-square w3-hover-text-green"></i>
              </div>
            </div>
            <div class="transactions table-height" *ngIf="currentState">
              <table>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
                <tr *ngFor="let tran of currentState.transactions">
                  <td>{{getAmountFromTransaction(tran)}}</td>
                  <td>{{getDateFromTransaction(tran)}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Bus Fund';
  fundsToAdd = new FormControl();
  goalToSet = new FormControl();
  showSettings = false;
  currentState: AppState;

  constructor(private backendService: BackendService) {
  }

  ngOnInit() {
    this.backendService.getCurrentState().subscribe(response => {
      console.log('response: ', response);
      this.currentState = response;
    });
  }

  get percentageSaved() {
    return this.currentState ? ((this.currentState.totalSaved / this.currentState.savingsGoal) * 100) : 0;
  }

  getAmountFromTransaction(transaction: string): string {
    return transaction.split('|')[0];
  }

  getDateFromTransaction(transaction: string): string {
    return transaction.split('|')[1];
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  updateTotalSaved() {
    if (isNaN(this.fundsToAdd.value) || this.fundsToAdd.value === null || this.fundsToAdd.value === '') {
      console.log('Yikes! That isn\'t a number friend.');
      this.fundsToAdd.setValue(null);
    } else {
      const totalSaved = this.currentState.totalSaved += +this.fundsToAdd.value;
      this.currentState.transactions.push(this.createTransaction());
      if (totalSaved >= 0) {
        console.log('Keep saving that cheddar!');
        this.backendService.updateState(this.currentState);
      } else {
        console.log('Had to zero that out for ya.');
        this.currentState.totalSaved = 0;
        this.backendService.updateState(this.currentState);
      }
      this.fundsToAdd.setValue(null);
    }
  }

  updateSavingsGoal() {
    if (isNaN(this.goalToSet.value) || this.goalToSet.value === null || this.goalToSet.value === '') {
      console.log('Yikes! That isn\'t a number friend.');
      this.goalToSet.setValue(null);
    } else {
      console.log('Keep saving that cheddar!');
      const savingsGoal = this.currentState.savingsGoal = +this.goalToSet.value;
      if (savingsGoal >= 0) {
        console.log('Sweet goal bro!');
        this.backendService.updateState(this.currentState);
      } else {
        console.log('Had to zero that out for ya.');
        this.currentState.savingsGoal = 0;
        this.backendService.updateState(this.currentState);
      }
      this.goalToSet.setValue(null);
      this.toggleSettings();
    }
  }

  createTransaction(): string {
    return this.fundsToAdd.value.toString() + '|' + new Date().toDateString();
  }
}
