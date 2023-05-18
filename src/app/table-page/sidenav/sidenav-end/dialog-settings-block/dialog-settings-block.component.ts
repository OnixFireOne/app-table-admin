import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoinContent} from '../../../../service/coin-market-data.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dialog-settings-block',
  templateUrl: './dialog-settings-block.component.html',
  styleUrls: ['./dialog-settings-block.component.scss']
})
export class DialogSettingsBlockComponent implements OnInit{

  form: FormGroup;

  constructor(
    public readonly dialogRef: MatDialogRef<DialogSettingsBlockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoinContent
  ) {}

  ngOnInit() {
    const title = this.data.title;
    this.form = new FormGroup({
      title: new FormControl(title)
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeWithResult() {

    const title = {...this.form.value}
    return title;
  }
}
