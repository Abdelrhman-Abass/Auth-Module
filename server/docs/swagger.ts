import { readFileSync } from "fs";
import { resolve } from "path";
import YAML from "yaml";

const auth = YAML.parse(readFileSync(resolve("./docs/auth.yaml"), "utf8"));


const swaggerDocs = {
    openapi: "3.0.0",
    info: {
        title: "Auth Module APIs",
        version: "1.0.0",
    },
    servers: [
        { url: 'https://auth-module-silk.vercel.app', description: 'Production server' },
        { url: 'http://localhost:5000', description: 'Local server' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
            },
        }, schemas: {
            // Merge schemas from all YAML files
            ...(auth.components?.schemas || {}),

        },
    },
    paths: {
        ...auth.paths,

    },
};


export default swaggerDocs;