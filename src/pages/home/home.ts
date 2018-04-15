import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Media, MediaObject } from '@ionic-native/media';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  storagePath: string; // path for store file to local device
  fileUrl: string = 'http://localhost/buddhadasa/storage/sound/mp3/20180414_121003_0328342522.mp3'; // source file
  fileName: string = 'sound.mp3'; // file name on target

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private media: Media) {

    platform.ready().then(() => {


      if (this.platform.is('ios')) {
        this.storagePath = this.file.documentsDirectory;
      } else {
        this.storagePath = this.file.dataDirectory;
      }

      this.storagePath = this.storagePath + 'buddhadasa/sound/';

    });

  }

  downloadAndOpenSound() {

    this.platform.ready().then(() => {

      let filePath: string;

      filePath = this.storagePath + this.fileName;

      this.file.checkFile(this.storagePath, this.fileName)
        .then(() => {

          console.log('file found');

        })
        .catch(error => {

          console.log('file not found : ' + filePath);

          let transfer: FileTransferObject = this.transfer.create();

          transfer.download(this.fileUrl, filePath)
            .then(entry => {

              let url = entry.toURL();
              console.log('download success : ' + url);
              
            })
            .catch(error => {

              console.log('download failed : ' + JSON.stringify(error));

            });

        });

    });
  }

}
