import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckInCheckOutService } from '../../services/check-in-check-out-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RoomService } from '../../services/room-service';
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
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './guest-form-dialog.html',

  styleUrl: './guest-form-dialog.css'
})
export class GuestFormDialog implements OnInit {

  private fb = inject(FormBuilder);
  
  guestPhoto: string | null = null;
  idProofPhoto: string | null = null;
  previewImage: string | null = null;
  roomList: any[] = [];
  selectedRoomId: any = '';
  loadingGuest: boolean = false;
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
  propertyId: [1],

  roomId: ['', Validators.required],

    primaryGuest: this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', Validators.email],
      gender: [''],
      dob: [null],
      city: ['', Validators.required],
      state: ['Gujarat'],
      country: ['India'],
      pinCode: [''],
      address: [''],
      gstNo: [''],
      companyName: [''],
      photoUrl: [''],
      idProofNo: ['', Validators.required]
    }),

    adultCount: [1],
    childCount: [0],
    extraPersonCount: [0],

    tariff: [0],
    advanceAmount: [0],

    remarks: [''],

    persons: this.fb.array([
      this.createPerson()
    ])
  });
  
  constructor(
    private checkInCheckOutService: CheckInCheckOutService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public selectedRoomDtls: any,
    private dialogRef: MatDialogRef<GuestFormDialog>
  ) { }

  ngOnInit(): void {
    this.selectedRoomId = this.selectedRoomDtls.roomId ?? '';
    if (this.selectedRoomDtls.roomStatus === 'OCCUPIED') {
      this.loadGuestDetails();
    }
    this.getRoomsList();
  }


  loadGuestDetails() {
    this.loadingGuest = true;

    this.checkInCheckOutService
      .getGuestDtlsByRoomId(this.selectedRoomDtls.roomId)
      .subscribe({
        next: (response) => {
          const personsArray = this.guestForm.get('persons') as FormArray;
          // Clear existing persons before adding new ones
          personsArray.clear();

          this.guestForm.patchValue({
            primaryGuest: {
              fullName: response.data.primaryGuest.fullName,
              mobile: response.data.primaryGuest.mobile,
              email: response.data.primaryGuest.email,
              gender: response.data.primaryGuest.gender,
              city: response.data.primaryGuest.city,
              state: response.data.primaryGuest.state,
              country: response.data.primaryGuest.country,
              pinCode: response.data.primaryGuest.pinCode,
              address: response.data.primaryGuest.address,
              gstNo: response.data.primaryGuest.gstNo,
              companyName: response.data.primaryGuest.companyName,
              photoUrl: response.data.primaryGuest.photoUrl,
              idProofNo: response.data.primaryGuest.idProofNo
            },
            adultCount: response.data.adultCount,
            childCount: response.data.childCount,
            extraPersonCount: response.data.extraPersonCount,
            tariff: response.data.tariff,
            advanceAmount: response.data.advanceAmount,
            remarks: response.data.remarks
          });

          response.data.persons.forEach((person: any) => {
            personsArray.push(this.createPerson(person));
          });

          this.loadingGuest = false;
        },
        error: () => {
          this.loadingGuest = false;
        }
      });
  }

  getRoomsList(){
   const payload = {
      page: 0,
      size: 100,
      sortBy: 'roomNumber,asc'//Space not allowed in sortBy value
    };

    this.roomService.getAllRooms(payload).subscribe({
      next: (response: any) => {
        this.roomList = response.data.data ?? [];
      },
      error: (error: any) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  createPerson(person?: any): FormGroup {
    return this.fb.group({
      fullName: [person?.fullName ?? ''],
      age: [person?.age ?? ''],
      gender: [person?.gender ?? 'Male']
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
    this.checkInCheckOutService.saveCheckingDetails(this.guestForm.value).subscribe({
      next: (response) => {
        if(response && !response.isError){
          console.log('Checking details saved successfully:', response);
          this.dialogRef.close(this.guestForm.value);
        } else {
          console.error('Error saving checking details:', response.errorMessage);
        }
      },
      error: (error) => {
        console.error('Error saving checking details:', error);
      }
    });
  }

  onRoomSelected(event: any) {
    this.guestForm.patchValue({
      roomId: event.value
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}