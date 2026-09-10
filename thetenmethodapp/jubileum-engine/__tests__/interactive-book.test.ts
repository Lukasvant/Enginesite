/** @jest-environment jsdom */
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { InteractiveBook } from "../app/preview/[token]/InteractiveBook";

jest.mock("../app/preview/[token]/book.module.css", () => ({}));
jest.mock("@/app/lib/era-context", () => ({ getEraContext: () => null }));
let container: HTMLDivElement;
let root: Root;
const props = {name: "Demobedrijf", foundationYear: 1951, intro: "Voorbeeldintro", milestones: [{year:1951,title:"Begin"},{year:2000,title:"Nieuwe werkplaats"}],contact:"mailto:info@example.com"};
const button = (label: string) => Array.from(container.querySelectorAll("button")).find(b => (b.getAttribute("aria-label") || b.textContent || "").includes(label))!;
const click = (label: string) => act(() => button(label).click());
beforeEach(() => { (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true; container=document.createElement("div");document.body.appendChild(container);root=createRoot(container); });
afterEach(() => {act(()=>root.unmount());container.remove();});
test("opens, selects milestones and reaches a personalized proposal without passing the last chapter", () => {
  act(()=>root.render(React.createElement(InteractiveBook, props)));
  click("Open jullie verhaal");
  expect(button("Vorig hoofdstuk").disabled).toBe(true);
  click("Volgend hoofdstuk"); click("2000");
  expect(container.querySelector('[aria-live="polite"]')?.textContent).toContain("Nieuwe werkplaats");
  click("Volgend hoofdstuk"); click("Volgend hoofdstuk"); click("Volgend hoofdstuk");
  expect(button("Volgend hoofdstuk").disabled).toBe(true);
  expect(container.querySelector('a[href="mailto:info@example.com"]')).not.toBeNull();
  click("Terug naar de omslag"); expect(button("Open jullie verhaal")).toBeDefined();
});
test("keyboard and horizontal swipes change chapters; vertical gestures do not", () => {
  act(()=>root.render(React.createElement(InteractiveBook, props)));click("Open jullie verhaal");
  act(()=>button("Volgend hoofdstuk").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true})));
  expect(container.querySelector('[role="status"]')?.textContent).toContain("2 / 5");
  const spread=container.querySelector("article")!.parentElement!;
  function gesture(x:number,y:number){act(()=>{const start=new Event("touchstart",{bubbles:true});Object.assign(start,{touches:[{clientX:200,clientY:200}]});spread.dispatchEvent(start);const end=new Event("touchend",{bubbles:true});Object.assign(end,{changedTouches:[{clientX:x,clientY:y}]});spread.dispatchEvent(end);});}
  gesture(190,50);expect(container.querySelector('[role="status"]')?.textContent).toContain("2 / 5");
  gesture(50,200);expect(container.querySelector('[role="status"]')?.textContent).toContain("3 / 5");
});
test("missing company history shows honest empty states",()=>{
  act(()=>root.render(React.createElement(InteractiveBook,{...props,foundationYear:null,milestones:[]})));click("Open jullie verhaal");click("Volgend hoofdstuk");
  expect(container.textContent).toContain("Er zijn nog geen mijlpalen beschikbaar");click("Volgend hoofdstuk");expect(container.textContent).toContain("Zodra het oprichtingsjaar bekend is");
});
