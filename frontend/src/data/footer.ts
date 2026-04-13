import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "Home", href: "#" },
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Changelog", href: "#changelog" },
        ]
    },
    {
        title: "Resources",
        links: [
            { name: "Blog", href: "#blog" },
            { name: "Tutorials", href: "#tutorials" },
            { name: "Community", href: "#community" },
            { name: "Support", href: "#support" },
            { name: "About", href: "#about" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
        ]
    }
];