import { User } from '@clerk/nextjs/dist/api';

export const filterForClient = (user: User) => {
	return {
		id: user.id,
		username: user.username,
		profilePicture: user.profileImageUrl,
	};
};
