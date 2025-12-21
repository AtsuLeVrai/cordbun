export const CDN_BASE_URL = "https://cdn.discordapp.com";
export const MEDIA_BASE_URL = "https://media.discordapp.net";

export enum ImageFormat {
	JPEG = "jpg",
	PNG = "png",
	WebP = "webp",
	GIF = "gif",
	AVIF = "avif",
	Lottie = "json",
}

export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

type CdnUrl<P extends string = string> = `${typeof CDN_BASE_URL}/${P}`;
type MediaUrl<P extends string = string> = `${typeof MEDIA_BASE_URL}/${P}`;

const buildUrl = <P extends string>(
	path: P,
	format: ImageFormat,
	size?: ImageSize,
): CdnUrl<`${P}.${ImageFormat}`> => {
	const base =
		`${CDN_BASE_URL}/${path}.${format}` as CdnUrl<`${P}.${ImageFormat}`>;
	return (
		size ? `${base}?size=${size}` : base
	) as CdnUrl<`${P}.${ImageFormat}`>;
};

export const emojiUrl = <I extends string>(
	emojiId: I,
	format: ImageFormat = ImageFormat.WebP,
	size?: ImageSize,
) => buildUrl(`emojis/${emojiId}`, format, size);

export const guildIcon = <G extends string, H extends string>(
	guildId: G,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`icons/${guildId}/${hash}`, format, size);

export const guildSplash = <G extends string, H extends string>(
	guildId: G,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`splashes/${guildId}/${hash}`, format, size);

export const guildDiscoverySplash = <G extends string, H extends string>(
	guildId: G,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`discovery-splashes/${guildId}/${hash}`, format, size);

export const guildBanner = <G extends string, H extends string>(
	guildId: G,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`banners/${guildId}/${hash}`, format, size);

export const userBanner = <U extends string, H extends string>(
	userId: U,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`banners/${userId}/${hash}`, format, size);

export const defaultUserAvatar = <I extends number>(
	index: I,
): CdnUrl<`embed/avatars/${I}.${ImageFormat.PNG}`> =>
	`${CDN_BASE_URL}/embed/avatars/${index}.${ImageFormat.PNG}`;

export const userAvatar = <U extends string, H extends string>(
	userId: U,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`avatars/${userId}/${hash}`, format, size);

export const guildMemberAvatar = <
	G extends string,
	U extends string,
	H extends string,
>(
	guildId: G,
	userId: U,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) =>
	buildUrl(`guilds/${guildId}/users/${userId}/avatars/${hash}`, format, size);

export const avatarDecoration = <A extends string>(
	asset: A,
): CdnUrl<`avatar-decoration-presets/${A}.${ImageFormat.PNG}`> =>
	`${CDN_BASE_URL}/avatar-decoration-presets/${asset}.${ImageFormat.PNG}`;

export const applicationIcon = <A extends string, H extends string>(
	applicationId: A,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size);

export const applicationCover = <A extends string, H extends string>(
	applicationId: A,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`app-icons/${applicationId}/${hash}`, format, size);

export const applicationAsset = <A extends string, I extends string>(
	applicationId: A,
	assetId: I,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`app-assets/${applicationId}/${assetId}`, format, size);

export const achievementIcon = <
	A extends string,
	C extends string,
	H extends string,
>(
	applicationId: A,
	achievementId: C,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) =>
	buildUrl(
		`app-assets/${applicationId}/achievements/${achievementId}/icons/${hash}`,
		format,
		size,
	);

export const storePageAsset = <A extends string, I extends string>(
	applicationId: A,
	assetId: I,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`app-assets/${applicationId}/store/${assetId}`, format, size);

export const stickerPackBanner = <I extends string>(
	assetId: I,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`app-assets/710982414301790216/store/${assetId}`, format, size);

export const teamIcon = <T extends string, H extends string>(
	teamId: T,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`team-icons/${teamId}/${hash}`, format, size);

export const sticker = <I extends string>(
	stickerId: I,
	format: ImageFormat = ImageFormat.PNG,
): CdnUrl<`stickers/${I}.${ImageFormat}`> =>
	`${CDN_BASE_URL}/stickers/${stickerId}.${format}`;

export const stickerGif = <I extends string>(
	stickerId: I,
): MediaUrl<`stickers/${I}.${ImageFormat.GIF}`> =>
	`${MEDIA_BASE_URL}/stickers/${stickerId}.${ImageFormat.GIF}`;

export const roleIcon = <R extends string, H extends string>(
	roleId: R,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`role-icons/${roleId}/${hash}`, format, size);

export const guildScheduledEventCover = <E extends string, H extends string>(
	eventId: E,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`guild-events/${eventId}/${hash}`, format, size);

export const guildMemberBanner = <
	G extends string,
	U extends string,
	H extends string,
>(
	guildId: G,
	userId: U,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) =>
	buildUrl(`guilds/${guildId}/users/${userId}/banners/${hash}`, format, size);

export const guildTagBadge = <G extends string, H extends string>(
	guildId: G,
	hash: H,
	format: ImageFormat = ImageFormat.PNG,
	size?: ImageSize,
) => buildUrl(`guild-tag-badges/${guildId}/${hash}`, format, size);

export const isAnimatedHash = (hash: string): hash is `a_${string}` =>
	hash.startsWith("a_");

export const defaultAvatarIndex = (userId: string): number =>
	Number((BigInt(userId) >> 22n) % 6n);

export const legacyDefaultAvatarIndex = (discriminator: number): number =>
	discriminator % 5;
