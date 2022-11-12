import s from './HikesList.module.css';
import { Table } from '@mantine/core';
import  {useEffect, useState} from 'react';

const HikesList:React.FC = () => {

  const [hikes, setHikes] = useState([]);

  const getAllHikes = async() => {
    const hikes = await getHikes();
   setHikes(hikes);
  };

  useEffect(() => {getAllHikes() ;}, []);

  interface Hike  {
    id: number,
    title: string,
    length: number,
    expected_time: number,
    ascent: number,
    difficulty: string, 
    start_point: number, 
    end_point: number, 
    description: string, 
  }

  const getHikes = async () => {
    const response = await fetch('http://localhost:3001/', {
    });
    const hikesJson = await response.json();
    if(response.ok) {    
     return hikesJson.map((h:any) => h as Hike);  
    }
    else
      throw hikesJson;
  };

 // console.log(hikes);

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
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{
        hikes.map((h) => <HikeData hikes ={h} key={h['id']}/>)} 
   </tbody>
    </Table>
    </>
  );
}

function HikeData(props:any) {
  return(
    <>         
  <tr>
      <td>{props.hikes.title}</td>    
      <td>{props.hikes.length}</td> 
      <td>{props.hikes.expected_time}</td>  
      <td>{props.hikes.ascent}</td>   
      <td>{props.hikes.difficulty}</td>  
      <td>{props.hikes.start_point}</td> 
      <td>{props.hikes.end_point}</td>    
      <td>{props.hikes.description}</td>                   
  </tr>
  </>
  );
}

export default HikesList;
