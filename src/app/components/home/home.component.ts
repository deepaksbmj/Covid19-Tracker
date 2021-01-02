import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { CssSelector } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalRecovered = 0;
  totalActive = 0;
  totalDeaths = 0;
  pieChart : GoogleChartInterface = {
    chartType : 'PieChart'
  };
  columnChart : GoogleChartInterface = {
    chartType : 'ColumnChart'
  };
  globalData : GlobalDataSummary[];
  constructor(private dataService : DataServiceService) { }

  initChart(caseType : string)
  {
    let dataTable = [];
    dataTable.push(['Country','Cases'])
    this.globalData.forEach(cs=>{
      let value :number;
      if(caseType == 'c')       
        if(cs.confirmed >= 2000)
          value = cs.confirmed;

      if(caseType == 'r')     
        if(cs.recovered >= 2000)
          value = cs.recovered;

      if(caseType == 'a')     
        if(cs.active >= 2000)
          value = cs.active;

      if(caseType == 'd')     
        if(cs.deaths >= 1000)
          value = cs.deaths;

      dataTable.push([cs.country, value])
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      options: {
        height : 300
      }
    };
    
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      options: {
        height : 300
      }
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next : (result)=>{
          // console.log(result);
          this.globalData = result;  
          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalConfirmed+=cs.confirmed;
              this.totalRecovered+=cs.recovered;
              this.totalActive+=cs.active;
              this.totalDeaths+=cs.deaths;
            }
          })
          this.initChart('c');
        }
      }
    )
  }

  updateChart(input : HTMLInputElement)
  {
    console.log(input.value);
    this.initChart(input.value);
  }

}
