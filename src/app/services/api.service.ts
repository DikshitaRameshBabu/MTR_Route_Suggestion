import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "https://localhost:7298/api/";

  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<any>(this.baseUrl +'User/')
  }
  getStations(){
    return this.http.get<any>(this.baseUrl +'Station/')
  }
  getRouteSuggestion(startPoint:any,endPoint:any){
   return this.http.get<any>(`${this.baseUrl}RouteSuggestion/searchRoute`,{params: {
    startpoint: startPoint,
    endpoint: endPoint
  }});
  }
  searchHistory(search:any){
    return this.http.post<any>(`${this.baseUrl}SearchHistory`,search);
  }
  getSearchHistory(){
    return this.http.get<any>(this.baseUrl +'SearchHistory/');
  }
}
