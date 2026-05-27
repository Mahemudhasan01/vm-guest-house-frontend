import {
  Component,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-guest-form-dialog',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],

  templateUrl: './guest-form-dialog.html',

  styleUrl: './guest-form-dialog.css'
})
export class GuestFormDialog {

  private fb = inject(FormBuilder);

  private dialogRef = inject(MatDialogRef<GuestFormDialog>);

  guestPhoto: string | null = null;

  idProofPhoto: string | null = null;

  previewImage: string | null = null;

  states = [
    'Gujarat',
    'Maharashtra',
    'Delhi',
    'Rajasthan'
  ];

  idProofTypes = [
    'Aadhaar',
    'Driving License',
    'Passport',
    'PAN Card'
  ];

  guestForm = this.fb.group({

    roomNo: ['101'],

    fullName: ['', Validators.required],

    mobile: [''],

    email: [''],

    city: [''],

    state: ['Gujarat'],

    address: [''],

    gstNo: [''],

    idProofType: ['Aadhaar'],

    idProofNo: [''],

    remarks: [''],

    persons: this.fb.array([
      this.createPerson()
    ])
  });

  createPerson() {

    return this.fb.group({

      name: [''],

      age: [''],

      gender: ['Male']
    });
  }

  get persons(): FormArray {

    return this.guestForm.get('persons') as FormArray;
  }

  addPerson() {

    this.persons.push(this.createPerson());
  }

  removePerson(index: number) {

    if (this.persons.length > 1) {
      this.persons.removeAt(index);
    }
  }

  onFileSelect(event: any, type: 'guest' | 'proof') {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      if (type === 'guest') {
        this.guestPhoto = reader.result as string;
      } else {
        this.idProofPhoto = reader.result as string;
      }
    };

    reader.readAsDataURL(file);
  }

  openPreview(image: string | null) {

    if (!image) return;

    this.previewImage = image;
  }

  closePreview() {

    this.previewImage = null;
  }

  onSave() {

    console.log(this.guestForm.value);

    this.dialogRef.close(this.guestForm.value);
  }

  onCancel() {

    this.dialogRef.close();
  }
}