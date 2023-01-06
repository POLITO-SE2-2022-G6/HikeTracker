import { Container, Paper, Text, Table, CSSObject } from '@mantine/core';

const UserActivities = ({ activities }: { activities: any }) => {
    return(
        <>
            <Container sx={{ "display": "flex", "flexWrap": "wrap",  "alignItems": "flex-start" } as CSSObject}>
                <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{ "flexGrow": 1, "flexShrink": 0 } as CSSObject}>
                <h1>My Activities</h1>
                <Table verticalSpacing="sm">
                    <tbody>
                        {activities.map((activity: any) => (
                            <>
                            <tr>
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