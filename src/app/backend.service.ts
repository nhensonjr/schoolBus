import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AppState} from './app-state.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private db: AngularFirestore) {
  }

  getCurrentState(): Observable<AppState> {
    return this.db.collection('appState').doc('currentState').valueChanges() as Observable<AppState>;
  }

  updateState(newState: AppState): void {
    this.db.collection('appState').doc('currentState').update(
      {
        savingsGoal: newState.savingsGoal,
        totalSaved: newState.totalSaved
      }
    );
  }
}
