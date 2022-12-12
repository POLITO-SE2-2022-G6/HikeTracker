import s from './HikesList.module.css';
import { Pagination} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { API } from '../../utilities/api/api';
import { Hike } from '../../generated/prisma-client';
import { HikeCardGrid } from '../hikeCardGrid/hikeCardGrid';

type HikeProps = {
  data?: any
}

const elementsPerPage = 12;

const HikesList = ({ data }: HikeProps) => {

  const [hikes, setHikes] = useState<Hike[]>([]);
  const [page, setPage] = useState(1)


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

  const { state, setState } = useContext(UserContext)



  const getHikes = async () => {
    return await API.hike.getHikes() as Hike[];
  };

  return (
    <>
      <h2>Available Hikes:</h2>
     <HikeCardGrid hikes={hikes.slice((page - 1) * elementsPerPage, elementsPerPage * page)}/>
     <Pagination
              total={hikes.length / elementsPerPage + (hikes.length % elementsPerPage ? 1 : 0)}
              page={page}
              onChange={setPage}
            />
    </>
  );
}

export default HikesList;
