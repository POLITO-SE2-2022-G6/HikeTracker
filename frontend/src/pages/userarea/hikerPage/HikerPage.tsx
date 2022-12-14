import { Button, Container, Paper, Flex, CSSObject } from '@mantine/core';
import UserInfo from '../../../components/userInfo/userInfo';
import UserPerformance from '../../../components/userInfo/userPerformance';
import UserActivities from '../../../components/userInfo/userActivities';
import { useNavigate, createSearchParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { Performance, UserHikes as USERHIKES, Hike } from '../../../generated/prisma-client';
import { API } from "../../../utilities/api/api"

type UserHikes = USERHIKES & {
    hike: Hike,
}

const HikerPage: React.FC = () => {

    const [performance, setPerformance] = useState<Performance | undefined>(undefined)
    const [activities, setActivities] = useState<UserHikes[] | undefined>([])

    // function to convert all fields of object performance to string
    const navigate = useNavigate()
    const goToSearch = () => {
        if (!performance) return
        navigate({
            pathname: '/hikes',
            search: `?${createSearchParams({
                length: performance.length?.toString(),
                duration: performance.duration?.toString(),
                difficulty: performance.difficulty?.toString(),
                ascent: performance.altitude?.toString()
            })}`
        })
    }

    useEffect(() => {
        API.hiker.getPerformance().then((res) => {
            setPerformance(res as Performance)
        })
            .then(() => API.hiker.getActivities()
                .then((res) => { setActivities(res as UserHikes[]) }))
    }, [])

    return (
        <>
            <UserInfo />
            {activities && <UserActivities activities={activities} />}
            {performance && <UserPerformance performance={performance} />}
            <Container sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start"
            } as CSSObject}>
                <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{
                    flexGrow: 1,
                    flexShrink: 0,
                } as CSSObject
                }>
                    <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', sm: 'lg' }} justify={{ sm: 'center' }}>
                        <Button size="md" onClick={useCallback(() => { navigate('/huts') }, [navigate])}>Search a Hut</Button>
                        <Button size="md" onClick={useCallback(() => { navigate('/performances') }, [navigate])}>Modify Performance Parameters</Button>
                        <Button size="md" onClick={useCallback(goToSearch, [navigate, performance])}>See filtered hikes</Button>
                    </Flex>
                </Paper>
            </Container>
        </>
    );
};

export default HikerPage;
