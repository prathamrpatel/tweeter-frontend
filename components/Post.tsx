import {
  Post,
  useCurrentUserQuery,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from '../generated/graphql';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiChat, BiShare } from 'react-icons/bi';
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import { EditIcon, DeleteIcon, WarningIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useToast } from '@chakra-ui/react';

interface PostProps {
  post: Post;
}

const Post = ({ post }: PostProps) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const { data } = useCurrentUserQuery();
  const [userLikedPost, setUserLikedPost] = useState(false);
  const [deletePost] = useDeletePostMutation();
  const toast = useToast();

  useEffect(() => {
    post.likes.forEach((like) => {
      if (like.userId === post.authorId) {
        setUserLikedPost(true);
      }
    });
  }, []);

  return (
    <Card maxW="600px" mt="10px">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={post.author.name}
              src="https://i.stack.imgur.com/frlIf.png"
            />

            <Box>
              <Heading size="sm">{post.author.name}</Heading>
              <Text>@{post.author.username}</Text>
            </Box>
          </Flex>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<BsThreeDotsVertical />}
              variant="ghost"
            />
            {post.authorId === data?.currentUser?.id ? (
              <MenuList>
                <MenuItem
                  icon={<DeleteIcon />}
                  color="red"
                  onClick={async () => {
                    await deletePost({
                      variables: {
                        postId: post.id,
                      },
                      update: (cache) => {
                        cache.evict({ id: `Post:${post.id}` });
                      },
                    });
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            ) : (
              <MenuList>
                <MenuItem
                  icon={<WarningIcon />}
                  onClick={() =>
                    toast({
                      title: 'Tweet reported',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                      position: 'bottom-right',
                    })
                  }
                >
                  Report
                </MenuItem>
              </MenuList>
            )}
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{post.body}</Text>
      </CardBody>

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        {userLikedPost ? (
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<FcLike />}
            onClick={async () => {
              await unlikePost({
                variables: {
                  postId: post.id,
                },
              });
              setUserLikedPost(false);
            }}
          >
            Unlike
          </Button>
        ) : (
          <Button
            flex="1"
            variant="ghost"
            leftIcon={<FcLikePlaceholder />}
            onClick={async () => {
              await likePost({
                variables: {
                  postId: post.id,
                },
              });
              setUserLikedPost(true);
            }}
          >
            Like
          </Button>
        )}

        <NextLink href={`/comments/${post.id}`}>
          <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
            Comment
          </Button>
        </NextLink>

        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
