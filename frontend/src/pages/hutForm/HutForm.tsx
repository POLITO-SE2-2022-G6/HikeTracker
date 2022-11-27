import s from './HutForm.module.css';
import { useForm } from '@mantine/form'
import axios from 'axios';
import { Button, Container, Paper, TextInput, Title, Group, Textarea, Box, Text } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { API } from '../../utilities/api/api';
import { CiLocationOn } from 'react-icons/ci';
//import { IconUpload } from '@tabler/icons';
//import { useParams } from 'react-router-dom';

const HutForm: React.FC = () => {

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
        City: values.city,
        Latitude: values.latitude,
        Longitude: values.longitude,
        Province: values.province,
        Region: values.region,
        Label: values.title,
        Hut: {
          Description: values.description,
        }
      });
      console.log(res);
      navigate('/');

    } catch (err) {
      setError('Error - creating a new hut');
    }
  }

  return (
    <Container>
      <Title align="center">Add a new Hut</Title>
      <Container sx={(t) => {
        return {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }
      }}>
        <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={
          (t) => {
            return {
              flexGrow: 1,
              flexShrink: 0,
            }
          }
        }>
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
                <EventHandler choosePosition={choosePosition} />
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
  const map = useMapEvent('click', (e) => {
    choosePosition(e.latlng);
  })
  return null
}


export default HutForm;
