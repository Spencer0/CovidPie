
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(init);


var data;
var chart;
var calender;
var minDate = new Date('1/25/2020'); 
var maxDate = new Date('3/27/2020')
var date = new Date('1/25/2020'); 
var options; 
var csvData;
var dataTypeSelection = 'PieChart';
var chartTypeSelection = 'totalCases';
var totalDays;

var TitleTranslator = {'totalCases': "Total Cases", 
                       'totalDeaths': "Total Deaths", 
                       'newDeaths': "New Deahts",
                        'newCases': "New Cases"
                      }

//Init Function
//Does all the data transformation that will need to be done
//Sets the case types on the user screen the the defaults 
//Begins the sim with the default



function init(){
  beginInit()
}

function beginInit(){
  //Initalize our datatable
  if(!data){
    data = google.visualization.arrayToDataTable([
        ['Country', 'Total Cases'],
      ]); 
  }

  //Download the data from the CSV set
  //Also loop over it into a nice object and clean some entries
  extractAndTransformCSVcases()
}

function finishInit(){
  document.getElementById("dateSlider").max = totalDays
  document.getElementById("dateSlider").value = 1
  drawChart()
}


function updateOptions(){
  options = {
    title: 'COVID19 ' + TitleTranslator[chartTypeSelection] + " " + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
    is3D: true,
    pieSliceText: 'label',
    height: 800,
    width: 1200,
    sliceVisibilityThreshold: .01,
    colors: ['darkred', 'red', 'orangered', 'tomato', 'coral', 'darkorange', 'orange']
  };
}

function drawChart() {
  updateOptions()
  document.getElementById('slider-value').innerHTML = "<b>"  + (parseInt(date.getMonth()) + 1) + " / " + date.getDate() +"</b>";
  if(dataTypeSelection == 'PieChart'){
    chart = new google.visualization.PieChart(document.getElementById('piechart'));
  }else if(dataTypeSelection == 'BarChart'){
    chart = new google.visualization.BarChart(document.getElementById('piechart'));
  }else if(dataTypeSelection == 'Histogram'){
    chart = new google.visualization.Histogram(document.getElementById('piechart'));
  }else{
    chart = new google.visualization.ColumnChart(document.getElementById('piechart'));
  }
  chart.draw(google.visualization.arrayToDataTable(calender[date.getTime()][chartTypeSelection]), options);
}

function incrementDay(loop = false){
  if(date >= maxDate){return}
    date.setDate(date.getDate() + 1)
    document.getElementById("dateSlider").value = parseInt(document.getElementById("dateSlider").value) + 1
    drawChart()
    if(loop){
      if(date < maxDate){
        setTimeout(function () {
          incrementDay(true)
        }, 500);
      }
    }
}

function extractAndTransformCSVcases(){
    d3.csv("https://raw.githubusercontent.com/Spencer0/CovidPie/master/data/march27.csv").then(function(data) {
        csvData = data;
        transformCSVcases()
    });
}

function transformCSVcases(){
    //First, count number of days.
    //For each day, (0 - n)
    //Create an entry in the Calender JSON object { '3/3/2020' : { totalDeaths: 1, totalCases: 2, usaTotal: 13000, usaDelta: 1000 }     }
    calender = {}
    totalDays = 0

    //N^bazillion algo, runs only once
    let placeholderDate = new Date('1/25/2020')
    let endDate = maxDate
    let runningTotalCounter = {}
    let runningDeathTotalCounter = {}
    while(placeholderDate.getTime() <= endDate.getTime()){
      let newCasesCounter = {}
      let newDeathCounter = {}
      csvData.forEach(function(tuple){
        if(new Date(tuple.DateRep).getTime() == placeholderDate.getTime()){
              newCasesCounter[tuple["Countries and territories"]] = parseInt((tuple["Cases"]))
              newDeathCounter[tuple["Countries and territories"]] = parseInt((tuple["Deaths"]))
              if(newCasesCounter[tuple["Countries and territories"]] <= 0){
                newCasesCounter[tuple["Countries and territories"]] = 0
              }
          } 
      });

      dailyNewCaseData = []
      for(country in newCasesCounter){
        if(runningTotalCounter[country]){
          runningTotalCounter[country] += parseInt(newCasesCounter[country])
        }else{
          runningTotalCounter[country] = parseInt(newCasesCounter[country])
        }
        dailyNewCaseData.push([country, newCasesCounter[country]])
      }


      dailyNewDeathData = []
      for(country in newDeathCounter){
        if(runningDeathTotalCounter[country]){
          runningDeathTotalCounter[country] += parseInt(newDeathCounter[country])
        }else{
          runningDeathTotalCounter[country] = parseInt(newDeathCounter[country])
        }
        dailyNewDeathData.push([country, newDeathCounter[country]])
      }





    

      
      totalCasesObjectClone = JSON.parse(JSON.stringify(runningTotalCounter));
      totalDeathsObjectClone = JSON.parse(JSON.stringify(runningDeathTotalCounter));

      todaysTotalDeaths = []
      for(country in totalDeathsObjectClone){
        todaysTotalDeaths.push([country, totalDeathsObjectClone[country]])
        if(todaysTotalDeaths[country] <= 0){
          todaysTotalDeaths[country] = 0
        }
      }

      todaysTotalCases = []
      for(country in totalCasesObjectClone){
        todaysTotalCases.push([country, totalCasesObjectClone[country]])
        if(todaysTotalCases[country] <= 0){
          delete todaysTotalCases.country
        }
      }



      dailyNewCaseData.splice(0,0,['Country', 'Total New Cases'] )
      dailyNewDeathData.splice(0,0,['Country', 'Total New Deaths'] )
      todaysTotalCases.splice(0,0,['Country', 'Total Cases'] )
      todaysTotalDeaths.splice(0,0,['Country', 'Total Deaths'] ) 



      dailyNewCaseData = dailyNewCaseData.sort(function(a,b){
        if(a[1] >= b[1]) {return -1}
        if(a[1] === b[1]){return 0}
        if(a[1] <= b[1]){return 1}

      })
      dailyNewDeathData = dailyNewDeathData.sort(function(a,b){
        if(a[1] >= b[1]) {return -1}
        if(a[1] === b[1]){return 0}
        if(a[1] <= b[1]){return 1}

      })
      todaysTotalCases = todaysTotalCases.sort(function(a,b){
        if(a[1] >= b[1]) {return -1}
        if(a[1] === b[1]){return 0}
        if(a[1] <= b[1]){return 1}

      })
      todaysTotalDeaths = todaysTotalDeaths.sort(function(a,b){
        if(a[1] >= b[1]) {return -1}
        if(a[1] === b[1]){return 0}
        if(a[1] <= b[1]){return 1}

      })
      todaysObject = {'newCases' : dailyNewCaseData, 
                      'newDeaths': dailyNewDeathData, 
                      'totalCases': todaysTotalCases, 
                      'totalDeaths': todaysTotalDeaths}
      calender[placeholderDate.getTime()] = todaysObject
      placeholderDate.setDate(placeholderDate.getDate() + 1)
      totalDays++
    }
    totalDays = totalDays - 1
    data = calender[date.getTime()]['totalCases']
    console.log(calender, totalDays)
    finishInit()
    
}

function chartTypeInputEvent(e){
  console.log(e)
  chartTypeSelection = e
  console.log(calender[date.getTime()][chartTypeSelection])
  drawChart()
}

function chartStyleInputEvent(e){
  console.log(e)
  dataTypeSelection = e
  drawChart()
}

function playButtonClickEvent(){
  console.log('play')
  incrementDay(true)
}


function dateSliderInputEvent(e){
  console.log("Updated date", e)
  //Create new date object using the input value
  var userDate = new Date('1/25/2020')
  userDate.setDate(userDate.getDate() + parseInt(e))
  
  if(userDate > new Date('3/22/2020') || userDate < new Date('1/25/2020') ) { 
    console.log("big slider")
    return
   }
  //Set current = to it, and redraw
  //Current date member variable to interger 
  console.log(date.getMonth() + "/" +date.getDate(), userDate.getMonth() + "/" +userDate.getDate())
  
  date = userDate
  drawChart()
}


function forwardButtonClickEvent(){
  if(date.getTime() < maxDate.getTime()){ 
    incrementDay();
   } 
}

function backwardButtonClickEvent(){
  if(date <= new Date('1/25/2020')){ return; } 
  document.getElementById("dateSlider").value = parseInt(document.getElementById("dateSlider").value) - 1
  date.setDate(date.getDate() - 1)
  drawChart()
}