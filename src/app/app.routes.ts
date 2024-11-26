import { Routes } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { BoardDetailsComponent } from './component/board-details/board-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'board/:id', component: BoardDetailsComponent}
];
