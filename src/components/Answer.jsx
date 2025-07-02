import { useEffect, useState } from "react";
import { checkHeading, replaceHeading } from "./Helper";

const Answer = ({ text, isQuestion = false }) => {
	const [heading, setHeading] = useState(false);
	const [title, setTitle] = useState(text);

	useEffect(() => {
		if (typeof text === "string" && checkHeading(text)) {
			setHeading(true);
			setTitle(replaceHeading(text));
		}
	}, [text]);

	if (isQuestion) {
		return <span className="font-medium text-white">{text}</span>;
	}

	return (
		<div>
			{heading ? (
				<span className="block font-semibold text-xl text-zinc-200 mb-1">
					{title}
				</span>
			) : (
				<span className="block text-zinc-300 p-2">{text}</span>
			)}
		</div>
	);
};

export default Answer;
