/** ex. import { hmeta } from "@/lib/metadata";
export function meta({}: Route.MetaArgs) {
   return hmeta({ title: "Home", description: "2021 Nknight AMAMIYA@nk4dev" });
 }
 */

export function hmeta({ title, description }: { title: string, description?: string }) {
    const titleresult = title ? title + " | Nknight AMAMIYA" : "Nknight AMAMIYA";
    return [
        { title: titleresult },
        { name: "description", content: description || "2021 Nknight AMAMIYA@nk4dev" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { property: "og:image", content: "https://ogp-img-gen.vercel.app/api/img?text=" + encodeURIComponent(title) },
    ];
}
