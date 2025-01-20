import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from './Fornecedor';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  url = 'http://localhost:5100/api/Fornecedores';

  constructor(private http: HttpClient) { }

  getFornecedor(): Observable <Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.url);
  }

  getFornecedorById(id: number): Observable <Fornecedor> {
    const url = `${this.url}/${id}`;
    return this.http.get<Fornecedor>(url);
  }

  postFornecedor(fornecedor: Fornecedor): Observable <any> {
    return this.http.post<Fornecedor>(this.url, fornecedor, httpOptions);
  }

  updateFornecedor(id: number, fornecedor: Fornecedor): Observable <any> {
    const url = `${this.url}/${id}`;
    return this.http.put<number>(url, fornecedor, httpOptions);
  }

  deleteFornecedor(id: number): Observable <any> {
    const url = `${this.url}/${id}`;
    return this.http.delete<number>(url, httpOptions);
  }
}
