import { Checkbox } from "../checkbox";
import { Header } from "../header";
import { ProgressBar } from "../progressBar";
import styles from "./selection.module.css";
import { Fragment, useEffect, useState } from "react";

type Topic = {
	name: string;
	href: string;
};

interface Topics<T> {
	[key: string]: [T];
}

export const SelectionScreen = () => {
	const [selected, setSelected] = useState("map");
	const [specifications, setSpecifications] = useState({});
	const [selectedSpecification, setSelectedSpecification] = useState("GCSE");
	const [topics, setTopics] = useState<Topics<Topic>>({
		"Topic 1": [{ name: "Subtopic 1", href: "/tests/map" }],
	});
	const [state, setState] = useState("loaded");

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
	};

	useEffect(() => {
		document.body.style.overflow = "hidden";
		pageBootstrap();
	}, []);

	return (
		<div className={styles.app}>
			<Header />
			<div className={styles.screen}>
				<div className={styles.leftSide}>
					<div className="innerSelection">
						<div className="sidebarItem">
							{Object.keys(specifications).map((spec: any) => {
								return <p>{spec}</p>;
							})}
						</div>
					</div>
				</div>
				<div className={styles.rightSide}>
					<div className={styles.rightSideInner}>
						<div className={styles.rightSideGrid}>
							<div>{selectedSubtopics.length}</div>

							{Object.keys(topics).map(
								(topic: string, index: number) => (
									<TopicItem title={`${index + 1}. ` + topic}>
										{topics
											? topics[topic].map(
													(subtopic: Topic) => (
														<SubtopicItem
															selectedSubtopics={
																selectedSubtopics
															}
															setSelectedSubtopics={
																setSelectedSubtopics
															}
															name={subtopic.name}
															href={subtopic.href}
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
								{selectedSubtopics.length} topic
								{selectedSubtopics.length > 1 ? "s" : ""}{" "}
								selected
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const TopicItem = ({ children, title }: { children: any; title: string }) => {
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
