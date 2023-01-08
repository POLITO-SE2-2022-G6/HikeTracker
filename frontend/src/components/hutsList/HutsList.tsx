import { SimpleGrid } from '@mantine/core';
import { HutWithPoint } from '../../utilities/api/hutApi';
import { HutCard } from '../hutCard/hutCard';

type HutProps = {
  data: HutPoint[]
}

const HutsList = ({ data }: HutProps) => {

  const huts = data;

  return (
    <>
      <h2>Available Huts:</h2>
      <SimpleGrid cols={2}>
        {
          huts?.map((h) => <HutCard hut={h} key={h.id} />)
        }

      </SimpleGrid>
    </>
  );
}

type HutPoint = HutWithPoint


export default HutsList;
