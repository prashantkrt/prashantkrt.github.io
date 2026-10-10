const filterButtons=document.querySelectorAll("[data-filter]");
const cards=document.querySelectorAll(".directory-card[data-category]");
filterButtons.forEach(button=>button.addEventListener("click",()=>{
  filterButtons.forEach(b=>b.classList.remove("active"));button.classList.add("active");
  const selected=button.dataset.filter;
  cards.forEach(card=>{const categories=card.dataset.category.split(" ");const visible=selected==="all"||categories.includes(selected);card.classList.toggle("hidden",!visible);});
}));
