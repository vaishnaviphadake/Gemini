import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import "./App.css";
const URL = import.meta.env.VITE_URL;
import Answer from "./components/Answer";

function App() {
	const [query, setQuery] = useState("");
	const [result, setResult] = useState([]);
	const [darkMode, setDarkMode] = useState(true);
	const scrollRef = useRef(null);

	const payload = {
		contents: [
			{
				parts: [
					{
						text: query,
					},
				],
			},
		],
	};

	const askQuery = async () => {
		if (!query.trim()) return;

		setResult((prev) => [...prev, { type: "q", text: query }]);
		setQuery("");

		let res = await fetch(URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		res = await res.json();
		let response = res?.candidates[0]?.content?.parts[0]?.text;
		let dataString = response
			.split("* ")
			.map((item) => item.trim())
			.filter((item) => item !== "");

		setResult((prev) => [...prev, { type: "a", text: dataString }]);
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [result]);

	return (
		<div
			className={`${
				darkMode ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900"
			} h-screen flex flex-col`}
		>
			<main className="flex-1 flex flex-col md:flex-row overflow-hidden">
				<aside
					className={`${
						darkMode ? "bg-zinc-700 text-white" : "bg-zinc-200 text-black"
					} w-full md:w-1/5 p-4 border-r border-zinc-700`}
				>
					<div className="text-xl font-bold mb-2 flex justify-between items-center ">
						<h2 className="text-zinc-200 text-3xl sm:text-lg">GPT Clone</h2>
						<button
							onClick={() => setDarkMode((prev) => !prev)}
							title="Toggle Theme"
							className="p-2 rounded-full"
						>
							{darkMode ? <Sun size={18} /> : <Moon size={18} />}
						</button>
					</div>
				</aside>

				<section className="flex-1 flex flex-col">
					<div
						ref={scrollRef}
						className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent p-4"
					>
						<ul className="space-y-3">
							{result.map((item, index) =>
								item.type === "q" ? (
									<li
										key={`q-${index}`}
										className="text-right"
									>
										<div className="text-sm text-zinc-400 pr-2">You</div>
										<div className="inline-block bg-zinc-600 px-4 py-2 rounded-2xl text-white max-w-full sm:max-w-xl shadow">
											<Answer
												text={item.text}
												index={0}
											/>
										</div>
									</li>
								) : (
									<li
										key={`a-${index}`}
										className="text-left"
									>
										<div className="text-sm text-zinc-400 pl-2">GPT</div>
										<div className="space-y-2">
											{item.text.map((ansItem, ansIndex) => (
												<div
													key={`a-${index}-${ansIndex}`}
													className="bg-zinc-700 px-4 py-2 rounded-2xl text-white max-w-full sm:max-w-xl shadow"
												>
													<Answer
														text={ansItem}
														index={ansIndex + 1}
													/>
												</div>
											))}
										</div>
									</li>
								)
							)}
						</ul>
					</div>

					<div className="mt-6 px-4">
						<div
							className={`${
								darkMode
									? "bg-zinc-900 border-zinc-600"
									: "bg-white border-zinc-300"
							} flex items-center gap-2 rounded-full px-4 py-2 border w-full max-w-3xl mb-10 mx-auto`}
						>
							<input
								type="text"
								placeholder="Ask me anything..."
								className="flex-1 bg-transparent p-2 outline-none"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								onKeyDown={(e) => e.key === "Enter" && askQuery()}
							/>
							<button
								onClick={askQuery}
								className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-2 rounded-full"
							>
								Ask
							</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default App;
