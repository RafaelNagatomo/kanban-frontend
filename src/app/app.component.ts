import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from './component/layout/header/header.component'
import { FooterComponent } from './component/layout/footer/footer.component'
import { DragDropModule } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    DragDropModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'kanban-frontend'
}
