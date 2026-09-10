"use client";
import { JubileeWishes, emptyWishes } from "@/app/lib/jubilee-products";
import s from "./jubilee-public.module.css";
const key="jubileum-engine-wensen-v1";
export function ProgramStartButton({products}:{products:readonly string[]}){function start(){let saved:Partial<JubileeWishes>={};try{saved=JSON.parse(localStorage.getItem(key)||"{}");}catch{}localStorage.setItem(key,JSON.stringify({...emptyWishes,...saved,selected:Array.from(new Set([...(saved.selected||[]),...products]))}));window.location.assign("/samenstellen");}return <button className={s.button} onClick={start}>Start met dit programma</button>}
