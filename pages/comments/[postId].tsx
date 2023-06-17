import type { NextPage } from 'next';
import {
  GetCommentsDocument,
  useCreateCommentMutation,
  useGetCommentsQuery,
  usePostQuery,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import Comment from '../../components/Comment';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import SidebarWithHeader from '../../components/SidebarWithHeader';
import Post from '../../components/Post';
import { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useIsAuth } from '../../util/useIsAuth';

const Comments: NextPage = () => {
  useIsAuth();
  const router = useRouter();
  const client = useApolloClient();
  const { data: commentsData } = useGetCommentsQuery({
    variables: {
      postId: +router.query.postId!,
    },
  });
  const { data: postData } = usePostQuery({
    variables: {
      postId: +router.query.postId!,
    },
  });
  const [createComment] = useCreateCommentMutation();
  const [comment, setComment] = useState('');

  if (!postData?.post) {
    return <div>Post could not be loaded</div>;
  }

  if (!commentsData?.getComments) {
    return <div>Comments could not be loaded</div>;
  }

  return (
    <SidebarWithHeader>
      <Flex direction="column" align="center">
        <InputGroup size="md" w="600px" mb="20px">
          <Input
            pr="4.5rem"
            placeholder="Enter comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              type="submit"
              onClick={async () => {
                await createComment({
                  variables: {
                    body: comment,
                    postId: postData.post!.id,
                  },
                });

                client.refetchQueries({
                  include: [GetCommentsDocument],
                });
              }}
            >
              Post
            </Button>
          </InputRightElement>
        </InputGroup>

        <Post post={postData.post} />
        {commentsData?.getComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Flex>
    </SidebarWithHeader>
  );
};

export default Comments;
