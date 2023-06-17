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
} from '@chakra-ui/react';
import InputField from '../components/InputField';
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useRegisterMutation,
} from '../generated/graphql';
import { useRouter } from 'next/router';
import { errorMap } from '../util/errorMap';
import NextLink from 'next/link';

const Register: NextPage = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign up for an account</Heading>
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
              initialValues={{
                name: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              onSubmit={async (values, { setErrors }) => {
                const response = await register({
                  variables: {
                    registerInput: values,
                  },
                  update: (cache, { data }) => {
                    cache.writeQuery<CurrentUserQuery>({
                      query: CurrentUserDocument,
                      data: {
                        __typename: 'Query',
                        currentUser: data?.register.user,
                      },
                    });
                  },
                });

                if (response.data?.register.errors) {
                  setErrors(errorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                  router.push('/');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField name="name" label="Name" />

                  <Box mt="10px">
                    <InputField name="username" label="Username" />
                  </Box>
                  <Box mt="10px">
                    <InputField name="email" label="Email" />
                  </Box>
                  <Box mt="10px">
                    <InputField name="password" label="Password" />
                  </Box>
                  <Box mt="10px">
                    <InputField
                      name="confirmPassword"
                      label="Confirm password"
                    />
                  </Box>

                  <Stack spacing={5} mt="10px">
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      isLoading={isSubmitting}
                      type="submit"
                      mt="10px"
                    >
                      Create account
                    </Button>

                    <Text align={'center'}>
                      Already a user?{' '}
                      <NextLink href="/login">
                        <Link color={'blue.400'}>Login</Link>
                      </NextLink>
                    </Text>
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

export default Register;
