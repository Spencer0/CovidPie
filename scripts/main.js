google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

var data;
var chart;
var date; 
var options; 
var csvData;

function drawChart() {
  date = new Date(2020, 0, 1)
  if(!data){
    data = google.visualization.arrayToDataTable([
        ['Country', 'Total Cases'],
      ]); 
  }
  options = {
    title: 'COVID19 Cases ' + date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
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
        title: 'COVID129 Cases ' + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      };
    chart.draw(data, options);
    

    if(date.getTime() < new Date(2020,3,1).getTime()){
        setTimeout(function () {
            updateDay()
          }, 500);
    }
}

//returns 2d array
//[["Country", CaseTotal]

function loadCSVcases(){
    d3.csv("https://raw.githubusercontent.com/Spencer0/CovidPie/master/data/march18.csv").then(function(data) {
        csvData = data;
        transformCSVcases()
    });
}



function transformCSVcases(){
    totalCounter = {}
    //Day, Country, Total Cases
    csvData.forEach(function(tuple){
        if(new Date(tuple.Date).getTime() < date.getTime()){
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
      newData.splice(0,0,['Country', 'Total Cases'] )
      data = google.visualization.arrayToDataTable(newData); 
      chart.draw(data, options);
}



