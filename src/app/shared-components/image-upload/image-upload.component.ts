import {Component, OnInit} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FileUploadService} from '../../_services/file-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  showProgress: boolean = false;

  constructor(private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.showProgress = true;
        this.uploadService.upload(this.currentFile).subscribe( {
          next : event => {
            if (event.type === HttpEventType.UploadProgress && event.total != undefined) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              setTimeout(this.hideProgress, 3000);
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error : err => {
            console.log(err);
            setTimeout(this.hideProgress, 3000);
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  private hideProgress() {
    this.showProgress = false;
    this.progress = 0;
  }

}
