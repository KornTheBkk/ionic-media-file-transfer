import { Component, NgZone } from '@angular/core';
import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';

import { Media, MediaObject } from '@ionic-native/media';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  storagePath: string; // path for store file to local device
  fileUrl: string = 'http://172.20.10.3/buddhadasa/storage/sound/mp3/20180414_121003_0328342522.mp3'; // source file
  //fileUrl: string = 'http://sound.bia.or.th/administrator/biasound/1/1215090603011.mp3';
  fileName: string = 'sound.mp3'; // file name on target

  fileReady: boolean = false;
  sound: MediaObject;

  actionText: string = 'Play';
  isPlaying: boolean = false;
  loadedProgress: number = 0;

  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private media: Media,
    private backgroundMode: BackgroundMode,
    private _zone: NgZone,
    private loadingCtrl: LoadingController) {

    platform.ready().then(() => {

      this.backgroundMode.enable();

      if (this.platform.is('ios')) {
        this.storagePath = this.file.documentsDirectory;
      } else {
        this.storagePath = this.file.dataDirectory;
      }

      this.storagePath = this.storagePath + 'buddhadasa/sound/';
    });

    this.loader = this.loadingCtrl.create();    
  }

  downloadAndOpenSound() {

    this.platform.ready().then(() => {

      this.loader.present();
      this.loader.setContent(`กำลังดาวน์โหลดเสียง ${this.loadedProgress}%`);

      let filePath: string;

      filePath = this.storagePath + this.fileName;

      // this.file.checkFile(this.storagePath, this.fileName)
      //   .then(() => {

      //     console.log('file found');

      //   })
      //   .catch(error => {

      //console.log('file not found : ' + filePath);

      let transfer: FileTransferObject = this.transfer.create();

      transfer.download(this.fileUrl, filePath)
        .then(entry => {

          let url = entry.toURL();
          this.fileReady = true;

          let fileName = this.storagePath + this.fileName;
          console.log('fileName: ' + fileName);
          this.sound = this.media.create(fileName.replace(/^file:\/\//, ''));

          console.log('download success : ' + url);

        })
        .catch(error => {

          console.log('download failed : ' + JSON.stringify(error));

        });

      transfer.onProgress((progressEvent) => {
        //console.log('on progress: ' + JSON.stringify(progressEvent));
        //this.loadedProgress = Math.round(progressEvent.loaded / progressEvent.total);
        this._zone.run(() => {
          this.loadedProgress = (progressEvent.lengthComputable) ? Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
          //console.log('loadedProgress: ' + this.loadedProgress + '%');
          this.loader.setContent(`กำลังดาวน์โหลดเสียง ${this.loadedProgress}%`);

          if (this.loadedProgress == 100) {
            this.loader.dismiss();
          }
        });
      });

    });

    //});
  }

  play() {

    if (this.fileReady) {

      if (!this.isPlaying) {

        this.isPlaying = true;
        this.actionText = 'Pause';

        this.sound.play();

      } else {

        this.isPlaying = false;
        this.actionText = 'Play';

        this.sound.pause();
      }
    }
  }

}
