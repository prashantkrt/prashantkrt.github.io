const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav");
if(menuButton&&nav){menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));}
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

const contactModal=document.getElementById("contactModal");
const openContactButtons=document.querySelectorAll(".contact-open");
const closeContactButtons=document.querySelectorAll("[data-modal-close]");
const closeContactModal=()=>{if(!contactModal)return;contactModal.classList.remove("open");contactModal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");};
openContactButtons.forEach(button=>button.addEventListener("click",()=>{if(!contactModal)return;contactModal.classList.add("open");contactModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");const first=contactModal.querySelector('input[name="name"]');if(first)first.focus();}));
closeContactButtons.forEach(button=>button.addEventListener("click",closeContactModal));
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeContactModal();});
const contactForm=document.getElementById("contactForm");
if(contactForm){contactForm.addEventListener("submit",event=>{if(!contactForm.reportValidity()){event.preventDefault();return;}const feedback=document.getElementById("formFeedback");const button=contactForm.querySelector('button[type="submit"]');if(feedback)feedback.textContent="Sending your message…";if(button){button.disabled=true;button.innerHTML="Sending…";}});}
