import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddEditCardComponent } from './add-edit-card.component'

describe('AddEditCardComponent', () => {
  let component: AddEditCardComponent
  let fixture: ComponentFixture<AddEditCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCardComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(AddEditCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
