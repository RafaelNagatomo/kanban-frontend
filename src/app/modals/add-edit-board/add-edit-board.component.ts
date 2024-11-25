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
    const CREATE_BOARD_MUTATION = `
      mutation CreateBoard($data: CreateBoardInput!) {
        createBoard(data: $data) {
          id
          name
          description
          userId
          createdBy
        }
      }
    `
    const { name, description } = this.boardForm.value
    const newBoard = {
      name: name,
      description: description,
      userId: 3,
      createdBy: 3
    }

    if (this.boardForm.invalid) return

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
