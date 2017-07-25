import * as rdflib from 'rdflib';

const PROFILE_QUERY = `
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>
	PREFIX solid: <http://www.w3.org/ns/solid/terms#>

	SELECT * WHERE {
		<URL> foaf:name ?name.
		OPTIONAL { <URL> foaf:img ?avatar. }
		OPTIONAL {
			<URL> solid:account ?account.
			?account foaf:name ?accountName.
		}
	}`;

// Loads a user profile from the given WebID document
export default function loadProfile({ url, contents, contentType }) {
	const graph = rdflib.graph();
	rdflib.parse(contents, graph, url, contentType);
	return queryFirstResult(graph, PROFILE_QUERY.replace(/URL/g, url))
		.then(mapVariables);
}

// Returns the first query result
function queryFirstResult(graph, sparql) {
	return new Promise((resolve, reject) => {
		const query = rdflib.SPARQLToQuery(sparql, false, graph);
		graph.query(query, resolve, null, () => resolve({}));
	});
}

// Transforms a query result into a simple key/value object
function mapVariables(result) {
	const mapped = {};
	for (const variable in result) {
		const entity = result[variable];
		if (entity && entity.value)
			mapped[variable.substr(1)] = entity.value;
	}
	return mapped;
}
