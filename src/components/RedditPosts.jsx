import { useEffect, useState } from 'react';
import { FaArrowUp, FaComment } from 'react-icons/fa';

const RedditPosts = ({ subreddit = 'gaming' }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        const res = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        const data = await res.json();
        setPosts(data.data.children.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch Reddit posts:', err);
      }
    };
    fetchRedditPosts();
  }, [subreddit]);

  return (
    <section className="text-white py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">Trending on Reddit</h2>
      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
        {posts.map(({ data: post }) => (
          <a
            key={post.id}
            href={`https://reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[320px] bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:scale-[1.03] transition-transform duration-300"
          >
            {post.thumbnail && post.thumbnail.startsWith('http') ? (
              <img
                src={post.thumbnail}
                alt="thumbnail"
                className="w-full h-40 object-cover"
              />
            ) : (
              <img  src ="https://bgr.com/wp-content/uploads/2024/08/Reddit-Logo.jpg?quality=82&strip=all&resize=1400,1400" className="w-full h-40 bg-zinc-800 flex items-center justify-center text-gray-500 text-sm"/>
                
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-white font-semibold text-base line-clamp-2">{post.title}</h3>
              <div className="text-sm text-gray-400 flex items-center justify-between">
                <span>{post.subreddit_name_prefixed}</span>
                <span>u/{post.author}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                <span className="flex items-center gap-1">
                  <FaArrowUp className="text-yellow-400" /> {post.ups}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment className="text-blue-400" /> {post.num_comments}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RedditPosts;
