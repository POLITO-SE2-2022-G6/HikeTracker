import s from './HutsList.module.css';
import { Table } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { API } from '../../utilities/api/api';
import { Hut } from '../../generated/prisma-client';

type HutProps = {
  data?: any
}

const HutsList = ({ data }: HutProps) => {

  const [huts, setHuts] = useState<Hut[]>([]);


  const getAllHuts = async () => {
    const hikes = await getHuts();
    setHuts(hikes);
  };

  useEffect(() => {
    if (data) {
      setHuts(data)
    } else {
      getAllHuts();
    }
  }, [data]);

  const getHuts = async () => {
    return await API.hut.getHuts() as Hut[];
  };

  return (
    <>
      <h2>Available Huts:</h2>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{
          huts?.map((h) => <HutData hut={h} key={h['id']} />)}
        </tbody>
      </Table>
    </>
  );
}

function HutData({ hut }: { hut: Hut }) {
  const navigate = useNavigate()
  const { state, setState } = useContext(UserContext)

  return (
    <>
      <tr onClick={() => { if (state.loggedIn) navigate(`/hike/${hut.id}`) }}>
        <td>{hut.Description}</td>
      </tr>
    </>
  );
}

export default HutsList;
