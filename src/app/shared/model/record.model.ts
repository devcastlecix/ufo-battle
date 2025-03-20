export class Record {
    username: string;
    punctuation: number;
    ufos: number;
    disposedTime: number;
    rawRecordDate: number;
    recordDate: Date;
  
    constructor(username: string, punctuation: number, ufos: number, disposedTime: number, rawRecordDate: number) {
      this.username = username;
      this.punctuation = punctuation;
      this.ufos = ufos;
      this.disposedTime = disposedTime;
      this.rawRecordDate = rawRecordDate;
      this.recordDate = new Date(this.rawRecordDate);
    }
  }
  