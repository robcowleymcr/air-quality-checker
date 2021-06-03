import React from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

class LocationSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationOptionElements: [],
      results: [],
      selectedLocation: null
    }
    this.change = this.change.bind(this);
  }

  change(event) {
    this.setState({
      selectedLocation: event.target.value
    })
  }

  getData(city) {
    this.setState({
      selectedLocation: city
    })
    const dataForSelectedLocation = this.state.results.filter(x => x.location === city);
    this.props.getData(dataForSelectedLocation)
  }

  render() {
    let cardText = !this.state.selectedLocation ? "2. Please select a location." : `Air quality data for ${this.state.selectedLocation}`;
    let buttonElement;

    if(!this.state.selectedLocation) {
      buttonElement = (
        <DropdownButton
          id="dropdown-basic-button"
          title="Dropdown button"
          onSelect={(val) => this.getData(val)}
        >
          {this.state.locationOptionElements}
        </DropdownButton>
      )
    } else {
      buttonElement = (
        <Button onClick={() => this.props.reset()}>Try again!</Button>
      )
    }

    return (
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Air Quality Checker</Card.Title>
          <Card.Text>
            {cardText}  
          </Card.Text>
          {buttonElement}
        </Card.Body>
      </Card>
    )
  }

  componentDidMount() {
    axios.get(`https://api.openaq.org/v1/measurements?country=GB&city=${this.props.city}`)
      .then(response => {
        let measurementLocations = [];
        const results = response.data.results;
        results.forEach(obj => {
          if (!measurementLocations.includes(obj.location)) {
            measurementLocations.push(obj.location);
          }
        })
        const optionElements = measurementLocations.map((location, index) =>
          <Dropdown.Item key={index.toString()} eventKey={location}>{location}</Dropdown.Item>
        );
        this.setState({
          locationOptionElements: optionElements,
          results: results
        })
      })
  }
}

export default LocationSelector