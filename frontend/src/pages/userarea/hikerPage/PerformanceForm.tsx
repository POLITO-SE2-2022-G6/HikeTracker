import s from './PerformanceForm.module.css';
import { useForm } from '@mantine/form'
import { Button, Container, Paper, Title, Text, Slider, Space} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API } from '../../../utilities/api/api';
import { Performance } from '../../../generated/prisma-client';

const PerformanceForm: React.FC = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');

    type Fields = {
        length?: number;
        duration?: number;
        difficulty?: number;
        altitude?: number;
    }

    const form = useForm<Fields>({
        initialValues: {
            length: undefined,
            duration: undefined,
            altitude: undefined,
            difficulty: undefined,
        },

        // validate: {
        //     length: (value: number) => (!value ? 'Length must not be empty' : null),
        //     duration: (value: number) => (!value ? 'Duration time must not be empty' : null),
        //     altitude: (value: number) => (!value ? 'Altitude must not be empty' : null),
        //     difficulty: (value: number) => (!value ? 'Difficulty must not be empty' : null),
        // },
    });

    useEffect(() => {
        const fetchParameters = async () => {
            const parameters = await API.hiker.getPerformance() as Performance
            if (!parameters) return
            form.setValues({
                length: parameters.length,
                duration: parameters.duration,
                altitude: parameters.altitude,
                difficulty: parameters.difficulty,
            })
        }
        fetchParameters()
    }, [])

    const handleSubmit = async (values: Fields) => {

        console.log('submitting', values)
        await editParameters(values)
    }

    const editParameters = async (values: Fields) => {
        try {
            const response = await API.hiker.editPerformance(values)
            navigate('/hikerarea/')
        } catch (error) {
            setError("Error while editing hike")
        }
    }

    return (
        <Container>
            <Title align="center"> Edit parameters
            </Title>
            <Container sx={(t) => {
                return {
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start"
                }
            }}>
                <Paper withBorder shadow={'md'} p={'md'} m={'md'} radius={'md'} sx={
                    (t) => {
                        return {
                            flexGrow: 1,
                            flexShrink: 0,
                        }
                    }
                }>
                    <form onSubmit={form.onSubmit(handleSubmit)} className={s.form}>
                        <Text fw={500} fz='sm'>
                            Difficulty:&nbsp;
                            {form.values.difficulty && formatDifficulty(form.values.difficulty)}
                        </Text>
                        <Slider
                            py={'md'}
                            min={1}
                            max={5}
                            step={1}
                            name="difficulty"
                            label={formatDifficulty}
                            marks={[
                                { value: 1 },
                                { value: 2 },
                                { value: 3 },
                                { value: 4 },
                                { value: 5 }
                            ]}
                            {...form.getInputProps('difficulty')}

                        />
                        <Text fw={500} fz='sm'>
                            Length:&nbsp;
                            {form.values.length && formatLength(calcScale(form.values.length))}
                        </Text>
                        <Slider
                            scale={calcScale}
                            py={'md'}
                            min={1}
                            max={1000}
                            label={formatLength}
                            name="length"
                            defaultValue={10}
                            {...form.getInputProps('length')}
                        />
                        <Text fw={500} fz='sm'>
                            Duration:&nbsp;
                            {form.values.duration && formatTime(form.values.duration)}
                        </Text>
                        <Slider
                            py={'md'}
                            min={1}
                            max={24 * 60}
                            step={30}
                            label={formatTime}
                            {...form.getInputProps('duration')}
                        />
                        <Text fw={500} fz='sm'>
                            Altitude:&nbsp;
                            {form.values.altitude && formatAltitude(form.values.altitude)}
                        </Text>
                        <Slider
                            py={'md'}
                            min={0}
                            max={10000}
                            label={formatAltitude}
                            name="length"
                            defaultValue={10}
                            {...form.getInputProps('altitude')}
                        />
                        <Space h={'md'} />
                        <Button fullWidth type='submit'>Save Parameters</Button>
                    </form>
                </Paper>
            </Container>
        </Container >
    )
}

function formatDifficulty(value: number) {
    return ['Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert'][value - 1];
}

function formatTime(value: number) {
    if (value > 60) {
        const hours = (value / 60).toFixed(0);
        const min = value % 60;
        return hours + ' h' + (min ? ' ' + min + ' min' : '');
    }
    else
        return value.toFixed(0) + ' min';
}

function calcScale(value: number) {
    return 0.000001 * (value ** 3);
}

function formatLength(value: number) {
    if (value > 1) return value.toFixed(0) + ' km'
    else return (value * 1000).toFixed(0) + ' m'
}

function formatAltitude(value: number) {
    return value.toFixed(0) + ' m'
}

export default PerformanceForm;