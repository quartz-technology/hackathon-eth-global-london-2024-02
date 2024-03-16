import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

type SectionHeaderProps = {
	pageName: string;
	backgroundImageUrl: string;
	avatarImageUrl: string;
};

const SectionHeader = (sectionHeaderProps: SectionHeaderProps) => {
	return (
		<div>
			<div>
				<img className="h-32 w-full object-cover lg:h-48" src={sectionHeaderProps.backgroundImageUrl} alt="" />
			</div>
			<div className="mx-auto  px-4 sm:px-6 lg:px-8">
				<div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
					<div className="flex">
						<img
							className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
							src={sectionHeaderProps.avatarImageUrl}
							alt=""
						/>
					</div>
					<div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
						<div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
							<h1 className="truncate text-2xl font-bold text-gray-900">{sectionHeaderProps.pageName}</h1>
						</div>
					</div>
				</div>
				<div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
					<h1 className="truncate text-2xl font-bold text-gray-900">{sectionHeaderProps.pageName}</h1>
				</div>
			</div>
		</div>
	);
};

export default SectionHeader;
