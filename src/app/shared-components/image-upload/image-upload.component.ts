import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FileService} from '../../_services/file.service';
import {IFileInfo} from '../model/fileInfo.model';

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
  imgList?: Observable<any>;
  showProgress: boolean = false;

  @Input() image: any;
  showSpinner: boolean = false;

  constructor(private uploadService: FileService) {
  }

  ngOnInit(): void {
    this.fetchImage(this.uploadService.getFiles());
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  resetProgress(obj: any): void {
    obj.showProgress = false;
    obj.progress = 0;
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
              let obj = this;
              setTimeout(function() { obj.resetProgress(obj) }, 3000);
              this.message = event.body.message;
              this.fetchImage(this.uploadService.getFiles());
            }
          },
          error : err => {
            console.log(err);
            let obj = this;
            setTimeout(function() { obj.resetProgress(obj) }, 3000);
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

  fetchImage(files: Observable<any>) {
    if (files) {
      files
          .subscribe({
            next: value => {
              if (value.length > 0) {
                this.uploadService.getUserImage((value[0] as IFileInfo).url)
                    .subscribe({
                      next: image => this.createImage(image),
                    });
              }
            }
          })
    }
  }

  private createImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();
      this.showSpinner = true;

      reader.addEventListener("load", () => {
        this.showSpinner = false;
        this.image = reader.result;
      }, false);

      reader.readAsDataURL(image);
    } else {
      this.showSpinner = false;
    }
  }

}