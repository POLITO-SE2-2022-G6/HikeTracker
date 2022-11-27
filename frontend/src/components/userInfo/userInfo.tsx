import s from './userInfo.module.css';
import React,{useContext,useEffect} from 'react';
import { UserContext } from '../../context/userContext';
import { Container, Paper,Text ,Table} from '@mantine/core';

const UserInfo = () => {
    const { state, setState } = useContext(UserContext)

    return(
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
        <h1>My Details</h1>
        <Table  verticalSpacing="sm">
       <tbody>
        <tr>
            <td>   
            <Text size="lg" >
            Username: {state.data?.username}  
            </Text> 
            </td>           
        </tr>
        <tr>
            <td>
            <Text size="lg" >
            Type: {state.data?.type}
            </Text>      
            </td>
        </tr>
        <tr>
            <td>
            <Text size="lg" >
            Email: {state.data?.email}
            </Text>             
            </td>
        </tr>
        <tr>
            <td>
            <Text size="lg" >
            Phone Number: {state.data?.phoneNumber}
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

export default UserInfo;