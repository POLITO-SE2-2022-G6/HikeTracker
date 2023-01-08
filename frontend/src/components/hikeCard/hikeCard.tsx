import { Badge, Card, Group, Image, Text, Title } from "@mantine/core";
import { useCallback, useContext } from "react";
import { BsClockHistory } from "react-icons/bs";
import { GiMountains, GiPathDistance } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Hike } from "../../generated/prisma-client";
import { formatTime } from "../../utilities/formatters";



interface HikeCardProps {
  hike: Hike;
}

const difficultyColor = ['green', 'blue', 'yellow', 'orange', 'red'];
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

        onClick={useCallback(() => { if (state.loggedIn) navigate(`/hike/${hike.id}`) }, [state, hike.id, navigate])}
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
          <Title order={4}>{hike.title}</Title>
          <Badge color={difficultyColor[hike.difficulty]}>
            {['Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert'][hike.difficulty]}
          </Badge>
        </Group>

        <Text size='sm' lineClamp={3}>{hike.description}</Text>

        <Card.Section p='md'>
          <Group position="center">
            <Badge
              variant="outline"
              leftSection={<GiPathDistance style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{hike.length.toFixed(1)} Km</Badge>
            <Badge
              variant="outline"
              leftSection={<GiMountains style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{hike.ascent.toFixed(0)} M</Badge>
            <Badge
              variant="outline"
              leftSection={<BsClockHistory style={{ verticalAlign: 'middle' }} size='1.5em' />}
              size="lg"
            >{
                formatTime(hike.expected_time)
              }</Badge>
          </Group>
        </Card.Section>
      </Card>
    </div>
  );
};
