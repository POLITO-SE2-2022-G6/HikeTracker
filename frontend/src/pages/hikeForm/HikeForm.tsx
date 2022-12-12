import s from './HikeForm.module.css';
import { useForm } from '@mantine/form'
import axios from 'axios';
import { Button, Container, Paper, TextInput, Title, NumberInput, FileInput, Group, Textarea, Box, Space, Flex, Stack, Tabs } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconUpload } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import { API } from '../../utilities/api/api';
import { Hut, ParkingLot, Point } from '../../generated/prisma-client';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { DivIcon, divIcon, icon } from 'leaflet';


import cabin from './cabin.svg';
import { extrackPoints } from '../../utilities/gpx';
import { MapSetter } from '../hike/HikeDetailPage';
import { fullHike } from '../../utilities/api/hikeApi';
import car from './car.svg';

const hutIcon = divIcon({
  html: cabin
})

const HikeForm: React.FC = () => {

  type editArray = {
    created: Point[],
    deleted: number[],
  }

  const { id } = useParams()
  const navigate = useNavigate();
  const [hike, setHike] = useState<fullHike | null>(null)
  const [error, setError] = useState('');
  const [track, setTrack] = useState<[number, number][]>([])
  const [center, setCenter] = useState<[number, number]>([41.8, 12.4])
  const [settingRP, setSettingRP] = useState(true)
  const [reference_points, setReferencePoints] = useState<Point[]>([])
  const [activeTab, setActiveTab] = useState<string | null>('first');

  const [referencePointsEdit, setReferencePointsEdit] = useState<editArray>({ created: [], deleted: [] })
  const [newReferencePoint, setNewReferencePoint] = useState<Point>()

  type Points = Point & {
    hut?: Hut
    parkinglot?: ParkingLot
  }

  const [points, setPoints] = useState<Points[]>([])
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [hutsEdit, setHutsEdit] = useState<{ created: number[], deleted: number[] }>({ created: [], deleted: [] })






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
    reference_points?: editArray
    huts?: {
      created: number[],
      deleted: number[]
    };
  }

  type inputFields = Fields & { huts?: { created: number[] } };

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
      huts: {
        created: [],
        deleted: []
      },
    },

    validate: {
      title: (value: string) => (!value ? 'Title must not be empty' : null),
      length: (value: number) => (!value ? 'Length must not be empty' : null),
      expected_time: (value: number) => (!value ? 'Expected time must not be empty' : null),
      ascent: (value: number) => (!value ? 'Ascent must not be empty' : null),
      difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
      description: (value: string) => (!value ? 'Description must not be empty' : null),
    },
  });

  useEffect(() => {
    const fetchHike = async () => {
      if (id) {
        const hike = await API.hike.getHike(parseInt(id))
        if (!hike) return
        setHike(hike)
        form.setValues({
          title: hike.title,
          length: hike.length,
          expected_time: hike.expected_time,
          ascent: hike.ascent,
          difficulty: hike.difficulty,
          description: hike.description!,
        })

        if (hike.gpstrack) {
          const xml = await axios.get(`http://localhost:3001/` + hike.gpstrack, { withCredentials: true })
          const points = extrackPoints(xml.data)
          setTrack(points)
          setCenter(points[0])
        }
      }
    }
    fetchHike()

    const getPoints = async () => {
      try {
        const points = await API.point.getPoints()
        setPoints(points!)
      } catch (error) {
        console.error(error)
      }
    }
    getPoints()

  }, [])

  useEffect(() => {
    if (form.values.gpstrack) {
      form.values.gpstrack.text().then(content => {
        const data = extrackPoints(content)
        setCenter(data[0])
        setTrack(data)
      }

      )
    }
  }, [form.values.gpstrack])



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
      const response = await API.hike.updateHike(parseInt(id!), {
        ...values,
        reference_points: JSON.stringify({
          created: referencePointsEdit.created.map(e => {
            return {
              latitude: e.latitude,
              longitude: e.longitude,
            }
          }),
          deleted: referencePointsEdit.deleted
        }),
        huts: JSON.stringify(hutsEdit)
      })
      navigate('/hike/' + id)

    } catch (error) {
      setError("Error while editing hike")
    }
  }

  const addHike = async (values: inputFields) => {
    try {
      console.log(values);

      const res = await API.hike.createHike({
        ...values,
        reference_points: JSON.stringify(referencePointsEdit),
        huts: JSON.stringify(hutsEdit)
      })
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
            <Tabs value={activeTab} onTabChange={setActiveTab} mb="md" >
              <Tabs.List grow>
                <Tabs.Tab value="ends">Start & End points</Tabs.Tab>
                <Tabs.Tab value="reference">Reference Points</Tabs.Tab>
                <Tabs.Tab value="huts">Huts</Tabs.Tab>
              </Tabs.List>
            </Tabs>


            <Flex wrap="wrap">
              <Box h={'400px'} style={{
                flexGrow: 1,
                minWidth: '400px',
              }}>
                <MapContainer center={[41.90, 12.49]} zoom={8} className={s.map}>
                  <DisplayTrack />

                  {activeTab == 'ends' && <DisplayHutsAndParkinglots />}
                  {activeTab == 'reference' && [<DisplayReferencePoints />, <ReferencePointClicker />]}
                  {(activeTab == 'huts' || activeTab == 'ends') && [<DisplayOwnHuts />, <DisplayHuts/>]}

                  <MapSetter center={center} />

                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </Box>
              <Box>
                <Stack p={'md'}>
                  {activeTab == 'ends' && <EndsButtons />}
                  {activeTab == 'reference' && <ReferenceButtons />}
                  {activeTab == 'huts' && <HutsButtons />}
                </Stack>
              </Box>
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

  function EndsButtons() {
    return <>
      <Button type="button" onClick={() => { selectedMarker && form.setValues({ startpointid: selectedMarker }) }}> Set as Start Point </Button>
      <Button type="button" onClick={() => { selectedMarker && form.setValues({ endpointid: selectedMarker }) }}> Set as End Point </Button>
    </>
  }

  function ReferenceButtons() {
    return <>
      <Button type="button" onClick={() => { newReferencePoint && setReferencePointsEdit(current => ({ ...current, created: [...current.created, newReferencePoint] })) }}> Add Point </Button>
      <Button type="button" onClick={() => { selectedMarker && selectedMarker != -1 && setReferencePointsEdit(current => ({ ...current, deleted: [...current.deleted, selectedMarker] })) }}> Remove Point</Button>
    </>
  }

  function HutsButtons() {
    return <>
      <Button type="button" onClick={() => { selectedMarker && setHutsEdit(current => ({ ...current, created: [...current.created, selectedMarker] })) }}> Link Hut </Button>
      <Button type="button" onClick={() => { selectedMarker && setHutsEdit(current => ({ ...current, deleted: [...current.deleted, selectedMarker] })) }}> Remove Hut </Button>
    </>
  }

  function DisplayOwnHuts() {
    if (!hike || !hike.huts) return (<></>)
    return <>
      {hike.huts.map((hut) => {
        return <Marker
          position={[hut.point.latitude!, hut.point.longitude!]}
          icon={hutIcon}
          eventHandlers={{
            click: () => {
              setSelectedMarker(hut.id)
            }
          }}
        />
      })}
    </>
  }

  function DisplayTrack() {
    if (!track) return (<></>)

    return <Polyline
      positions={track}
    />
  }

  function DisplayReferencePoints() {
    if (!hike || !hike.reference_points) return (<></>)

    const toDisplay = [...hike.reference_points, ...referencePointsEdit.created]
      .filter(p => p.id ? !referencePointsEdit.deleted.includes(p.id) : true);
    return <>
      {
        toDisplay
          .map((point) => {
            return <DisplayPoint point={point} />
          })}
    </>
  }

  function DisplayHuts() {
    return <>
      {points.map((point) => {
        if (point.hut)
          return <DisplayPoint point={point} />
      })}
    </>
  }

  function DisplayHutsAndParkinglots() {
    return <>
      {points.map((point) => {
        if (point.hut || point.parkinglot)
          return <DisplayPoint point={point} />
      })}
    </>
  }

  function DisplayPoint(props: { point: Points }) {
    const { point } = props
    let icon = new L.Icon.Default()
    if (point.hut)
      icon = L.icon({ iconUrl: cabin })
    else if (point.parkinglot)
      L.icon({ iconUrl: car })


    return <Marker
      position={[point.latitude!, point.longitude!]}
      icon={icon}
      eventHandlers={{
        click: () => {
          setSelectedMarker(point.id);
        }
      }}

    >
      <Popup>
        {point.label}
      </Popup>
    </Marker>;
  }

  function ReferencePointClicker() {
    const [click, setClick] = useState([0, 0])

    const map = useMapEvents({
      click: (e) => {
        if (!settingRP || !track) return
        // find closes coordinates belonging to the track to the clicked position
        const closest = track.reduce((prev, curr) => {
          const prevDistance = distance([prev[0], prev[1]], [e.latlng.lat, e.latlng.lng])
          const currDistance = distance([curr[0], curr[1]], [e.latlng.lat, e.latlng.lng])
          return (prevDistance < currDistance) ? prev : curr
        })
        setClick(closest)
        console.log("closest", closest)
        setNewReferencePoint({
          id: -1,
          latitude: closest[0],
          longitude: closest[1],
          label: 'New Reference Point',
          elevation: 0,
          city: '',
          region: '',
          province: '',
        })
      }
    })

    if (click)
      return <Marker position={{ lat: click[0], lng: click[1] }} />

    return null
  }

  function distance(a: [number, number], b: [number, number]) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
  }
}

export default HikeForm;
