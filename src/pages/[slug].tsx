
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { api } from '~/utils/api';
import type { RouterOutputs } from '~/utils/api';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage, LoadingSpinner } from '~/components/loading';
import { useState } from 'react';
import toast from 'react-hot-toast';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<{username: string}> = ({ username }) => {
	const { data, isLoading } = api.profile.getUserByUsername.useQuery({
		username,
	});

	if (isLoading) return <LoadingPage />;
	if (!data) return <div>404</div>;

	console.log(username);

	return (
		<>
			<Head>
				<title>{`Chirp - ${username} Profile`}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<PageLayout>
				<div className="relative h-36 bg-slate-600">
					<Image
						src={data.profilePicture ?? '/default-profile-pic.png'}
						alt={`${data.username ?? ''}'s profile pic`}
						width={128}
						height={128}
						className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
					/>
				</div>
				<div className="h-[64px]"></div>
				<div className="p-4 text-2xl font-bold">{`@${
					data.username ?? ''
				}`}</div>
				<div className="w-full border-b border-slate-400" />
			</PageLayout>
		</>
	);
};

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import SuperJSON from 'superjson';
import { PageLayout } from '~/components/layout';

export const getStaticProps: GetStaticProps = async (context) => {
	const ssg = createProxySSGHelpers({
		router: appRouter,
		ctx: { prisma, userId: null },
		transformer: SuperJSON, // optional - adds superjson serialization
	});

	const slug = context.params?.slug;

	if (typeof slug !== 'string') throw new Error('Slug is not a string');

	const username = slug.replace('@', '');

	await ssg.profile.getUserByUsername.prefetch({ username });

	return {
		props: {
			trpcState: ssg.dehydrate(),
			username,
		},
	};
};

export const getStaticPaths: GetStaticPaths = () => {
	return { paths: [], fallback: 'blocking' };
};

export default ProfilePage;
