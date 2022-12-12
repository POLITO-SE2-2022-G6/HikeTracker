import React from 'react';
import { BackgroundImage, Center, Text,Flex,Button} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  
  const navigate = useNavigate();
  
    return(
               
        <BackgroundImage src={"/imgs/home.jpg"} h="100vh" sx ={{opacity:'0.90'}}>
          <Flex justify="flex-end" align="flex-end">
            <Button variant="outline"  mt="xs" mr="xl"
                    sx={ {  border: "none" , color:"white", fontSize: 18 } }
                    onClick={() => { navigate("/login"); }}>Login</Button>
          </Flex>
          <Center style={{ height: 450 }}>
            <Text color="#fff"  
                  sx={{ fontFamily: 'Greycliff CF, sans-serif', 
                  textShadow: "5px 5px 10px black"   }}
                  size={75}  fw={750}>
                 Hike Tracker
             </Text> 
          </Center>
          <Flex 
               direction={{ base: 'column', sm: 'row' }}
               gap={{ base: 'sm', sm: 'lg' }}
               justify={{ sm: 'center' }} > 
             <Button variant="outline"  sx={{ border: "none" , color:"white", fontSize: 18}}
                    onClick={() => { navigate("/hikelist"); }}>Browse Hikes</Button>
             <Button variant="outline"  sx={{ border: "none" , color:"white", fontSize: 18}}
                     onClick={() => { navigate("/register"); }}>Sign up</Button>
          </Flex>
             
        </BackgroundImage>       
    );
}

export default Home;