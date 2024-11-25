import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { IBoard } from '../../shared/interfaces/board.interface'
import { CREATE_BOARD_MUTATION } from '../../shared/commands/board.commands'

@Component({
  selector: 'add-edit-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-edit-board.component.html',
  styleUrl: './add-edit-board.component.sass'
})
export class AddEditBoardComponent {
  @Input() isEdit: boolean = false
  @Input() isOpen: boolean = false
  @Output() modalClosed = new EventEmitter()
  @Output() newBoardAdd = new EventEmitter()
  boardForm!: FormGroup
  errorMessage: string = ''

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.boardForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('')
    })
  }

  get errors() {
    return {
      name: this.boardForm.get('name')?.errors,
    };
  }

  closeModal() {
    this.isOpen = false
    this.modalClosed.emit()
  }

  submitForm() {
    if (this.boardForm.invalid) return

    const { name, description } = this.boardForm.value
    const newBoard: IBoard = {
      name: name,
      description: description,
      userId: 3,
      createdBy: 3
    }
    this.graphqlService.mutate(CREATE_BOARD_MUTATION, { data: newBoard }).subscribe({
      next: (result) => {
        if(result) {
          this.closeModal()
          this.newBoardAdd.emit(newBoard)
        } else {
          console.error('Falha ao criar projeto')
        }
      },
      error: (error) => {
        console.error('Não foi possível concluir o registro:', error)
        this.errorMessage = String(error)
      },
    })
  }
}
