import { Container, Paper, Text, Table, CSSObject } from '@mantine/core';
import { Performance } from '../../generated/prisma-client'
import { formatLength, formatTime, formatDifficulty } from '../../utilities/formatters';
const UserPerformance = ({ performance }: { performance: Performance }) => {

    return (
        <>
            <Container sx={{ "display": "flex", "flexWrap": "wrap",  "alignItems": "flex-start" } as CSSObject}>
                <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{ "flexGrow": 1, "flexShrink": 0 } as CSSObject}>
                    <h1>My Performance parameters</h1>
                    <Table verticalSpacing="sm">
                        <tbody>
                            <tr>
                                <td>
                                    <Text size="lg" >
                                        Lenght: {formatLength(performance.length)}
                                    </Text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text size="lg" >
                                        Duration: {formatTime(performance.duration)}
                                    </Text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text size="lg" >
                                        Difficulty: {formatDifficulty(performance.difficulty)}
                                    </Text>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text size="lg" >
                                        Altitude: {formatLength(performance.altitude)}
                                    </Text>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Paper>
            </Container>
        </>
    );

}

export default UserPerformance;