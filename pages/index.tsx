import { Flex } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroller';
import Post from '../components/Post';
import PostInput from '../components/PostInput';
import SidebarWithHeader from '../components/SidebarWithHeader';
import { usePostsQuery } from '../generated/graphql';
import { useIsAuth } from '../util/useIsAuth';

export default function Home() {
  useIsAuth();
  const { data, fetchMore } = usePostsQuery({
    variables: {
      input: {
        take: 20,
        cursor: null,
      },
    },
  });

  if (!data?.posts) {
    return <div>Posts could not be fetched</div>;
  }

  return (
    <SidebarWithHeader>
      <PostInput />
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
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              },
            });
          }, 250)
        }
        hasMore={data.posts.hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        <Flex direction="column" align="center">
          {data.posts.posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Flex>
      </InfiniteScroll>
    </SidebarWithHeader>
  );
}
