import { Container, Paper, Text, Table, CSSObject } from '@mantine/core';
import { UserHikes as USERHIKES, Hike } from '../../generated/prisma-client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type UserHikes = USERHIKES & {
    hike: Hike,
}

const UserActivities = ({ activities }: { activities: any }) => {

    const navigate = useNavigate()

    const [completed, setCompleted] = useState<boolean>(false)

    return (
        <>
            <Container sx={{ "display": "flex", "flexWrap": "wrap", "alignItems": "flex-start" } as CSSObject}>
                <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{ "flexGrow": 1, "flexShrink": 0 } as CSSObject}>
                    <h1>My Activities</h1>
                    <Checkbox label="Only Completed" onClick={() => {
                        if (completed) {
                            setCompleted(false);
                        }
                        else {
                            setCompleted(true);
                        }
                    }} />
                    <Table verticalSpacing="sm" highlightOnHover withBorder withColumnBorders>
                        <thead>
                            <tr>
                                <th>Hike Name</th>
                                <th>Status Hike</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities?.filter((v) => {
                                if (completed) {
                                    return v.status === "completed"
                                }
                                else {
                                    return v
                                }
                            }).map((activity: UserHikes) => (
                                <>
                                    <tr onClick={() => { }}>
                                        <td>
                                            <Text size="lg" >
                                                {activity.hike.title}
                                            </Text>
                                        </td>
                                        <td>
                                            <Text size="lg" >
                                                {activity.status}
                                            </Text>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </Table>
                </Paper>
            </Container>
        </>
    )
}

export default UserActivities;