import { Badge, Card, Center, Group, Image, Text, Title } from "@mantine/core";
import { IconBed, IconMap, IconMap2, IconMountain, IconPhone, IconWorldWww } from "@tabler/icons";
import { useContext } from "react";
import { Stack } from "react-bootstrap";
import { BsClockHistory } from "react-icons/bs";
import { GiMountains, GiPathDistance } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Hut } from "../../generated/prisma-client";
import { HutWithPoint } from "../../utilities/api/hutApi";



interface HutCardProps {
  hut: HutWithPoint;
}

function IconWithText({ icon, text }: { icon: React.ReactNode, text: React.ReactNode }) {
  return (<div>
    <Center inline>
      {icon}
      &nbsp;
      {text}
    </Center>
  </div>);
}

const difficultyColor = ['', 'green', 'yellow', 'red', 'black'];
export const HutCard = (props: HutCardProps) => {
  const { state } = useContext(UserContext)
  const navigate = useNavigate()
  const { hut } = props;

  return (
    <div>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        maw={450}
        miw={350}

      // onClick={() => { if (state.loggedIn) navigate(`/hut/${hut.id}`) }}
      >
        <Card.Section px={'lg'} py="sm" style={
          {
            borderBottom: '1px solid #eaeaea',
          }
        }>
          <Title order={4}>{hut.name || "Bellissimo Nome"}</Title>

          <Text lineClamp={2}>
            {hut.description}
          </Text>
        </Card.Section>
        <Card.Section p="md">
          {IconWithText({ icon: <IconMap2 />, text: <Text>{hut.point.city}, {hut.point.province}</Text> })}
          {IconWithText({ icon: <IconMountain />, text: <Text><b>{hut.point.elevation}</b> m</Text> })}
          {IconWithText({ icon: <IconBed />, text: <Text><b>{Math.floor(Math.random() * 5)}</b> beds</Text> })}
          {IconWithText({ icon: <IconPhone />, text: "123345456" })}
          {IconWithText({ icon: <IconWorldWww />, text: "www.hut.com" })}
        </Card.Section>


      </Card>
    </div>
  );
}
