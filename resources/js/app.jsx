import "../css/app.css";
import "./bootstrap";
import "trix/dist/trix.css";
import "trix";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { router } from "@inertiajs/react";

// Handle 419 errors globally
router.on('error', (error) => {
    if (error.response?.status === 419) {
        // Token expired - reload current page to get fresh token
        router.reload();
    }
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
