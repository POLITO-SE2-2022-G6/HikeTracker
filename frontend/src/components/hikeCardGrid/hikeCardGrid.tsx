import { Grid } from "@mantine/core";
import { HikeCard } from "../../components/hikeCard/hikeCard";
import { Hike } from "../../generated/prisma-client";


export const HikeCardGrid = ({ hikes }: { hikes?: Hike[] }) => {
  return (
    <Grid >
      {
        hikes?.map(h => <Grid.Col key={h.id} span={'auto'}>
          <HikeCard hike={h} />
        </Grid.Col >)
      }
    </Grid>
  );
}
