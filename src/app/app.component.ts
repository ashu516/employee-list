import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal/modal.service';

interface EmployeeData {
  name: string;
  age: number;
  id: number;
  startDate: string;
  endDate: string;
  jobTitle: string;
  type?: string;
}

enum ModalType {
  ADD = 'Add',
  UPDATE = 'Update',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  CurrentlyWorking = 'Currently Working';
  jobTitles = [
    { id: 1, title: 'Manager' },
    { id: 2, title: 'Tech Lead' },
    { id: 3, title: 'Software Developer' },
    { id: 4, title: 'Quality Analysis' },
    { id: 5, title: 'UI Designer' },
  ];
  filteredJobTitles = [];

  tableHeaders = [
    { id: 1, name: '#', width: '2%' },
    { id: 2, name: 'Name', width: '16%' },
    { id: 3, name: 'Job Title', width: '16%' },
    { id: 4, name: 'Age', width: '8%' },
    { id: 5, name: 'Start Date', width: '16%' },
    { id: 6, name: 'End Date', width: '16%' },
  ];

  defaultData = [
    {
      id: 1,
      name: 'Amit Kumar',
      jobTitle: 'Manager',
      age: 33,
      startDate: '2015-05-01',
      endDate: '2018-02-25',
    },
    {
      id: 2,
      name: 'Ankur Tyagi',
      jobTitle: 'Tech Lead',
      age: 38,
      startDate: '2015-05-01',
      endDate: '',
    },
    {
      id: 3,
      name: 'Saurav Mishra',
      jobTitle: 'Software Developer',
      age: 40,
      startDate: '2015-05-01',
      endDate: '2018-02-25',
    },
    {
      id: 4,
      name: 'Ravi Yadav',
      jobTitle: 'Quality Analysis',
      age: 30,
      startDate: '2015-05-01',
      endDate: '',
    },
    {
      id: 5,
      name: 'Manoj Singh',
      jobTitle: 'UI Designer',
      age: 35,
      startDate: '2018-08-02',
      endDate: '2018-02-25',
    },
  ];
  employeeData: any[] = [];
  selectedData: EmployeeData;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.employeeData = [...this.defaultData];
  }

  resetFilter(employeeForm: any) {
    this.employeeData = [...this.defaultData];
    employeeForm.reset();
  }

  filterTitle(event: any) {
    const jobTitle = (event.target as HTMLInputElement).value;
    if (jobTitle) {
      this.employeeData = this.defaultData?.filter(
        (i) => i?.jobTitle === jobTitle
      );
    }
  }

  onFilterClick(filterOptions: any) {
    this.employeeData = this.defaultData?.filter(function (item) {
      for (var key in filterOptions) {
        if (filterOptions[key]) {
          if (key === 'name') {
            if (
              item[key] === undefined ||
              item[key].indexOf(filterOptions[key]) == -1
            )
              return false;
          } else {
            if (item[key] === undefined || item[key] != filterOptions[key])
              return false;
          }
        }
      }
      return true;
    });
  }

  openModal(id: string, type: string, data: EmployeeData = {} as EmployeeData) {
    this.modalService.open(id);
    this.selectedData = { ...data, type };
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  updateEmployeeDetails(id: string) {
    if (!this.verifyEmployeeDetails()) return;
    else if (this.selectedData?.type === ModalType.UPDATE) {
      this.defaultData = this.defaultData.filter(
        (i) => i.id !== this.selectedData.id
      );
      this.defaultData = [...this.defaultData, this.selectedData];
      this.defaultData.sort((a, b) => a.id - b.id);
    } else if (this.selectedData?.type === ModalType.ADD) {
      const newRecord: EmployeeData = {
        id: this.defaultData[this.defaultData.length - 1].id + 1,
        name: this.selectedData.name,
        jobTitle: this.selectedData.jobTitle,
        age: this.selectedData.age,
        startDate: this.selectedData.startDate,
        endDate: this.selectedData.endDate,
      };
      this.defaultData = [...this.defaultData, newRecord];
    }
    this.employeeData = [...this.defaultData];
    this.closeModal(id);
  }

  deleteEmployee(id: number) {
    if (this.employeeData.length === 1) return;
    this.employeeData = this.employeeData.filter((i) => i.id !== id);
  }

  verifyEmployeeDetails() {
    return (
      this.selectedData.name &&
      this.selectedData.jobTitle &&
      this.selectedData.age &&
      this.selectedData.startDate
    );
  }
}
