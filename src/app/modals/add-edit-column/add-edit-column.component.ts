import { CommonModule } from '@angular/common';
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
import { IColumn } from '../../shared/interfaces/column.interface'
import {
  CREATE_COLUMN_MUTATION,
  UPDATE_COLUMN_MUTATION
} from '../../shared/commands/column.commands'
import { ActivatedRoute } from '@angular/router'
import { ColumnService } from '../../shared/services/column.services'

@Component({
  selector: 'app-add-edit-column',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-column.component.html',
  styleUrl: './add-edit-column.component.sass'
})
export class AddEditColumnComponent {
  @Input() isOpen: boolean = false
  @Input() isEdit: boolean = false
  @Input() columnData: IColumn = {}
  @Output() emitModalClosed = new EventEmitter()
  @Output() upsertRenderColumn = new EventEmitter()
  columnForm!: FormGroup
  errorMessage: string = ''
  boardId?: number

  constructor(
    private graphqlService: GraphqlService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private columnService: ColumnService,
  ) {
    this.columnForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const boardIdByParams = +this.route.snapshot.params['id']!
    if (boardIdByParams) {
      this.boardId = boardIdByParams
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columnData'] && this.columnData) {
      this.columnForm.patchValue({
        name: this.isEdit ? this.columnData.name : '',
      });
    }
  }

  get errors() {
    return {
      name: this.columnForm.get('name')?.errors,
    };
  }

  closeModal() {
    this.isOpen = false
    this.emitModalClosed.emit()
  }

  onCreateForm() {
    if (this.columnForm.invalid) return

    const { name } = this.columnForm.value
    const data: IColumn = {
      name: name,
      boardId: this.boardId,
      createdBy: 3
    }
    this.graphqlService.mutate(CREATE_COLUMN_MUTATION, { data: data }).subscribe({
      next: (result) => {
        if(result) {
          this.closeModal()
          this.columnService.upsertRenderColumn(result.data)
        } else {
          console.error('Falha ao criar coluna')
        }
      },
      error: (error) => {
        console.error('Não foi possível concluir o registro:', error)
        this.errorMessage = String(error)
      },
    })
  }

  onUpdateForm() {
    if (this.columnForm.invalid) return

    const { name } = this.columnForm.value
    const data: IColumn = {
      id: this.columnData.id,
      name: name,
      updatedBy: 3
    }
    this.graphqlService.mutate(UPDATE_COLUMN_MUTATION, { id: data.id, data: data }).subscribe({
      next: (result) => {
        if(result) {
          this.closeModal()
          this.columnService.upsertRenderColumn(result.data)
        } else {
          console.error('Falha ao atualizar coluna')
        }
      },
      error: (error) => {
        console.error('Não foi possível concluir a operação:', error)
        this.errorMessage = String(error)
      },
    })
  }
}
