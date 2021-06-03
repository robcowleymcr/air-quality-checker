import React from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

function CityList(props) {
  const listItems = props.items.map((city) =>
    <Dropdown.Item
      eventKey={city.name.toString()}
      key={city.name.toString()}
    >
      {city.name}
    </Dropdown.Item>
  );

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Air Quality Checker</Card.Title>
        <Card.Text>
          1. Please select a city.
        </Card.Text>
        <DropdownButton
          id="dropdown-basic-button"
          title="Dropdown button"
          onSelect={props.onSelect}
        >
          {listItems}
        </DropdownButton>
      </Card.Body>
    </Card>
  )
}

export default CityList