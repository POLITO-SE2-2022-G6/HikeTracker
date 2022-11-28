import s from './HikeForm.module.css';
import { useForm } from '@mantine/form'
import axios from 'axios';
import { Button, Container, Paper, TextInput, Title, NumberInput, FileInput, Group, Textarea, Box, Space, Flex, Stack } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconUpload } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import { API } from '../../utilities/api/api';
import { Hut, ParkingLot, Point } from '../../generated/prisma-client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { DivIcon, divIcon } from 'leaflet';

import cabin from './cabin.svg';

const hutIcon = divIcon({
  html: cabin
})

const HikeForm: React.FC = () => {

  const { id } = useParams()
  const navigate = useNavigate();
  const [error, setError] = useState('');

  type Points = Point & {
    Hut?: Hut
    ParkingLot?: ParkingLot
  }


  const [points, setPoints] = useState<Points[]>([])
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)


  type Fields = {
    Title?: string;
    Length?: number;
    Expected_time?: number;
    Ascent?: number;
    Difficulty?: number;
    StartPointId?: number;
    EndPointId?: number;
    Description?: string;
    GpsTrack?: File;
  }

  const form = useForm<Fields>({
    initialValues: {
      Title: '',
      Length: undefined,
      Expected_time: undefined,
      Ascent: undefined,
      Difficulty: undefined,
      StartPointId: undefined,
      EndPointId: undefined,
      Description: '',
      GpsTrack: undefined,
    },

    validate: {
      Title: (value: string) => (!value ? 'Title must not be empty' : null),
      Length: (value: number) => (!value ? 'Length must not be empty' : null),
      Expected_time: (value: number) => (!value ? 'Expected time must not be empty' : null),
      Ascent: (value: number) => (!value ? 'Ascent must not be empty' : null),
      Difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
      // StartPointId: (value: number) => (!value ? 'Start point must not be empty' : null),
      // EndPointId: (value: number) => (!value ? 'End point must not be empty' : null),
      Description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  useEffect(() => {
    const fetchHike = async () => {
      if (id) {
        const hike = await API.hike.getHike(parseInt(id))
        if (!hike) return
        form.setValues({
          Title: hike.Title,
          Length: hike.Length,
          Expected_time: hike.Expected_time,
          Ascent: hike.Ascent,
          Difficulty: hike.Difficulty,
          // StartPointId: hike.StartPoint,
          // EndPointId: hike.EndPoint,
          Description: hike.Description!,
        })
      }
    }
    fetchHike()

    const getPoints = async () => {
      try {
        const points = await API.point.getPoints()
        setPoints(points!)
        console.log(points)
      } catch (error) {
        console.error(error)
      }
    }
    getPoints()

  }, [])



  const handleSubmit = async (values: Fields) => {
    console.log('submitting', values)
    if (id) {
      editHike(values)
    } else {
      addHike(values)
    }

  }

  const editHike = async (values: Fields) => {
    try {
      const response = await API.hike.updateHike(parseInt(id!), values)
      navigate('/hike/' + id)

    } catch (error) {
      setError("Error while editing hike")
    }
  }

  const addHike = async (values: Fields) => {
    try {
      console.log(values);

      const res = await API.hike.createHike(values)
      navigate('/');

    } catch (err) {
      setError('Error - creating a new hike');
    }
  }

  return (
    <Container>
      <Title align="center">
        {id ? 'Edit a hike' : 'Add a New Hike'}
      </Title>
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
              placeholder="Title of the hike"
              {...form.getInputProps('Title')} />
            <Textarea
              label="Description"
              placeholder="Description of the hike"
              {...form.getInputProps('Description')} />
            <NumberInput
              label="Length"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="2"
              min={1}
              {...form.getInputProps('Length')} />
            <NumberInput
              label="Expected Time"
              placeholder="10"
              min={1}
              {...form.getInputProps('Expected_time')} />
            <NumberInput
              label="Ascent"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="Ascent of the hike"
              {...form.getInputProps('Ascent')}
            />
            <NumberInput
              label="Difficulty"
              placeholder="0"
              min={0}
              max={4}
              {...form.getInputProps('Difficulty')} />
            <FileInput
              label="Gps Track"
              placeholder=""
              accept=".gpx"
              icon={<IconUpload size={14} />}
              {...form.getInputProps('GpsTrack')}
            />

            <TextInput
              hidden
              {...form.getInputProps('StartPointId')}
            />
            <TextInput
              hidden
              {...form.getInputProps('EndPointId')}
            />

            <Space h={'md'} />
            <Flex wrap="wrap">
              <Box h={'400px'} style={{
                flexGrow: 1,
                minWidth: '400px',
              }}>
                <MapContainer center={[41.90, 12.49]} zoom={8} className={s.map}>
                  {
                    points.map((point) => {
                      if (point.Hut || point.ParkingLot)
                        return <Marker
                          position={[point.Latitude!, point.Longitude!]}
                          // icon={hutIcon}
                          eventHandlers={{
                            click: () => {
                              setSelectedMarker(point.id)
                            }
                          }}
                        >
                          <Popup>
                            {point.Label}
                          </Popup>
                        </Marker>
                    })
                  }
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </Box>
              <Box>
                <Stack p={'md'}>
                  <Button type="button" onClick={() => { selectedMarker && form.setValues({ StartPointId: selectedMarker }) }}> Set as Start Point </Button>
                  <Button type="button" onClick={() => { selectedMarker && form.setValues({ EndPointId: selectedMarker }) }}> Set as End Point </Button>
                </Stack>
              </Box>
              {/* buttons */}

            </Flex>

            <Group position="center">
              <Button mt="xl" type='submit'>Save</Button>
              <Link to="/">
                <Button type="button" mt="xl" color="red">Cancel</Button>
              </Link>
            </Group>

          </form>
        </Paper>
      </Container>

    </Container >
  )
}

export default HikeForm;
