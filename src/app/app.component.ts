import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppState} from './app-state.model';
import {BackendService} from './backend.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <div><h1>{{title}}</h1></div>
      <div class="header-buttons">
        <div>
          <i (click)="toggleSettings()" class="fa fa-gears settings"></i>
        </div>
      </div>
    </div>

    <div class="body">
      <div *ngIf="currentState" class="saving-target">
        <h1>Goal: {{currentState.totalSaved}}/{{"$" + currentState.savingsGoal}}</h1>
      </div>

      <div class="image-slider">
        <div class="fill" [style.width.%]="percentageSaved">
          <img src="../assets/color_bus.png"/>
        </div>
        <img src="../assets/white_bus.png"/>
      </div>

      <div class="add-money-container">
        <div (click)="updateTotalSaved()" class="w3-green w3-hover-grey w3-margin-right add-money-button">ADD MONEY</div>
        <input class="w3-input" type="text" [formControl]="fundsToAdd" placeholder="enter amount here">
      </div>

      <div [ngClass]="showSettings ? 'w3-modal show' : 'hide'">
        <div class="w3-modal-content w3-card-4">
          <header class="modal-header w3-green">
            <div class="w3-container"><h3>Settings</h3></div>
            <div (click)="toggleSettings()" class="w3-container settings">X</div>
          </header>
          <div class="w3-container modal-content">
            <div class="w3-margin"><i class="w3-xxlarge fa fa-dollar"></i></div>
            <div class="w3-margin savings-goal-input">
              <input class="w3-input w3-border" type="text" [formControl]="goalToSet" placeholder="Savings Goal">
            </div>
            <div (click)="updateSavingsGoal()" class="w3-margin"><i class="w3-xxlarge fa fa-check-square w3-hover-text-green"></i></div>
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
  addMoney = false;
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

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  toggleAddMoney() {
    this.addMoney = !this.addMoney;
  }

  updateTotalSaved() {
    if (isNaN(this.fundsToAdd.value) || this.fundsToAdd.value === null || this.fundsToAdd.value === '') {
      console.log('Yikes! That isn\'t a number friend.');
      this.fundsToAdd.setValue(null);
    } else {
      const totalSaved = this.currentState.totalSaved += +this.fundsToAdd.value;
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
}
