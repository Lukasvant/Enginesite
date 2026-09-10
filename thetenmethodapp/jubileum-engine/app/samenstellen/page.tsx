import Link from "next/link";import { JubileeComposer } from "@/app/components/JubileeComposer";import s from "../components/jubilee-public.module.css";
export const metadata={title:"Jubileumwensen samenstellen | Jubileum Engine"};
export default function Compose(){return <main className={s.page}><header className={s.nav}><Link className={s.brand} href="/">Jubileum Engine</Link><nav className={s.navLinks}><Link href="/mogelijkheden">Mogelijkheden</Link><Link href="/programmas">Programma’s</Link></nav></header><JubileeComposer/></main>}
