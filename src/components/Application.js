import React from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import LocationSelector from './LocationSelector'
import CityList from './CityList'

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      citiesArray: [],
      clickedCity: null,
      showChart: false,
      chartData: {}
    }
  }
  
  setClickedCityValue(value) {
    this.setState({
      clickedCity: value
    })
  }

  displayData(data) {
    let coloursArray = [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ]
    let chartDataObject = {
      labels: [],
      datasets: []
    };
    let parameters = [];

    data.forEach(x => {
      if(!parameters.includes(x.parameter)) {
        parameters.push(x.parameter)
      }
    });
  
    parameters.forEach((x, index) => {
      let dataValues;
      let parameterName = x;
      let filteredData = data.filter(y => y.parameter === x);
      let dataset;

      filteredData.sort(compareDates);

      chartDataObject.labels = filteredData.map((x) => {
        return moment(x.date.local).format('DD/MM/YYYY HH:mm:ss')
      })
      
      dataValues = filteredData.map(z => {
        return z.value
      })
      dataset = {
        label: parameterName,
        data: dataValues,
        fill: false,
        borderColor: coloursArray[index],
        tension: 0.1
      }
      chartDataObject.datasets.push(dataset)
    });

    this.setState({
      chartData: chartDataObject,
      showChart: true
    });
  }

  reset() {
    this.setState({
      clickedCity: null,
      showChart: false
    });
  }

  render() {
    let citySelector = <CityList onSelect={(e) => this.setClickedCityValue(e)} items={this.state.citiesArray} selectedValue={this.state.clickedCity} />;
    let locationSelectorComponent;
    let chartElement;


    if(this.state.clickedCity) {
      locationSelectorComponent = (
        <LocationSelector
          getData={data => this.displayData(data)}
          onClick={() => this.setClickedCityValue(null)}
          city={this.state.clickedCity}
          reset={() => this.reset()}
        />
      );
      citySelector = null;
    }

    if(this.state.showChart) {
      chartElement = (
        <div style={{height: "600px", width: "800px"}}>
          <Line data={this.state.chartData}/>
        </div> 
      )
    }

    return (
      <div>
        {citySelector}
        {locationSelectorComponent}
        {chartElement}
      </div>
    )
  }

  componentDidMount() {
    axios.get('https://api.openaq.org/v1/cities?country=GB')
      .then(res => {
        let citiesArray = res.data.results.map(city => {
          return city
        });
        this.setState({
          citiesArray: citiesArray
        })
      })
  }
}

function compareDates(a, b) {
  if (moment(a.date.local).isBefore(b.date.local)){
    return -1;
  }
  if (moment(a.date.local).isAfter(b.date.local)){
    return 1;
  }
  return 0;
}

export default Application