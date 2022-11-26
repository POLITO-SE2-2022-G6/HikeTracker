import s from './GuidePage.module.css';
import { Container ,Paper,Button,Flex} from '@mantine/core';
import { Link,useNavigate } from "react-router-dom";



const GuidePage: React.FC = () => {

  const navigate = useNavigate();
  
    return (
      <>
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
                  <Button size="md" onClick={() => { navigate("") }}>New Hut   </Button>                  
                 <Button size="md" onClick={() => { navigate("") }}>New Parking Lot  </Button>  
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
           </Paper>
      </Container>


</>  
    );
  };
  
  export default GuidePage;