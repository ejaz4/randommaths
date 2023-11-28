import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Header } from "../header";
import { ProgressBar } from "../progressBar";
import { Skeleton } from "../skeleton";
import styles from "./selection.module.css";
import { Fragment, Suspense, useEffect, useState } from "react";
import ChevronRight from "@/assets/chevron-right.svg";
import { TestOptions } from "./options";

type Topic = {
	name: string;
	href: string;
};

interface Topics<T> {
	[key: string]: [T];
}

interface Specifications {
	[key: string]: string;
}

export const SelectionScreen = () => {
	const [specifications, setSpecifications] = useState<Specifications>({});
	const [selectedSpecification, setSelectedSpecification] = useState("GCSE");
	const [topics, setTopics] = useState<Topics<Topic>>({
		"Topic 1": [{ name: "Subtopic 1", href: "/tests/map" }],
	});
	const [state, setState] = useState("loading");
	const [screen, setScreen] = useState("selection");

	const [selectedSubtopics, setSelectedSubtopics] = useState<String[]>([]);

	const loadSpecifications = async () => {
		const specsManifest = await fetch("/tests/manifest.json");

		if (specsManifest.status !== 200) {
			setState("error");
			return;
		}

		const specs = await specsManifest.json();
		setSpecifications(specs);
	};

	const loadTopics = async () => {
		const topicsManifest = await fetch(
			`/tests/${selectedSpecification}/manifest.json`
		);

		if (topicsManifest.status !== 200) {
			setState("error");
			return;
		}

		const topics = await topicsManifest.json();
		setTopics(topics);
	};

	const pageBootstrap = async () => {
		// This function loads everything in the correct order.
		// It is called on page load.
		await loadSpecifications();
		await loadTopics();
		setState("loaded");
	};

	useEffect(() => {
		document.body.style.overflow = "hidden";
		pageBootstrap();
	}, []);

	useEffect(() => {
		console.log("selectedSpecification changed");
		loadTopics();
	}, [selectedSpecification]);

	return (
		<div className={styles.app}>
			<Header />
			<div className={styles.screen}>
				<div className={styles.leftSide}>
					<div className={styles.leftSideInner}>
						{Object.keys(specifications).map((spec: any, i) => {
							return (
								<SpecificationItem
									name={spec}
									href={specifications[spec]}
									selectedSpecification={
										selectedSpecification
									}
									key={i}
									setSelectedSpecification={
										setSelectedSpecification
									}
								/>
							);
						})}
					</div>
				</div>
				<div className={styles.rightSide}>
					<div className={styles.rightSideInner}>
						<div className={styles.rightSideGrid}>
							{state == "loaded" && (
								<>
									{Object.keys(topics).map(
										(topic: string, index: number) => (
											<TopicItem
												key={index}
												title={`${index + 1}. ` + topic}
											>
												{topics
													? topics[topic].map(
															(
																subtopic: Topic,
																i
															) => (
																<SubtopicItem
																	key={i}
																	selectedSubtopics={
																		selectedSubtopics
																	}
																	setSelectedSubtopics={
																		setSelectedSubtopics
																	}
																	name={
																		subtopic.name
																	}
																	href={
																		subtopic.href
																	}
																	progress={Math.floor(
																		Math.random() *
																			100
																	)}
																/>
															)
													  )
													: null}
											</TopicItem>
										)
									)}
								</>
							)}

							<Suspense>
								{state == "loading" && (
									<>
										{[...Array(6)].map((_, index) => (
											<TopicItem
												key={index}
												title={"skeleton"}
											>
												{[...Array(6)].map((_, i) => (
													<SubtopicItem
														key={i}
														selectedSubtopics={
															selectedSubtopics
														}
														setSelectedSubtopics={
															setSelectedSubtopics
														}
														name={"skeleton"}
														href={""}
														progress={Math.floor(
															Math.random() * 100
														)}
													/>
												))}
											</TopicItem>
										))}
									</>
								)}
							</Suspense>
						</div>
					</div>

					<div
						className={
							selectedSubtopics.length > 0
								? styles.rightSideFooter
								: styles.rightSideFooterDisabled
						}
					>
						<div className={styles.rightSideFooterInner}>
							<p>
								{selectedSubtopics.length != 0
									? selectedSubtopics.length
									: "No"}{" "}
								sub-topic
								{selectedSubtopics.length != 1 ? "s" : ""}{" "}
								selected
							</p>
							<Button
								onClick={() => {
									setScreen("options");
								}}
								variant="invert"
								image={<ChevronRight />}
							>
								Continue
							</Button>
						</div>
					</div>
				</div>
			</div>
			{screen == "options" && (
				<TestOptions
					setScreen={setScreen}
					subtopics={selectedSubtopics}
				/>
			)}
		</div>
	);
};

const SpecificationItem = ({
	name,
	href,
	setSelectedSpecification,
	selectedSpecification,
}: {
	name: string;
	href: string;
	setSelectedSpecification: any;
	selectedSpecification: string;
}) => {
	const setToMe = () => {
		// Sets the selected specification to the one that was clicked.
		setSelectedSpecification(href);
	};

	return (
		<div
			onClick={setToMe}
			className={`${styles.specificationItem} ${
				selectedSpecification == href
					? styles.specificationItemActive
					: ""
			}`}
		>
			<p>{name}</p>
		</div>
	);
};

const TopicItem = ({ children, title }: { children: any; title: string }) => {
	if (title == "skeleton") {
		return (
			<div className={styles.topicItem}>
				<br></br>
				<Skeleton height="40px" width="400px" />
				<br></br>
				<div className={styles.subtopicGrid}>{children}</div>
			</div>
		);
	}
	return (
		<div className={styles.topicItem}>
			<h1>{title}</h1>
			<div className={styles.subtopicGrid}>{children}</div>
		</div>
	);
};

const SubtopicItem = ({
	name,
	href,
	selectedSubtopics,
	setSelectedSubtopics,
	progress,
}: {
	name: string;
	href: string;
	selectedSubtopics: any;
	setSelectedSubtopics: any;
	progress: number;
}) => {
	if (name == "skeleton") {
		return (
			<div className={styles.subtopicItem}>
				<div>
					<Checkbox enabled={false} callback={() => {}} />
				</div>
				<div className={styles.subtopicDescription}>
					<Skeleton height="22px" width="100px" />
				</div>
			</div>
		);
	}

	const [checked, setChecked] = useState(false);

	return (
		<div className={styles.subtopicItem}>
			<div>
				<Checkbox
					callback={(checked: boolean) => {
						let newSelectedSubtopics = [...selectedSubtopics];

						if (checked) {
							if (!newSelectedSubtopics.includes(href)) {
								newSelectedSubtopics.push(href);
							}
						} else {
							newSelectedSubtopics = newSelectedSubtopics.filter(
								(subtopic: string) => subtopic != href
							);
						}

						setSelectedSubtopics(newSelectedSubtopics);
					}}
				/>
			</div>
			<div className={styles.subtopicDescription}>
				<p>{name}</p>
				<ProgressBar progress={progress} />
			</div>
		</div>
	);
};
