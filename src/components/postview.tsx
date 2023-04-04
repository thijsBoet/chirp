import Image from 'next/image';
import Link from 'next/link';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import type { RouterOutputs } from '~/utils/api';

type PostWithUser = RouterOutputs['posts']['getAll'][number];

export const PostView = (props: PostWithUser) => {
	const { post, author } = props;

	return (
		<div
			key={post.id}
			className="flex w-full gap-4 border-b border-slate-800 p-4 "
		>
			<Image
				src={author.profileImageUrl ?? '/default-profile-pic.png'}
				alt={author.username}
				className="h-14 w-14 rounded-full"
				width={56}
				height={56}
			/>
			<div className="flex flex-col">
				<div className="flex text-slate-300">
					<Link href={`/@${author.username}`}>
						<span className="font-semibold">
							@{author.username}
						</span>
					</Link>
					&nbsp; · &nbsp;
					<Link href={`/post/${post.id}`}>
						<span className="font-thin">
							{dayjs(post.createdAt).fromNow()}
						</span>
					</Link>
				</div>
				<span className="text-2xl">{post.content}</span>
			</div>
		</div>
	);
};
