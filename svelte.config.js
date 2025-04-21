import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		
		// Handle HTTP errors during prerendering
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// If the error is about an API endpoint during prerendering, ignore it
				if (path.startsWith('/api/')) {
					console.warn(`Ignoring error during prerendering for API path: ${path}`);
					return;
				}
				
				// Otherwise throw the error
				throw new Error(`${message} (${path}${referrer ? ` - referrer: ${referrer}` : ''})`);
			}
		}
	}
};

export default config;
