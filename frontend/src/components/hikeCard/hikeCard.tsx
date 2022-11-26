import { Badge, Card, Group, Image, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { BsClockHistory } from "react-icons/bs";
import { GiMountains, GiPathDistance } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Hike } from "../../utilities/api/types";


interface HikeCardProps {
  hike: Hike;
}

const difficultyColor = ['', 'green', 'yellow', 'red', 'black'];
export const HikeCard = (props: HikeCardProps) => {
  const { state } = useContext(UserContext)
  const navigate = useNavigate()
  const { hike } = props;

  return (
    <div>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        maw={600}
        miw={350}

        onClick={() => { if (state.loggedIn) navigate(`/hike/${hike.id}`) }}
      >
        <Card.Section>
          <Image
            src={`imgs/${hike.id % 6 + 1}.jpg`}
            alt="Hero image"
            fit="cover"
            height={200}
            withPlaceholder
          />
        </Card.Section>

        <Group position="apart" my={'sm'}>
          <Title order={4}>{hike.Title}</Title>
          <Badge color={difficultyColor[hike.Difficulty]}>
            {['Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert'][hike.Difficulty]}
          </Badge>
        </Group>

        <Text size='sm' lineClamp={3}>{hike.Description}</Text>

        <Card.Section
          p='md'
        >

          <Group position="center">
            <Badge
              variant="outline"
              leftSection={<GiPathDistance style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{hike.Length.toFixed(1)} Km</Badge>
            <Badge
              variant="outline"
              leftSection={<GiMountains style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{hike.Ascent.toFixed(0)} M</Badge>
            <Badge
              variant="outline"
              leftSection={<BsClockHistory style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{
                formatTime(hike.Expected_time)
              }</Badge>
          </Group>
        </Card.Section>

      </Card>
    </div>
  );
};

function formatTime(minutes: number) {
  let date = new Date(0)
  date.setMinutes(minutes)

  return date.toLocaleTimeString('it-IT', { hour: 'numeric', minute: 'numeric', hour12: false })
}
