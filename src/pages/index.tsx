import { SignInButton, useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';

import Image from 'next/image';

import { api } from '~/utils/api';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage, LoadingSpinner } from '~/components/loading';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageLayout } from '~/components/layout';
import { PostView } from '~/components/postview';

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
	const { user } = useUser();

	const [input, setInput] = useState<string>('');

	const ctx = api.useContext();

	const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
		onSuccess: async () => {
			setInput('');
			await ctx.posts.getAll.invalidate();
		},
		onError: (e) => {
			const errorMessage = e.data?.zodError?.fieldErrors.content;
			if (errorMessage && errorMessage[0]) {
				toast.error(errorMessage[0]);
			} else {
				toast.error('Failed to post! Please try again later.');
			}
		},
	});

	if (!user) return null;

	return (
		<div className="flex w-full gap-4">
			<Image
				src={user.profileImageUrl}
				alt={user.username || 'Profile picture'}
				className="h-14 w-14 rounded-full"
				width={56}
				height={56}
				priority
			/>
			<input
				type="text"
				placeholder="Type some emojis!"
				className="w-full grow bg-transparent outline-none"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						if (input !== '') mutate({ content: input });
					}
				}}
				disabled={isPosting}
			/>
			{input !== '' && !isPosting && (
				<button
					className="rounded border-2 border-slate-600 px-6 py-2 font-bold hover:bg-slate-800"
					onClick={() => mutate({ content: input })}
				>
					Post
				</button>
			)}
			{isPosting && (
				<div className="flex items-center justify-center">
					<LoadingSpinner size={20} />
				</div>
			)}
		</div>
	);
};



const Feed = () => {
	const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

	if (postLoading) return <LoadingPage />;
	if (!data) return <div>Something went wrong</div>;

	return (
		<div className="flex flex-col">
			{data.map((fullPost) => (
				<PostView {...fullPost} key={fullPost.post.id} />
			))}
		</div>
	);
};

const Home: NextPage = () => {
	const { isLoaded: userLoaded, isSignedIn } = useUser();

	// Start loading posts as soon as user is loaded
	api.posts.getAll.useQuery();

	// Return empoty div if user is not loaded
	if (!userLoaded) return <div />;

	return (
		<>
			<PageLayout>
				<div className="flex border-b border-slate-800 p-4">
					{!isSignedIn && (
						<div className="flex justify-center">
							<SignInButton />
						</div>
					)}
					{isSignedIn && <CreatePostWizard />}
				</div>

				<Feed />
			</PageLayout>
		</>
	);
};

export default Home;
