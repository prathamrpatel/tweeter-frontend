import type { NextPage } from 'next';
import { Form, Formik } from 'formik';
import {
  Flex,
  Box,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import InputField from '../components/InputField';
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useLoginMutation,
} from '../generated/graphql';
import { useRouter } from 'next/router';
import { errorMap } from '../util/errorMap';
import NextLink from 'next/link';

const Login: NextPage = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <Formik
              initialValues={{ usernameOrEmail: '', password: '' }}
              onSubmit={async (
                { usernameOrEmail, password },
                { setErrors }
              ) => {
                const response = await login({
                  variables: {
                    usernameOrEmail,
                    password,
                  },
                  update: (cache, { data }) => {
                    cache.writeQuery<CurrentUserQuery>({
                      query: CurrentUserDocument,
                      data: {
                        __typename: 'Query',
                        currentUser: data?.login.user,
                      },
                    });
                  },
                });

                if (response.data?.login.errors) {
                  setErrors(errorMap(response.data.login.errors));
                } else if (response.data?.login.user) {
                  router.push('/');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="usernameOrEmail"
                    label="Username or email"
                  />
                  <Box mt="10px">
                    <InputField name="password" label="Password" />
                  </Box>

                  <Stack spacing={10} mt="10px">
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack>
                    <Stack spacing={5} mt="10px">
                      <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        Login
                      </Button>
                      <Text align={'center'}>
                        Don't have an account?{' '}
                        <NextLink href="/register">
                          <Link color={'blue.400'}>Register</Link>
                        </NextLink>
                      </Text>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
