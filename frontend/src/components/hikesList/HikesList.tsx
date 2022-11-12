import s from './HikesList.module.css';
import { Table } from '@mantine/core';
import { useEffect, useState } from 'react';

type HikeProps = {
  data?: any
}

const HikesList = ({ data }: HikeProps) => {

  const [hikes, setHikes] = useState([]);

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


  interface Hike {
    id?: number,
    title?: string,
    length?: number,
    expected_time?: number,
    ascent?: number,
    difficulty?: string,
    start_point?: number,
    end_point?: number,
    description?: string,
  }

  const getHikes = async () => {
    const response = await fetch('http://localhost:3001/', {
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
            <th>Start Point</th>
            <th>End Point</th>
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

function HikeData(props: any) {
  return (
    <>
      <tr>
        <td>{props.hike['Title']}</td>
        <td>{props.hike['Length']}</td>
        <td>{props.hike['Expected_time']}</td>
        <td>{props.hike['Ascent']}</td>
        <td>{props.hike['Difficulty']}</td>
        <td>{props.hike['StartPointId']}</td>
        <td>{props.hike['EndPointId']}</td>
        {/* <td>{props.hike['Description']}</td> */}
      </tr>
    </>
  );
}

export default HikesList;
