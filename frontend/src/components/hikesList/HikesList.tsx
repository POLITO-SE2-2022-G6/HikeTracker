import s from './HikesList.module.css';
import { Table } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

type HikeProps = {
  data?: any
}
interface Hike {
  id?: number,
  Title?: string,
  Length?: number,
  Expected_time?: number,
  Ascent?: number,
  Difficulty?: string,
  Start_point?: number,
  End_point?: number,
  Description?: string,
}

const HikesList = ({ data }: HikeProps) => {

  const [hikes, setHikes] = useState<Hike[]>([]);


  const getAllHikes = async () => {
    const hikes = await getHikes();
    setHikes(hikes);
  };

  useEffect(() => {
    if (data) {
      setHikes(data)
    } else {
      getAllHikes();
    }
  }, [data]);





  const getHikes = async () => {
    const response = await fetch('http://localhost:3001/hike', {
    });
    const hikesJson = await response.json();
    if (response.ok) {
      return hikesJson.map((h: any) => h as Hike);
    }
    else
      throw hikesJson;
  };

  return (
    <>
      <h2>Available Hikes:</h2>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Length</th>
            <th>Expected Time</th>
            <th>Ascent</th>
            <th>Difficulty</th>
            {/* <th>Start Point</th>
            <th>End Point</th> */}
            {/* <th>Description</th> */}
          </tr>
        </thead>
        <tbody>{
          hikes?.map((h) => <HikeData hike={h} key={h['id']} />)}
        </tbody>
      </Table>
    </>
  );
}

function HikeData({ hike }: { hike: Hike }) {
  const navigate = useNavigate()
  const { state, setState } = useContext(UserContext)

  return (
    <>
      <tr onClick={() => { if (state.loggedIn) navigate(`/hike/${hike.id}`) }}>
        <td>{hike.Title}</td>
        <td>{hike.Length}</td>
        <td>{hike.Expected_time}</td>
        <td>{hike.Ascent}</td>
        <td>{hike.Difficulty}</td>
        {/* <td>{props.hike['StartPointId']}</td>
        <td>{props.hike['EndPointId']}</td> */}
        {/* <td>{props.hike['Description']}</td> */}
      </tr>
    </>
  );
}

export default HikesList;
