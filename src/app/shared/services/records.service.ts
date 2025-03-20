import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_RECORD_URL } from '../constants/constants';
import { Observable } from 'rxjs';
import { RecordScore } from '../model/record-score';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private http: HttpClient) { }

  getRecordsGeneral(): Observable<any> {
    return this.http.get(API_RECORD_URL);
  }

  getRecordsByUsername(username: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return this.http.get(`${API_RECORD_URL}/${username}`, { headers, observe: "response" });
  }
 
  saveRecords(record: RecordScore, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    });
    return this.http.post(`${API_RECORD_URL}`, record, { headers, observe: "response" });
  }
}
