/** @jest-environment jsdom */
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { ProductExperience } from "../app/preview/[token]/ProductExperience";
import { createJubileeBrief, jubileeProducts } from "../app/lib/jubilee-products";
jest.mock("../app/preview/[token]/products.module.css",()=>({}));
let container:HTMLDivElement;let root:Root;
const button=(label:string)=>Array.from(container.querySelectorAll("button")).find(b=>(b.getAttribute("aria-label")||b.textContent||"").includes(label))!;
const click=(label:string)=>act(()=>button(label).click());
beforeEach(()=>{(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;container=document.createElement("div");document.body.appendChild(container);root=createRoot(container);});
afterEach(()=>{act(()=>root.unmount());container.remove();});
test("proposal contains only valid selected products and explicit request boundary",()=>{
 const text=createJubileeBrief("A & B",["then-now","then-now","invented"],"Generatiewissel","In juni");
 expect(text.match(/Toen & nu/g)).toHaveLength(1);expect(text).not.toContain("invented");expect(text).toContain("geen bestelling");expect(text).toContain("In juni");
});
test("selections survive switching demos and reach the company-specific email",()=>{
 act(()=>root.render(React.createElement(ProductExperience,{name:"A & B"})));
 click("Neem dit mee");click("Een editie voor jou");click("Neem dit mee");
 const link=()=>container.querySelector('a[href^="mailto:"]')!.getAttribute("href")!;
 expect(decodeURIComponent(link())).toContain("A & B");expect(decodeURIComponent(link())).toContain("Toen & nu");expect(decodeURIComponent(link())).toContain("Een editie voor jou");
 click("Verwijder Toen & nu");expect(decodeURIComponent(link())).not.toContain("- Toen & nu");expect(decodeURIComponent(link())).toContain("- Een editie voor jou");
});
test("all eight demos render and missing milestones do not create company claims",()=>{
 act(()=>root.render(React.createElement(ProductExperience,{name:"Demobedrijf"})));
 for(const p of jubileeProducts){click(p.title);expect(container.textContent).toContain(p.description);}
 click("Jullie geschiedenis op groot scherm");expect(container.textContent).toContain("Welke mijlpaal zetten we hier in het licht?");
 click("Een atlas van jullie werk");expect(container.textContent).toContain("geen echte projectlocaties");
 click("Samen herinneringen verzamelen");expect(button("Bewaar mijn concept").disabled).toBe(true);
});
