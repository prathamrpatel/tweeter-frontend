import {
  Comment,
  useCurrentUserQuery,
  useDeleteCommentMutation,
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
import { BiShare } from 'react-icons/bi';
import { EditIcon, DeleteIcon, WarningIcon } from '@chakra-ui/icons';

interface CommentProps {
  comment: Comment;
}

const Comment = ({ comment }: CommentProps) => {
  const { data } = useCurrentUserQuery();
  const [deleteComment] = useDeleteCommentMutation();

  return (
    <Card w="400px" maxW="600px" mt="10px">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={comment.author.username}
              src="https://i.stack.imgur.com/frlIf.png"
            />

            <Box>
              <Heading size="sm">{comment.author.name}</Heading>
              <Text>@{comment.author.username}</Text>
            </Box>
          </Flex>

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<BsThreeDotsVertical />}
              variant="ghost"
            />
            {comment.authorId === data?.currentUser?.id ? (
              <MenuList>
                <MenuItem
                  icon={<DeleteIcon />}
                  color="red"
                  onClick={async () => {
                    await deleteComment({
                      variables: {
                        commentId: comment.id,
                      },
                      update: (cache) => {
                        cache.evict({ id: `Comment:${comment.id}` });
                      },
                    });
                  }}
                >
                  Delete
                </MenuItem>
                <MenuItem icon={<EditIcon />}>Edit</MenuItem>
              </MenuList>
            ) : (
              <MenuList>
                <MenuItem icon={<WarningIcon />}>Report</MenuItem>
              </MenuList>
            )}
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{comment.body}</Text>
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
        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Comment;
