import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/Models/taskModel';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  showNewRec = false;
  defaultHourlyRate = 250;
  newRec: Task = {
    id: '',
    duration: new Date(),
    hourlyRate: this.defaultHourlyRate,
    state: '',
    title: '',
    total: 0,
    type: ''
  };

  selectedTasks = [];
  editTaskId = '';
  editTask;

  taskRecords: Task[] = [];

  constructor() {}

  ngOnInit() {}

  newRecord() {
    this.newRec = {
      id: '',
      duration: new Date(1, 1, 1, 1),
      hourlyRate: this.defaultHourlyRate,
      state: '',
      title: '',
      total: 0,
      type: ''
    };
    this.showNewRec = true;
  }

  cancelRecord() {
    this.showNewRec = false;
  }

  saveRecord() {
    const tsk = this.newRec;
    const dt = new Date();
    tsk.state = 'Active';
    tsk.id = dt.toLocaleString();
    tsk.duration = this.roundDuration(tsk.duration);
    tsk.total = this.calculateTotal(tsk.duration, tsk.hourlyRate);

    this.taskRecords.push(tsk);
    this.showNewRec = false;
  }

  deleteRecord(tsk: Task) {
    this.selectTableRow(tsk);
    this.taskRecords = this.taskRecords.filter(t => t.id !== tsk.id);
  }

  submitRecords() {
    this.selectedTasks.map(id => {
      return id;
    });
    this.taskRecords.map(t => {
      if (this.selectedTasks.filter(st => t.id === st).length > 0) {
        t.state = 'Submitted';
        this.selectedTasks = this.selectedTasks.filter(st => t.id !== st);
        return t;
      }
    });
  }

  editRecord(tsk: Task, $event) {
    this.editTaskId = tsk.id;
    this.editTask = Object.assign({}, tsk);
    console.log(this.editTask);
    $event.stopPropagation();
  }

  changeValues(tsk: Task) {
    tsk.total = this.calculateTotal(tsk.duration, tsk.hourlyRate);
  }

  calculateTotal(duration: Date, hourlyRate: number) {
    const totalDurationInMins =
      duration.getHours() * 60 + duration.getMinutes();
    const totalAmt = (totalDurationInMins * hourlyRate) / 60;
    return totalAmt;
  }

  roundDuration(duration: Date) {
    const min = duration.getMinutes();
    let resultDuration;
    if (min === 0 || min === 15 || min === 30 || min === 45) {
      return duration;
    } else if (min > 0 && min < 15) {
      resultDuration = new Date(1, 1, 1, duration.getHours(), 15);
      return resultDuration;
    } else if (min > 15 && min < 30) {
      resultDuration = new Date(1, 1, 1, duration.getHours(), 30);
      return resultDuration;
    } else if (min > 30 && min < 45) {
      resultDuration = new Date(1, 1, 1, duration.getHours(), 45);
      return resultDuration;
    } else {
      resultDuration = new Date(1, 1, 1, duration.getHours() + 1, 0);
      return resultDuration;
    }
  }

  selectTableRow(tsk: Task) {
    if (tsk.state === 'Active') {
      const t1 = this.selectedTasks.filter(t => t !== tsk.id);
      if (t1.length === this.selectedTasks.length) {
        this.selectedTasks.push(tsk.id);
      } else {
        this.selectedTasks = t1;
      }
    }
  }

  isSelected(id) {
    if (this.selectedTasks.filter(t => t === id).length > 0) {
      return true;
    }
    return false;
  }

  isEditMode(id) {
    return id === this.editTaskId;
  }

  cancelEditRecord(tsk: Task, $event) {
    this.editTaskId = '';
    $event.stopPropagation();
  }

  saveEditRecord(tsk: Task, $event) {
    this.editTaskId = '';

    tsk.type = this.editTask.type;
    tsk.duration = this.roundDuration(this.editTask.duration);
    tsk.hourlyRate = this.editTask.hourlyRate;
    tsk.title = this.editTask.title;
    tsk.total = this.editTask.total;
    this.editTask = null;
    $event.stopPropagation();
  }
}
