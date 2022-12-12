import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { Container, Paper, Text, Table } from '@mantine/core';
import { Performance } from '../../generated/prisma-client'
import { formatLength, formatTime, formatDifficulty } from '../../utilities/formatters';
const UserPerformance = ({ performance }: { performance: Performance }) => {
    const { state, setState } = useContext(UserContext)

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