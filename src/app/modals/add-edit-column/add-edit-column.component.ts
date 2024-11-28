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
import { IColumn } from '../../shared/interfaces/column.interface'
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

  async onCreateForm(): Promise<void> {
    if (this.columnForm.invalid) return
    const { name } = this.columnForm.value
    const columnData: IColumn = {
      name: name,
      boardId: this.boardId,
      createdBy: 3
    }
    try {
      const result = await this.columnService.createColumn(columnData)
      if (result) {
        this.closeModal()
      } else {
        console.error('Falha ao criar coluna')
      }
    } catch (error) {
      console.error('Não foi possível concluir o registro:', error)
      this.errorMessage = String(error)
    }
  }

  async onUpdateForm(): Promise<void> {
    if (this.columnForm.invalid) return
    const { name } = this.columnForm.value;
    const updateColumnData: IColumn = {
      id: this.columnData.id,
      name: name,
      updatedBy: 3
    };

    try {
      const result = await this.columnService.updateColumn(updateColumnData)
      if (result) {
        this.closeModal()
      } else {
        console.error('Falha ao atualizar coluna')
      }
    } catch (error) {
      console.error('Não foi possível concluir a operação:', error)
      this.errorMessage = String(error)
    }
  }
}
