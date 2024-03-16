import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { Fragment, ReactNode, useState } from 'react';

// eslint-disable-next-line import/no-absolute-path
const mylogo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuHBOvXVQSQbb0Yadd7iA4jrXDbQqmIHFTyA&usqp=CAU';

const navigation = [{ name: 'Dashboard', href: '/', icon: HomeIcon }];

const teams = [{ name: 'Create Organisation', href: '/org', initial: 'C' }];

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

type SideBarProps = {
	customSectionHeader?: any;
	children?: ReactNode;
};

const LowerSection = () => {
	return (
		<li className="-mx-6 mt-auto">
			<a
				href="#"
				className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
			>
				<img
					className="h-8 w-8 rounded-2xl bg-gray-50"
					src="https://cdn-icons-png.flaticon.com/512/2761/2761035.png"
					alt=""
				/>
				<span aria-hidden="true">Connect wallet</span>
			</a>
		</li>
	);
};

const SideBar = ({ children, customSectionHeader }: SideBarProps) => {
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const isLinkActive = (currentSlug: string) => {
		return router.pathname === currentSlug;
	};

	return (
		<>
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-900/80" />
						</Transition.Child>

						<div className="fixed inset-0 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
											<button
												type="button"
												className="-m-2.5 p-2.5"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
										<div className="flex h-24 shrink-0 items-center">
											<img className="h-16 w-auto rounded-2xl" src={mylogo} alt="Company Logo" />
										</div>
										<nav className="flex flex-1 flex-col">
											<ul role="list" className="flex flex-1 flex-col gap-y-7">
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														{navigation.map((item) => (
															<li key={item.name}>
																<a
																	href={item.href}
																	className={classNames(
																		isLinkActive(item.href)
																			? 'bg-gray-50 text-orange-600'
																			: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
																		'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																	)}
																>
																	<item.icon
																		className={classNames(
																			isLinkActive(item.href)
																				? 'text-orange-600'
																				: 'text-gray-400 group-hover:text-orange-600',
																			'h-6 w-6 shrink-0',
																		)}
																		aria-hidden="true"
																	/>
																	{item.name}
																</a>
															</li>
														))}
													</ul>
												</li>
												<li>
													<div className="text-xs font-semibold leading-6 text-gray-400">
														Submenu
													</div>
													<ul role="list" className="-mx-2 mt-2 space-y-1">
														{teams.map((team) => (
															<li key={team.name}>
																<a
																	href={team.href}
																	className={classNames(
																		isLinkActive(team.href)
																			? 'bg-gray-50 text-orange-600'
																			: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
																		'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																	)}
																>
																	<span
																		className={classNames(
																			isLinkActive(team.href)
																				? 'text-orange-600 border-orange-600'
																				: 'text-gray-400 border-gray-200 group-hover:border-orange-600 group-hover:text-orange-600',
																			'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
																		)}
																	>
																		{team.initial}
																	</span>
																	<span className="truncate">{team.name}</span>
																</a>
															</li>
														))}
													</ul>
												</li>
												<LowerSection />
											</ul>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
						<div className="flex h-24 shrink-0 items-center">
							<img className="h-16 w-auto rounded-2xl" src={mylogo} alt="Company logo" />
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<a
													href={item.href}
													className={classNames(
														isLinkActive(item.href)
															? 'bg-gray-50 text-orange-600'
															: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
														'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
													)}
												>
													<item.icon
														className={classNames(
															isLinkActive(item.href)
																? 'text-orange-600'
																: 'text-gray-400 group-hover:text-orange-600',
															'h-6 w-6 shrink-0',
														)}
														aria-hidden="true"
													/>
													{item.name}
												</a>
											</li>
										))}
									</ul>
								</li>
								<li>
									<div className="text-xs font-semibold leading-6 text-gray-400">Submenu</div>
									<ul role="list" className="-mx-2 mt-2 space-y-1">
										{teams.map((team) => (
											<li key={team.name}>
												<a
													href={team.href}
													className={classNames(
														isLinkActive(team.href)
															? 'bg-gray-50 text-orange-600'
															: 'text-gray-700 hover:text-orange-600 hover:bg-gray-50',
														'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
													)}
												>
													<span
														className={classNames(
															isLinkActive(team.href)
																? 'text-orange-600 border-orange-600'
																: 'text-gray-400 border-gray-200 group-hover:border-orange-600 group-hover:text-orange-600',
															'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
														)}
													>
														{team.initial}
													</span>
													<span className="truncate">{team.name}</span>
												</a>
											</li>
										))}
									</ul>
								</li>
								<LowerSection />
							</ul>
						</nav>
					</div>
				</div>

				<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white p-4 shadow-sm sm:px-6 lg:hidden">
					<button
						type="button"
						className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
					{navigation.map((item, i) => {
						if (isLinkActive(item.href))
							return (
								<div className="flex-1 text-sm font-semibold leading-6 text-gray-900" key={i}>
									{item.name}
								</div>
							);
						return <></>;
					})}
					<a href="#">
						<img className="h-8 w-8 rounded-2xl bg-gray-50" src={mylogo} alt="" />
					</a>
				</div>

				<main className="lg:pl-72">
					{customSectionHeader && customSectionHeader}
					<div className="px-4 sm:px-6 lg:px-8">{children}</div>
				</main>
			</div>
		</>
	);
};

export default SideBar;
