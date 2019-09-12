import {IoElement} from "../../io.js";
import "../../../lib/marked.min.js";

export class IoMdView extends IoElement {
	static get Style() {
		return /* css */`
		:host {
			display: block;
			align-self: stretch;
			justify-self: stretch;
			flex: 1 1 auto;
			--io-code-size: 15px;
			padding: var(--io-spacing) calc(4 * var(--io-spacing));
			overflow-x: hidden;
			overflow-y: auto;
		}
		:host > :first-child {
			margin-top: 0;
		}
		:host > :last-child {
			margin-top: 0;
		}
		:host p {
			line-height: 1.4em;
		}
		:host a {
			text-decoration: underline;
			color: var(--io-color-link);
		}
		:host h1, :host h2, :host h3, :host h4 {
			margin: 0;
			border: var(--io-border);
			border-width: 0 0 var(--io-border-width) 0;
		}
		:host h1 {
			padding: 0.5em 0;
		}
		:host h2 {
			padding: 0.4em 0;
		}
		:host h3 {
			padding: 0.3em 0;
		}
		:host h4 {
			padding: 0.2em 0;
		}
		:host code {
			font-family: monospace, monospace;
			-webkit-font-smoothing: auto;
			overflow: auto;
			color: var(--io-color-link);
			font-weight: bold;
			background: var(--io-background-color-light);
		}
		:host pre > code {
			color: inherit;
			background-color: var(--io-background-color-light);
			line-height: 1.6em;
		}
		:host code.language-html,
		:host code.language-javascript {
			padding: 1em;
			display: block;
			font-size: var(--io-code-size);
		}
		:host blockquote {
			font-size: 0.85em;
			opacity: 0.5;
			margin: 0;
			padding: var(--io-spacing) 0;
		}
		:host table	{
			width: 100% !important;
			border: 1px solid black;
			border-collapse: collapse;
			table-layout: fixed;
		}
		:host table td,
		:host table tr,
		:host table th {
			border: 1px solid gray;
			padding: 0.25em;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		:host .videocontainer {
				width: 100%;
				height: 0;
				position: relative;
				padding-bottom: 56.25%;
		}
		:host .videocontainer > iframe {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
		}
		@keyframes spinner {
			to {transform: rotate(360deg);}
		}
		:host .io-loading {
			background-image: repeating-linear-gradient(135deg, var(--io-background-color-light), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-light) 10px) !important;
			background-repeat: repeat;
			position: relative;
		}
		:host .io-loading:after {
			content: '';
			box-sizing: border-box;
			position: absolute;
			top: 50%;
			left: 50%;
			width: 40px;
			height: 40px;
			margin-top: -20px;
			margin-left: -20px;
			border-radius: 50%;
			border: var(--io-border);
			border-top-color: #000;
			animation: spinner .6s linear infinite;
		}
		`;
	}
	static get Properties() {
		return {
			path: {
				type: String,
				reflect: 1
			},
			role: 'document',
		};
	}
	onResized() {
		let width = this.getBoundingClientRect().width;
		width = Math.min((width - 30) / 35, 15);
		this.style.setProperty('--io-code-size', width + "px");
	}
	parseMarkdown(markdown) {
		if (window.marked) {
			if (window.marked) {
				window.marked.setOptions({
					sanitize: false,
					highlight: function(code) {
						return window.hljs ? window.hljs.highlightAuto(code).value : null;
					},
				});
			}
			this.innerHTML = window.marked(markdown);
			this.classList.toggle('io-loading', false);
			this.dispatchEvent('content-ready', {}, true);
		}
	}
	pathChanged() {
		this.classList.toggle('io-loading', true);
		fetch(this.path)
		.then(response => {
			return response.text();
		})
		.then(text => {
			this.parseMarkdown(text);
		});
	}
}

IoMdView.Register();
