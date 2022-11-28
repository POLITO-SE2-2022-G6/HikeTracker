import s from './HikerPage.module.css';
import { Button, Center, Container ,Paper} from '@mantine/core';
import UserInfo from '../../../components/userInfo/userInfo';
import { useNavigate } from 'react-router-dom';
const HikerPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <>
         <UserInfo/> 
         <Center>
            <Button
                onClick={() => {
                    navigate('/huts')
                }}
            >
                Search a Hut
            </Button>
         </Center>
        </>
    );
};

export default HikerPage;
