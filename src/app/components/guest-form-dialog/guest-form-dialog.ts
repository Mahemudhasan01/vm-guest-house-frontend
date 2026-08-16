import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckInService } from '../../services/check-in-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { RoomService } from '../../services/room-service';
import { CommonService } from '../../services/common-service';
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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
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
    'AADHAAR',
    'DRIVING_LICENSE',
    'PAN',
    'VOTER_ID',
    'PASSPORT',
    'OTHER'
  ];
  today = new Date();
  totalTariff: number = 0;
  gstAmount: number = 0;

  guestForm = this.fb.group({
  propertyId: [1],
  roomId: ['', Validators.required],
    id: [''],
    primaryGuest: this.fb.group({
      fullName: ['', Validators.required],
      id: [''],
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
      idProofUrl: [''],
      idProofNo: ['', Validators.required],
      idProofType: [''],
    }),

    adultCount: [1],
    childCount: [0],
    extraPersonCount: [0],
    checkInDate: [this.convertDateToDataBaseFormat(this.today)],
    checkInTime: [this.getCheckInTime()],
    tariff: [0],
    advanceAmount: [0],

    remarks: [''],

    persons: this.fb.array([
      this.createPerson()
    ])
  });
  isUpdate: boolean = false;
  timeSlots: string[] = [];

  constructor(
    private checkInService: CheckInService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public selectedRoomDtls: any,
    private dialogRef: MatDialogRef<GuestFormDialog>,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.selectedRoomId = this.selectedRoomDtls.room.id ?? '';
    if (this.selectedRoomDtls.room.status === 'OCCUPIED') {
      this.isUpdate = true;
      this.loadGuestDetails();
    }else{
      this.isUpdate = false;
    }
    this.getRoomsList();

    this.loadCheckInTimeSlots();

    this.calculateTariff();
  }

  loadCheckInTimeSlots() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        this.timeSlots.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        );
      }
    }
  }

  loadGuestDetails() {
    this.loadingGuest = true;

    this.checkInService
      .getGuestDtlsByRoomId(this.selectedRoomDtls.room.id)
      .subscribe({
        next: (response) => {
          
          const personsArray = this.guestForm.get('persons') as FormArray;
          // Clear existing persons before adding new ones
          personsArray.clear();

          this.guestForm.patchValue({
            primaryGuest: {
              id: response.data.primaryGuest.id,
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
              idProofNo: response.data.primaryGuest.idProofNo,
              idProofType: response.data.primaryGuest.idProofType
            },
            id: response.data.id,
            adultCount: response.data.adultCount,
            childCount: response.data.childCount,
            extraPersonCount: response.data.room.roomType.extraPersonCharge,
            tariff: response.data.room.roomType.baseTariff,
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
      id: [person?.id ?? ''],
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
    this.calculateTariff();
  }

  removePerson(index: number) {
    if (this.persons.length > 1) {
      this.persons.removeAt(index);
    }
    this.calculateTariff();
  }

  onFileSelect(event: any, type: 'guest' | 'proof') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      if (type === 'guest') {
        this.guestPhoto = reader.result as string;
        this.guestForm.get('primaryGuest.photoUrl')?.setValue(file.name);
      } else {
        this.idProofPhoto = reader.result as string;
        this.guestForm.get('primaryGuest.idProofUrl')?.setValue(file.name);
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

  calculateTariff() {
    const baseTariff = this.selectedRoomDtls.room.roomType.baseTariff || 0;
    const extraPersonCharge = this.selectedRoomDtls.room.roomType.extraPersonCharge || 0;

    this.totalTariff = baseTariff + (this.persons.length > 1 ? (this.persons.length - 1) * extraPersonCharge : 0);
    this.gstAmount = this.totalTariff * this.selectedRoomDtls.room.roomType.gstRate / 100; // Assuming GST is 5%
    this.totalTariff += this.gstAmount; // Add GST to total tariff

    this.guestForm.get('tariff')?.setValue(this.totalTariff);
  }

  onSave() {
    this.checkInService.saveCheckingDetails(this.guestForm.value).subscribe({
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

  onUpdate() {
    this.checkInService.updateCheckingDetails(this.guestForm.value).subscribe({
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

  private getCheckInTime(): string {
    // const now = new Date();
    // const roundedMinutes = Math.round(now.getMinutes() / 15) * 15;

    // now.setMinutes(roundedMinutes, 0, 0);

    // return now.toLocaleTimeString('en-GB', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: false
    // });
    const now = new Date();
    const roundedMinutes = Math.round(now.getMinutes() / 15) * 15;

    now.setMinutes(roundedMinutes, 0, 0);
    console.log(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  onCancel() {
    this.dialogRef.close();
  }

  convertDateToDataBaseFormat(date: any) {
    // YYYY-MM-DD
    if (date) {
      let day = date.getDate().toString();
      if (day.length != 2) {
        day = '0' + day;
      }
      let month = (date.getMonth() + 1).toString();
      if (month.length != 2) {
        month = '0' + month;
      }
      return `${date.getFullYear()}-${month}-${day}`;
    }
    return '';
  }
}