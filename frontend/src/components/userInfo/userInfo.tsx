import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { Container, Paper, Text, Table, CSSObject } from '@mantine/core';

const UserInfo = () => {
  const { state } = useContext(UserContext)

  return (
    <>
      <Container sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start"
        } as CSSObject}>
        <Paper withBorder shadow="md" radius="md" p="md" m="md" sx={{
              flexGrow: 1,
              flexShrink: 0,
            } as CSSObject}>
          <h1>My Details</h1>
          <Table verticalSpacing="sm">
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