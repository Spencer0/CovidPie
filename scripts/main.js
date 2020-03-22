
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawPieChart);

var data;
var chart;
var date = new Date(2020, 1, 20); 
var options; 
var csvData;

function drawPieChart() {
  if(!data){
    data = google.visualization.arrayToDataTable([
        ['Country', 'Total Cases'],
      ]); 
  }
  options = {
    title: 'COVID19 Total Cases ' + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
    is3D: true,
    pieSliceText: 'label',
    sliceVisibilityThreshold: .2,
    colors: ['darkred', 'red', 'orangered', 'tomato', 'coral', 'darkorange', 'orange']
  };
  chart = new google.visualization.ColumnChart(document.getElementById('piechart'));
  chart.draw(data, options);
  setTimeout(function () {
    updateDay()
  }, 500);
  loadCSVcases()
}

function updateDay(){


    date.setDate(date.getDate() + 1)

    transformCSVcases()

    options = {
        title: 'COVID19 Total Cases ' + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
        is3D: true,
        pieSliceText: 'label',
        sliceVisibilityThreshold: .01,
        colors: ['darkred', 'red', 'orangered', 'tomato', 'coral', 'darkorange', 'orange']
    };

    chart.draw(data, options);
    

    if(date.getTime() < new Date().getTime()){
        setTimeout(function () {
            updateDay()
          }, 500);
    }
}

function loadCSVcases(){
    d3.csv("https://raw.githubusercontent.com/Spencer0/CovidPie/master/data/march21.csv").then(function(data) {
        csvData = data;
        transformCSVcases()
    });
}

function transformCSVcases(){
    totalCounter = {}
    //Day, Country, Total Cases
    csvData.forEach(function(tuple){
        if(new Date(tuple.DateRep).getTime() < date.getTime()){
            if(totalCounter[tuple["Countries and territories"]]){
                totalCounter[tuple["Countries and territories"]] += parseInt(tuple["Cases"])
            }
            else{
                totalCounter[tuple["Countries and territories"]] = parseInt((tuple["Cases"]))
            }
        }
        
      });


    //Data clean
    totalCounter['South Korea'] = totalCounter['South_Korea']
    totalCounter['South_Korea'] = 0
    totalCounter['USA'] = totalCounter['United_States_of_America']
    totalCounter['United_States_of_America'] = 0
    totalCounter['United Kingdom'] = totalCounter['United_Kingdom']
    totalCounter['United_Kingdom'] = 0
    totalCounter['Diamond Princess'] = totalCounter['Cases_on_an_international_conveyance_Japan']
    totalCounter['Cases_on_an_international_conveyance_Japan'] = 0
    totalCounter['Czech Republic'] = totalCounter['Czech_Republic']
    totalCounter['Czech_Republic'] = 0



    newData = []
    for (var country in totalCounter) {
        newData.push([country, totalCounter[country]])
      }
      console.log(newData)
      newData = newData.sort(function(a,b){
        if(a[1] >= b[1]) {return -1}
        if(a[1] === b[1]){return 0}
        if(a[1] <= b[1]){return 1}

      })
      newData.splice(0,0,['Country', 'Total Cases'] )
      data = google.visualization.arrayToDataTable(newData); 
      chart.draw(data, options);
}



