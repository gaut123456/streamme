import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Search from "./search";
import Featured from "./featured";
import "./index.css";

export default component$(() => {
	return (
		<>
			<h1 class="streamme-logo">StreamMe</h1>
			<Search />
			<Featured />
		</>
	);
});

export const head: DocumentHead = {
	title: "Welcome to Qwik",
	meta: [
		{
			name: "description",
			content: "Qwik site description",
		},
	],
};
