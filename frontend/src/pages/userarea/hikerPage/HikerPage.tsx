import s from './HikerPage.module.css';
import { Button, Container, Paper, Flex } from '@mantine/core';
import UserInfo from '../../../components/userInfo/userInfo';
import UserPerformance from '../../../components/userInfo/userPerformance';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { UserContext } from '../../../context/userContext';
import React, { useContext, useEffect } from 'react';

const HikerPage: React.FC = () => {

    const { state, setState } = useContext(UserContext)

    const params = { length: '3', expected_time: '80', difficulty: '2', ascent: '1.5' };

    const navigate = useNavigate()
    const goToSearch = () => {
        navigate({
            pathname: '/hikes',
            search: `?${createSearchParams(params)}`
        });
    }

    return (
        <>
            <UserInfo />
            <UserPerformance />
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
                    <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', sm: 'lg' }} justify={{ sm: 'center' }}>
                        <Button size="md" onClick={() => {navigate('/huts')}}>Search a Hut</Button>
                        <Button size="md" onClick={() => {navigate('/performances')}}>Modify Performance Parameters</Button>
                        <Button size="md" onClick={goToSearch}>See filtered hikes</Button>
                    </Flex>
                </Paper>
            </Container>
        </>
    );
};

export default HikerPage;
