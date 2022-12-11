import s from './HikeForm.module.css';
import { useForm } from '@mantine/form'
import { Button, Container, Paper, TextInput, Title, NumberInput, FileInput, Group, Textarea, Box, Space, Flex, Stack } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconUpload } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import { API } from '../../utilities/api/api';
import { Hut, ParkingLot, Point } from '../../generated/prisma-client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L, { DivIcon, divIcon, icon } from 'leaflet';
import { MdCabin } from "react-icons/md";

import cabin from './cabin.svg';
import car from './car.svg';
import HutsList from '../../components/hutsList/HutsList';

const hutIcon = divIcon({
  html: cabin
})

const HikeForm: React.FC = () => {

  const { id } = useParams()
  const navigate = useNavigate();
  const [error, setError] = useState('');

  type Points = Point & {
    hut?: Hut
    parkinglot?: ParkingLot
  }


  const [points, setPoints] = useState<Points[]>([])
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [hutMarker, setHutMarker] = useState<number | null>(null)
  const[created,setCreated]=useState<number[]>([]);
  const[deleted,setDeleted]=useState<number[]>([]);


  


  type Fields = {
    title?: string;
    length?: number;
    expected_time?: number;
    ascent?: number;
    difficulty?: number;
    startpointid?: number;
    endpointid?: number;
    description?: string;
    gpstrack?: File;
    huts?: {created: number[],
             deleted:    number[] } ;
  }

  const form = useForm<Fields>({
    initialValues: {
      title: '',
      length: undefined,
      expected_time: undefined,
      ascent: undefined,
      difficulty: undefined,
      startpointid: undefined,
      endpointid: undefined,
      description: '',
      gpstrack: undefined,
      huts: {created: [],
        deleted:    [] } ,
    },

    validate: {
      title: (value: string) => (!value ? 'Title must not be empty' : null),
      length: (value: number) => (!value ? 'Length must not be empty' : null),
      expected_time: (value: number) => (!value ? 'Expected time must not be empty' : null),
      ascent: (value: number) => (!value ? 'Ascent must not be empty' : null),
      difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
      // StartPointId: (value: number) => (!value ? 'Start point must not be empty' : null),
      // EndPointId: (value: number) => (!value ? 'End point must not be empty' : null),
      description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  useEffect(() => {
    const fetchHike = async () => {
      if (id) {
        const hike = await API.hike.getHike(parseInt(id))
        if (!hike) return
        form.setValues({
          title: hike.title,
          length: hike.length,
          expected_time: hike.expected_time,
          ascent: hike.ascent,
          difficulty: hike.difficulty,
          // StartPointId: hike.StartPoint,
          // EndPointId: hike.EndPoint,
          description: hike.description!,
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
      navigate('/hikelist');

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
              {...form.getInputProps('title')} />
            <Textarea
              label="Description"
              placeholder="Description of the hike"
              {...form.getInputProps('description')} />
            <NumberInput
              label="Length"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="2"
              min={1}
              {...form.getInputProps('length')} />
            <NumberInput
              label="Expected Time"
              placeholder="10"
              min={1}
              {...form.getInputProps('expected_time')} />
            <NumberInput
              label="Ascent"
              description="In meters"
              precision={1}
              step={0.5}
              placeholder="Ascent of the hike"
              {...form.getInputProps('ascent')}
            />
            <NumberInput
              label="Difficulty"
              placeholder="0"
              min={0}
              max={4}
              {...form.getInputProps('difficulty')} />
            <FileInput
              label="Gps Track"
              placeholder=""
              accept=".gpx"
              icon={<IconUpload size={14} />}
              {...form.getInputProps('gpstrack')}
            />

            <TextInput
              hidden
              {...form.getInputProps('startpointid')}
            />
            <TextInput
              hidden
              {...form.getInputProps('endpointid')}
            />
              <TextInput
              hidden
              {...form.getInputProps('huts')}
            />

            <Space h={'md'} />
            <Flex wrap="wrap">
              <Box h={'400px'} style={{
                flexGrow: 1,
                minWidth: '400px',
              }}>
                <MapContainer center={[41.90, 12.49]} zoom={8} className={s.map}>
                  {
                    points.map((point,id) => {
                      if (point.hut || point.parkinglot)
                    //  if ( point.parkinglotid || point.hutid)
                        return( <Marker
                        key={id}
                          position={[point.latitude!, point.longitude!]}
                           icon={ (point.hut) ? L.icon({ iconUrl: cabin}) : L.icon({ iconUrl: car})}
                          eventHandlers={{
                            click: () => {
                              setSelectedMarker(point.id)
                              if(point.id === point.hut?.pointid){
                                setHutMarker(point.id);
                                console.log("selected hut: ", point.hut.pointid);
                                setCreated([...created,point.id]);
                                console.log(created);
                                setDeleted([...deleted,]);
                              }
                            }
                          }}
                        >
                          <Popup>
                            {point.label}
                          </Popup>
                        </Marker>)
                    })
                  }
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </Box>
              <Box>
                <Stack p={'md'}>
                  <Button type="button" onClick={() => { selectedMarker && form.setValues({ startpointid: selectedMarker }) }}> Set as Start Point </Button>
                  <Button type="button" onClick={() => { selectedMarker && form.setValues({ endpointid: selectedMarker }) }}> Set as End Point </Button>
                  <Button onClick= {() => {form.setValues({  huts: { created: created , deleted: deleted } }) }}>
                    Link Hut</Button>
                </Stack> 
              </Box>
              {/* buttons */}

            </Flex>

            <Group position="center">
              <Button mt="xl" type='submit'>Save</Button>
              <Link to="/hikelist">
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
