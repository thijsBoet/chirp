import type { PropsWithChildren } from 'react';

export const PageLayout = (props: PropsWithChildren) => {
	return (
		<main className="flex h-screen justify-center">
			<div className="border-x- h-full w-full overflow-y-scroll overscroll-y-none border-x border-slate-800 md:max-w-2xl">
				{props.children}
			</div>
		</main>
	);
};
