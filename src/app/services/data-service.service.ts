import { GlobalDataSummary } from './../models/global-data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-24-2020.csv'
  
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  constructor(private http : HttpClient) { }
  
  getDateWiseData(){
    return this.http.get(this.dateWiseDataUrl,{responseType:'text'})
  }

  getGlobalData()
  {
    return this.http.get(this.globalDataUrl,{responseType:'text'}).pipe(
      map(result=>{
        let data:GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0,1);
        // console.log(rows);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          console.log(cols);
          let cs ={
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            recovered : +cols[9],
            active : +cols[10]
          };
          let temp : GlobalDataSummary= raw[cs.country];
          if(temp)
          {
            temp.active = cs.active+temp.active;
            temp.confirmed = cs.confirmed+temp.confirmed;
            temp.recovered = cs.recovered+temp.recovered;
            temp.deaths = cs.deaths+temp.deaths;
            raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }
        })
        return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}
