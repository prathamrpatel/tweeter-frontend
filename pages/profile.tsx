import type { NextPage } from 'next';
import Post from '../components/Post';
import SidebarWithHeader from '../components/SidebarWithHeader';
import { useGetPostsByUserQuery } from '../generated/graphql';
import { useIsAuth } from '../util/useIsAuth';
import InfiniteScroll from 'react-infinite-scroller';
import { Box, Flex } from '@chakra-ui/react';

const Profile: NextPage = () => {
  useIsAuth();
  const { data, fetchMore } = useGetPostsByUserQuery({
    variables: {
      input: {
        take: 20,
        cursor: null,
      },
    },
  });

  if (!data?.getPostsByUser) {
    return <div>Posts could not be fetched</div>;
  }

  return (
    <SidebarWithHeader>
      <InfiniteScroll
        pageStart={0}
        loadMore={() =>
          // The load time is too fast. Wait 0.250 seconds to load once user scrolls far enough
          setTimeout(() => {
            fetchMore({
              variables: {
                input: {
                  take: 20,
                  cursor:
                    data.getPostsByUser.posts[
                      data.getPostsByUser.posts.length - 1
                    ].createdAt,
                },
              },
            });
          }, 250)
        }
        hasMore={data.getPostsByUser.hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {data.getPostsByUser.posts.length === 0 ? (
          <Flex justify="center">You have not posted anything yet</Flex>
        ) : (
          <Flex direction="column" align="center">
            {data.getPostsByUser.posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </Flex>
        )}
      </InfiniteScroll>
    </SidebarWithHeader>
  );
};

export default Profile;
