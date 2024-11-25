import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { GraphqlService } from '../../shared/graphql/graphql.service'
import { IBoard } from '../../shared/interfaces/board.interface'
import {
  CREATE_BOARD_MUTATION,
  UPDATE_BOARD_MUTATION
} from '../../shared/commands/board.commands'

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
  @Input() boardData: IBoard = {}
  @Output() modalClosed = new EventEmitter()
  @Output() upsertRenderBoard = new EventEmitter()
  boardForm!: FormGroup
  errorMessage: string = ''

  constructor(private graphqlService: GraphqlService, private fb: FormBuilder) {
    this.boardForm = this.fb.group({
      name: [''],
      description: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardData'] && this.boardData) {
      this.boardForm.patchValue({
        name: this.isEdit ? this.boardData.name : '',
        description: this.isEdit ? this.boardData.description : '',
      });
    }
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

  onCreateForm() {
    if (this.boardForm.invalid) return

    const { name, description } = this.boardForm.value
    const data: IBoard = {
      name: name,
      description: description,
      userId: 3,
      createdBy: 3
    }
    this.graphqlService.mutate(CREATE_BOARD_MUTATION, { data: data }).subscribe({
      next: (result) => {
        if(result) {
          this.closeModal()
          this.upsertRenderBoard.emit(data)
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

  onUpdateForm() {
    if (this.boardForm.invalid) return

    const { name, description } = this.boardForm.value
    const data: IBoard = {
      id: this.boardData.id,
      name: name,
      description: description,
      updatedBy: 3
    }
    this.graphqlService.mutate(UPDATE_BOARD_MUTATION, { id: data.id, data: data }).subscribe({
      next: (result) => {
        if(result) {
          this.closeModal()
          this.upsertRenderBoard.emit(data)
        } else {
          console.error('Falha ao atualizar projeto')
        }
      },
      error: (error) => {
        console.error('Não foi possível concluir a operação:', error)
        this.errorMessage = String(error)
      },
    })
  }
}
