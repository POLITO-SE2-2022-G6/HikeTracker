import { Pagination} from '@mantine/core';
import { useEffect, useState } from 'react';
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

  useEffect( () => {
    const setH = async () => {
      data ? setHikes(data) : setHikes(await getHikes());
    }
    setH();
  }, [ data ]);

  const getHikes = async () => {
    return ((await API.hike.getHikes()) as Hike[]);
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
