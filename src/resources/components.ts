import type { ChannelType } from "./channels.js";
import type { Emoji } from "./emojis.js";

export enum ComponentType {
	ActionRow = 1,
	Button = 2,
	StringSelect = 3,
	TextInput = 4,
	UserSelect = 5,
	RoleSelect = 6,
	MentionableSelect = 7,
	ChannelSelect = 8,
	Section = 9,
	TextDisplay = 10,
	Thumbnail = 11,
	MediaGallery = 12,
	File = 13,
	Separator = 14,
	Container = 17,
	Label = 18,
	FileUpload = 19,
}

export enum ButtonStyle {
	Primary = 1,
	Secondary = 2,
	Success = 3,
	Danger = 4,
	Link = 5,
	Premium = 6,
}

export enum TextInputStyle {
	Short = 1,
	Paragraph = 2,
}

export enum SeparatorSpacing {
	Small = 1,
	Large = 2,
}

export interface UnfurledMediaItem {
	url: string;
	proxy_url?: string;
	height?: number | null;
	width?: number | null;
	content_type?: string;
	attachment_id?: string;
}

export interface SelectOption {
	label: string;
	value: string;
	description?: string;
	emoji?: Partial<Emoji>;
	default?: boolean;
}

export interface SelectDefaultValue {
	id: string;
	type: "user" | "role" | "channel";
}

export interface ActionRowComponent {
	type: ComponentType.ActionRow;
	id?: number;
	components: (
		| ButtonComponent
		| StringSelectComponent
		| UserSelectComponent
		| RoleSelectComponent
		| MentionableSelectComponent
		| ChannelSelectComponent
	)[];
}

export interface ButtonComponent {
	type: ComponentType.Button;
	id?: number;
	style: ButtonStyle;
	label?: string;
	emoji?: Partial<Emoji>;
	custom_id?: string;
	sku_id?: string;
	url?: string;
	disabled?: boolean;
}

export interface StringSelectComponent {
	type: ComponentType.StringSelect;
	id?: number;
	custom_id: string;
	options: SelectOption[];
	placeholder?: string;
	min_values?: number;
	max_values?: number;
	required?: boolean;
	disabled?: boolean;
}

export interface TextInputComponent {
	type: ComponentType.TextInput;
	id?: number;
	custom_id: string;
	style: TextInputStyle;
	label?: string;
	min_length?: number;
	max_length?: number;
	required?: boolean;
	value?: string;
	placeholder?: string;
}

export interface UserSelectComponent {
	type: ComponentType.UserSelect;
	id?: number;
	custom_id: string;
	placeholder?: string;
	default_values?: SelectDefaultValue[];
	min_values?: number;
	max_values?: number;
	required?: boolean;
	disabled?: boolean;
}

export interface RoleSelectComponent {
	type: ComponentType.RoleSelect;
	id?: number;
	custom_id: string;
	placeholder?: string;
	default_values?: SelectDefaultValue[];
	min_values?: number;
	max_values?: number;
	required?: boolean;
	disabled?: boolean;
}

export interface MentionableSelectComponent {
	type: ComponentType.MentionableSelect;
	id?: number;
	custom_id: string;
	placeholder?: string;
	default_values?: SelectDefaultValue[];
	min_values?: number;
	max_values?: number;
	required?: boolean;
	disabled?: boolean;
}

export interface ChannelSelectComponent {
	type: ComponentType.ChannelSelect;
	id?: number;
	custom_id: string;
	channel_types?: ChannelType[];
	placeholder?: string;
	default_values?: SelectDefaultValue[];
	min_values?: number;
	max_values?: number;
	required?: boolean;
	disabled?: boolean;
}

export interface SectionComponent {
	type: ComponentType.Section;
	id?: number;
	components: TextDisplayComponent[];
	accessory: ButtonComponent | ThumbnailComponent;
}

export interface TextDisplayComponent {
	type: ComponentType.TextDisplay;
	id?: number;
	content: string;
}

export interface ThumbnailComponent {
	type: ComponentType.Thumbnail;
	id?: number;
	media: UnfurledMediaItem;
	description?: string;
	spoiler?: boolean;
}

export interface MediaGalleryItem {
	media: UnfurledMediaItem;
	description?: string;
	spoiler?: boolean;
}

export interface MediaGalleryComponent {
	type: ComponentType.MediaGallery;
	id?: number;
	items: MediaGalleryItem[];
}

export interface FileComponent {
	type: ComponentType.File;
	id?: number;
	file: UnfurledMediaItem;
	spoiler?: boolean;
	name?: string;
	size?: number;
}

export interface SeparatorComponent {
	type: ComponentType.Separator;
	id?: number;
	divider?: boolean;
	spacing?: SeparatorSpacing;
}

export interface ContainerComponent {
	type: ComponentType.Container;
	id?: number;
	components: (
		| ActionRowComponent
		| TextDisplayComponent
		| SectionComponent
		| MediaGalleryComponent
		| SeparatorComponent
		| FileComponent
	)[];
	accent_color?: number | null;
	spoiler?: boolean;
}

export interface LabelComponent {
	type: ComponentType.Label;
	id?: number;
	label: string;
	description?: string;
	component:
		| TextInputComponent
		| StringSelectComponent
		| UserSelectComponent
		| RoleSelectComponent
		| MentionableSelectComponent
		| ChannelSelectComponent
		| FileUploadComponent;
}

export interface FileUploadComponent {
	type: ComponentType.FileUpload;
	id?: number;
	custom_id: string;
	min_values?: number;
	max_values?: number;
	required?: boolean;
}

export type Component =
	| ActionRowComponent
	| ButtonComponent
	| StringSelectComponent
	| TextInputComponent
	| UserSelectComponent
	| RoleSelectComponent
	| MentionableSelectComponent
	| ChannelSelectComponent
	| SectionComponent
	| TextDisplayComponent
	| ThumbnailComponent
	| MediaGalleryComponent
	| FileComponent
	| SeparatorComponent
	| ContainerComponent
	| LabelComponent
	| FileUploadComponent;

export type MessageComponent =
	| ActionRowComponent
	| SectionComponent
	| TextDisplayComponent
	| MediaGalleryComponent
	| FileComponent
	| SeparatorComponent
	| ContainerComponent;

export type ModalComponent = LabelComponent | TextDisplayComponent;
