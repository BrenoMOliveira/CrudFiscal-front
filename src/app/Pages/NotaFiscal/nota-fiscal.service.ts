import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotaFiscal } from './NotaFiscal';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class NotaFiscalService {
  url = 'http://localhost:5100/api/NotaFiscals';

  constructor(private http: HttpClient) {}

  getNotasFiscais(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.url);
  }

  getNotaFiscalById(id: number): Observable<NotaFiscal> {
    const url = `${this.url}/${id}`;
    return this.http.get<NotaFiscal>(url);
  }

  postNotaFiscal(notaFiscal: NotaFiscal): Observable<any> {
    return this.http.post<NotaFiscal>(this.url, notaFiscal, httpOptions);
  }

  updateNotaFiscal(id: number, notaFiscal: NotaFiscal): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.put<number>(url, notaFiscal, httpOptions);
  }

  deleteNotaFiscal(id: number): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete<number>(url, httpOptions);
  }

  emitarNotaFiscal(fornecedorId: number, notaFiscal: any): Observable<any> {
    const url = `${this.url}/Emitir/${fornecedorId}`;
    return this.http.post<any>(url, notaFiscal); // Use POST para enviar os dados da nota fiscal
  }
  

}

