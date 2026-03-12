const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BAWKt1nk.js",app:"_app/immutable/entry/app.DpGDCwVW.js",imports:["_app/immutable/entry/start.BAWKt1nk.js","_app/immutable/chunks/DhYWXyow.js","_app/immutable/chunks/B8vSlvN1.js","_app/immutable/entry/app.DpGDCwVW.js","_app/immutable/chunks/B8vSlvN1.js","_app/immutable/chunks/D39B3rug.js","_app/immutable/chunks/O_-iGwVx.js","_app/immutable/chunks/CjGHiuOY.js","_app/immutable/chunks/DTmHzjnG.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DZ7-J2Vq.js')),
			__memo(() => import('./chunks/1-Cfv4aMRQ.js')),
			__memo(() => import('./chunks/2-B1-XXWgM.js')),
			__memo(() => import('./chunks/3-BMLtqWaK.js')),
			__memo(() => import('./chunks/4-CaDS3xSZ.js')),
			__memo(() => import('./chunks/5-lAaLwVwo.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/cutlist",
				pattern: /^\/cutlist\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/quotes",
				pattern: /^\/quotes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
