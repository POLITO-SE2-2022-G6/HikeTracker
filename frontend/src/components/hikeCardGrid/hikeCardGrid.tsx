import { Grid } from "@mantine/core";
import { HikeCard } from "../../components/hikeCard/hikeCard";
import { Hike } from "../../utilities/api/types";


export const HikeCardGrid = ({ hikes }: { hikes?: Hike[] }) => {
  return (
    <Grid >
      {
        hikes?.map(h => <Grid.Col span={'auto'}>
          <HikeCard hike={h} />
        </Grid.Col >)
      }
    </Grid>
  );
}
