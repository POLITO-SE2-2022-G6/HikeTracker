import { Container ,Paper,Button,Flex,Grid, CSSObject} from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { HikeCard } from "../../../components/hikeCard/hikeCard";
import { Hike } from '../../../generated/prisma-client';
import { useCallback, useContext, useEffect, useState } from 'react';
import { API } from '../../../utilities/api/api';
import { UserContext } from '../../../context/userContext';
import UserInfo from '../../../components/userInfo/userInfo';

const GuidePage = () => {

  const navigate = useNavigate();
  const [hikes, setHikes] = useState<Hike[]>([]);


  useEffect(() => {
    const getHikes = async () => {
      const hs = await  API.hike.getHikes() as Hike[];
      setHikes(hs)
    };

     if (hikes.length === 0) getHikes();
  }, [setHikes, hikes]);
  

    return (
      <>
     <UserInfo/>
      <Container sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        } as CSSObject}>  
         <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject }>
          <h1>Create</h1>      
           <Flex 
               direction={{ base: 'column', sm: 'row' }}
               gap={{ base: 'sm', sm: 'lg' }}
               justify={{ sm: 'center' }} >
                  <Button size="md" onClick={useCallback(() => { navigate("/hike/edit") },[navigate])}>New Hike </Button>             
                  <Button size="md" onClick={useCallback(() => { navigate("/hut/edit/") },[navigate])}>New Hut   </Button>                  
                 <Button size="md" onClick={useCallback(() => { navigate("/parkinglot/edit/") },[navigate])}>New Parking Lot  </Button>  
             </Flex>    
         </Paper>
         </Container>

         <Container>
         <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject 
        }>
           <h1>My Hikes</h1>
           <GuideHikeCardGrid hikes = {hikes} />
           </Paper>
      </Container>
</>  
    );
  };

  function GuideHikeCardGrid  ({ hikes }: { hikes?: Hike[] }) {
    const { state } = useContext(UserContext);
    
    let guideId = state.data?.id;

    return (
      <Grid >
        {
          hikes?.filter((h) => h.localguideid === guideId ).map( (h) => <Grid.Col span={'auto'} key={h.id}>
            <HikeCard hike={h} />
          </Grid.Col >)
        }
      </Grid>
    );
  }
  
  
  export default GuidePage;
