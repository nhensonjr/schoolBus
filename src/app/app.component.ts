import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <div>{{title}}</div>
      <div class="header-buttons">
        <div>
          <i (click)="toggleAddMoney()" class="fa fa-plus settings"></i>
        </div>
        <div>
          <i (click)="toggleSettings()" class="fa fa-gears settings"></i>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="saving-target">
        <h1>Savings Goal: {{"$" + savingsGoal}}</h1>
        <h1></h1>
      </div>

      <div class="image-slider">
        <div class="fill" [style.width.%]="percentageSaved">
          <img src="../assets/filledBus.png"/>
        </div>
        <img src="../assets/emptyBus.png"/>
      </div>

      <div class="add-money-container">
        <div (click)="totalUpMoney()" class="w3-green w3-hover-grey w3-margin-right add-money-button">ADD MONEY</div>
        <input class="w3-input" type="text" [formControl]="fundsToAdd">
      </div>

      <div [ngClass]="showSettings ? 'w3-modal show' : 'hide'">
        <div class="w3-modal-content w3-card-4">
          <header class="modal-header w3-green">
            <div class="w3-container"><h3>Settings</h3></div>
            <div (click)="toggleSettings()" class="w3-container settings">X</div>
          </header>
          <div class="w3-container">
            <p>Some text..</p>
            <p>Some text..</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      FOOTER
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bus Fund';
  fundsToAdd = new FormControl(0.00);
  totalSaved = 0.00;
  savingsGoal = 10000.00;
  showSettings = false;
  addMoney = false;

  get percentageSaved() {
    return ((this.totalSaved / this.savingsGoal) * 100);
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  toggleAddMoney() {
    this.addMoney = !this.addMoney;
  }

  totalUpMoney() {
    console.log(this.totalSaved);
    this.totalSaved += this.fundsToAdd.value;
    console.log(this.totalSaved);
  }
}
