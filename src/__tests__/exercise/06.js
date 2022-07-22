// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'
import {useCurrentPosition} from 'react-use-geolocation'

jest.mock('react-use-geolocation');

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 23,
      longitude: 45,
    }
  }

  let setReturnValue;
  useCurrentPosition.mockImplementation(() => {
    const [geoLocation, setGeoLocation] = React.useState([]);
    setReturnValue = setGeoLocation;
    return geoLocation;
  })

  render(<Location />);
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  await act(() => {
    setReturnValue([fakePosition])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(`Latitude: ${fakePosition.coords.latitude}`)
  expect(screen.getByText(/longitude/i)).toHaveTextContent(`Longitude: ${fakePosition.coords.longitude}`)
  screen.debug()
})

/*
eslint
  no-unused-vars: "off",
*/
