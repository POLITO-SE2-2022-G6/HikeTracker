import s from './GuidePage.module.css';
import { Container ,Paper,Button,Flex,Grid} from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { HikeCard } from "../../../components/hikeCard/hikeCard";
import { Hike } from '../../../generated/prisma-client';
import { useContext, useEffect, useState } from 'react';
import { API } from '../../../utilities/api/api';
import { UserContext } from '../../../context/userContext';
import UserInfo from '../../../components/userInfo/userInfo';

const GuidePage = () => {

  const navigate = useNavigate();
  const [hikes, setHikes] = useState<Hike[]>([]);


  const getAllHikes = async () => {
    const hikes = await  getHikes()
    setHikes(hikes)
  };

  useEffect(() => {
      getAllHikes();
  }, []);
  
  const getHikes = async () => {
    return await API.hike.getHikes() as Hike[];
  };

    return (
      <>
     <UserInfo/>
      <Container sx={(t) => {
        return {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        }
      }}>  
         <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={
          (t) => {
            return {
              flexGrow: 1,
              flexShrink: 0,
            }
          }
        }>
          <h1>Create</h1>      
           <Flex 
               direction={{ base: 'column', sm: 'row' }}
               gap={{ base: 'sm', sm: 'lg' }}
               justify={{ sm: 'center' }} >
                  <Button size="md" onClick={() => { navigate("/hike/edit") }}>New Hike </Button>             
                  <Button size="md" onClick={() => { navigate("/hut/edit/") }}>New Hut   </Button>                  
                 <Button size="md" onClick={() => { navigate("/parkinglot/edit/") }}>New Parking Lot  </Button>  
             </Flex>    
         </Paper>
         </Container>

         <Container>
         <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={
          (t) => {
            return {
              flexGrow: 1,
              flexShrink: 0,
            }
          }
        }>
           <h1>My Hikes</h1>
           <GuideHikeCardGrid hikes = {hikes} />
           </Paper>
      </Container>
</>  
    );
  };

  function GuideHikeCardGrid  ({ hikes }: { hikes?: Hike[] }) {
    const { state, setState } = useContext(UserContext);
    
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
