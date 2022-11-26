import s from './HikerPage.module.css';
import { Container ,Paper} from '@mantine/core';
const HikerPage: React.FC = () => {

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
          <h1>Search a Hut</h1>  
          {/* insert hut search form  */}
          </Paper>
         </Container> 
        </>
    );
};

export default HikerPage;