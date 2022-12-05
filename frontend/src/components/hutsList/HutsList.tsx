import s from './HutsList.module.css';
import { Table } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { API } from '../../utilities/api/api';
import { Hut, Point } from '../../generated/prisma-client';

type HutProps = {
  data: HutPoint[]
}

const HutsList = ({ data }: HutProps) => {

  const huts = data;


  return (
    <>
      <h2>Available Huts:</h2>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{
          huts?.map((h) => <HutData hut={h} key={h.id} />)}
        </tbody>
      </Table>
    </>
  );
}

type HutPoint = Point & {
  Hut: Hut;
};

function HutData({ hut }: { hut: HutPoint }) {
  const navigate = useNavigate()
  const { state, setState } = useContext(UserContext)

  return (
    <>
      <tr onClick={() => { if (state.loggedIn) navigate(`/hut/${hut.id}`) }}>
        <td>{hut.label}</td>
        <td>{hut.Hut.description}</td>
      </tr>
    </>
  );
}

export default HutsList;
