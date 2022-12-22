import s from './ParkingLotForm.module.css';
import { useForm } from '@mantine/form'
import axios from 'axios';
import { Button, Container, Paper, TextInput, Title, Group, Textarea, Box, Text, CSSObject } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { LatLng } from 'leaflet';
import { MapContainer, useMapEvent, TileLayer, Marker } from 'react-leaflet';
import { API } from '../../utilities/api/api';
import { CiLocationOn } from 'react-icons/ci';
import ErrorModal from '../../components/errorModal/errorModal';

const ParkingLotForm: React.FC = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [marker, setMarker] = useState<LatLng>(new LatLng(0, 0));
  const [display_name, setDisplayName] = useState('');

  const choosePosition = async (pos: LatLng) => {
    setMarker(pos);
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`,
      { params: { lat: pos.lat, lon: pos.lng, format: 'json', 'accept-language': 'it', zoom: 10 } }
    )
    if (res.data) {
      const { address, display_name } = res.data;
      setDisplayName(display_name);
      form.setValues({ city: address.city, province: address.county, region: address.state, latitude: pos.lat, longitude: pos.lng });
    }

  }


  type Fields = {
    title?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    province?: string;
    region?: string;
    city?: string;
    //gpstrack?: File;
  }

  const form = useForm<Fields>({
    initialValues: {
      title: '',
      description: '',
      province: '',
      region: '',
      city: '',
      //gpstrack: undefined,
    },

    validate: {
      title: (value: string) => (!value ? 'Title must not be empty' : null),
      description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  const handleSubmit = async (values: Fields) => {

    addHut(values)

  }

  const addHut = async (values: Fields) => {
    try {
      console.log(values);
      const res = await API.point.createPoint({
        city: values.city,
        latitude: values.latitude,
        longitude: values.longitude,
        province: values.province,
        region: values.region,
        label: values.title,
        parkingLot: {
          description: values.description,
        }
      });
      console.log(res);
      navigate('/hikelist');

    } catch (err: any) {
      setError('Error - creating a new parking lot' + err.message);
    }
  }

  return (
    <Container>
      <ErrorModal error={error} setError={setError} />
      <Title align="center">Add a new Parking Lot</Title>
      <Container sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        } as CSSObject}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject }>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Title"
              placeholder="Title of the hut"
              {...form.getInputProps('title')} />
            <Textarea
              label="Description"
              placeholder="Description of the hut"
              {...form.getInputProps('description')} />

            {display_name && <Paper p={'sm'} withBorder mt={'md'}>
              <Group>
                <CiLocationOn style={{ verticalAlign: 'middle' }} size='2em' />
                <Text fz='lg'>{display_name}</Text>
              </Group>
            </Paper>}

            <Box h='300px' mt={'md'}>
              <MapContainer center={[41.3, 12.5]} zoom={9} className={s.map} >

                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <EventHandler choosePosition={useCallback(choosePosition,[form])} />
                {marker && <Marker position={marker} />}
              </MapContainer>
            </Box>

            <TextInput hidden
              {...form.getInputProps('latitude')}
            />

            <TextInput hidden
              {...form.getInputProps('longitude')}
            />

            <TextInput hidden
              {...form.getInputProps('province')}
            />

            <TextInput hidden
              {...form.getInputProps('region')}
            />

            <TextInput hidden
              {...form.getInputProps('city')}
            />


            <Group position="center">
              <Button mt="xl" type='submit'>Add Hut</Button>
              <Link to="/guidearea">
                <Button mt="xl" color="red">Cancel</Button>
              </Link>
            </Group>
          </form>
        </Paper>
      </Container>
    </Container>
  )
}

interface EventHandlerProps {
  choosePosition: (marker: LatLng) => void;
}

const EventHandler = (props: EventHandlerProps) => {
  const { choosePosition } = props;
  useMapEvent('click', (e) => {
    choosePosition(e.latlng);
  })
  return null
}


export default ParkingLotForm;
