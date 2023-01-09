import { Card, Center, Text, Title,Image } from "@mantine/core";
import { IconBed, IconMap2, IconMountain, IconPhone, IconWorldWww } from "@tabler/icons";

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

export const HutCard = (props: HutCardProps) => {
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
           <Image
            src={(hut.image  && 'http://localhost:3001/'+hut.image) || `imgs/huts/${hut.id % 7 + 1}.jpg`}
            alt="Hero image"
            fit="cover"
            height={200}
            withPlaceholder
          />
          <Title order={4}>{hut.name || "Bellissimo Nome"}</Title>
          
          <Text lineClamp={2}>
            {hut.description}
          </Text>
        </Card.Section>
        <Card.Section p="md">
          {IconWithText({ icon: <IconMap2 />, text: <Text>{hut.point.region}, {hut.point.province}</Text> })}
          {IconWithText({ icon: <IconMountain />, text: <Text><b>{hut.point.elevation}</b> m</Text> })}
          {IconWithText({ icon: <IconBed />, text: <Text><b>{hut.beds}</b> beds</Text> })}
          {IconWithText({ icon: <IconPhone />, text: <Text>{hut.phone}</Text> })}
          {IconWithText({ icon: <IconWorldWww />, text: <Text>{hut.website}</Text> })}
        </Card.Section>


      </Card>
    </div>
  );
}
