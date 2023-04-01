import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { api, } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt={`${user.username}`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        priority
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="w-full grow bg-transparent outline-none"
      />
    </div>
  );
};


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div
      key={post.id}
      className="flex w-full gap-4 border-b border-slate-800 p-4"
    >
      <Image
        src={author.profilePicture}
        alt={author.username}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex pb-1 text-slate-300">
          <span className="font-semibold">@{author.username}</span>
          &nbsp; · &nbsp;
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Chirp - Emoiji Messenger</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-x-slate-800 md:max-w-2xl">
          <div className="p- flex border-b border-slate-800 p-4">
            {user.isSignedIn ? (
              <div className="flex justify-center">
                <CreatePostWizard />
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
