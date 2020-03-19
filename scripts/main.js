google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

var data;
var chart;
var date; 
var options; 
var csvData;

function drawChart() {
  date = new Date(2020, 1, 20)
  if(!data){
    data = google.visualization.arrayToDataTable([
        ['Country', 'Total Cases'],
      ]); 
  }
  options = {
    title: 'COVID19 Cases ' + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
    is3D: true,
    pieSliceText: 'label',
    sliceVisibilityThreshold: .025,
    colors: ['#aaaaaa', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6']
  };
  chart = new google.visualization.PieChart(document.getElementById('piechart'));
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
        sliceVisibilityThreshold: .001,
        colors: ['#aaaaaa', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6']
      };
    chart.draw(data, options);
    

    if(date.getTime() < new Date().getTime()){
        setTimeout(function () {
            updateDay()
          }, 500);
    }
}

function loadCSVcases(){
    d3.csv("https://raw.githubusercontent.com/Spencer0/CovidPie/master/data/march19.csv").then(function(data) {
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
      console.log(newData)
      newData.splice(0,0,['Country', 'Total Cases'] )
      data = google.visualization.arrayToDataTable(newData); 
      chart.draw(data, options);
}



