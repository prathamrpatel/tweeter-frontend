import { useApolloClient } from '@apollo/client';
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { PostsDocument, useCreatePostMutation } from '../generated/graphql';

interface PostInputProps {}

const PostInput = ({}: PostInputProps) => {
  const client = useApolloClient();
  const [postBody, setPostBody] = useState('');
  const [createPost] = useCreatePostMutation();

  return (
    <Flex justify="center">
      <InputGroup size="md" w="600px" mb="20px">
        <Input
          pr="4.5rem"
          placeholder="Enter tweet"
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            type="submit"
            onClick={async () => {
              await createPost({
                variables: {
                  body: postBody,
                },
              });

              client.refetchQueries({
                include: [PostsDocument],
              });

              setPostBody('');
            }}
          >
            Post
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default PostInput;
