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
import { ICard } from '../../shared/interfaces/card.interface'
import { CardService } from '../../shared/services/card.services'

@Component({
  selector: 'app-add-edit-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-card.component.html',
  styleUrl: './add-edit-card.component.sass'
})
export class AddEditCardComponent {
  @Input() isOpen: boolean = false
  @Input() isEdit: boolean = false
  @Input() cardData: ICard = {}
  @Input() columnId!: number
  @Output() emitModalClosed = new EventEmitter()
  cardForm!: FormGroup
  errorMessage: string = ''

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
  ) {
    this.cardForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardData'] && this.cardData) {
      this.cardForm.patchValue({
        name: this.isEdit ? this.cardData.name : '',
        description: this.isEdit ? this.cardData.description : '',
      })
    }
  }

  get errors() {
    return {
      name: this.cardForm.get('name')?.errors,
    }
  }

  closeModal() {
    this.isOpen = false
    this.emitModalClosed.emit()
  }

  async onCreateForm(): Promise<void> {
    if (this.cardForm.invalid) return
    const { name, description } = this.cardForm.value
    const cardData: ICard = {
      name: name,
      description: description,
      columnId: this.columnId,
      createdBy: 3
    }
    try {
      const result = await this.cardService.createCard(cardData, this.columnId)
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
    if (this.cardForm.invalid) return
    const { name } = this.cardForm.value;
    const updateCardData: ICard = {
      id: this.cardData.id,
      name: name,
      updatedBy: 3
    };

    try {
      const result = await this.cardService.updateCard(updateCardData)
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
