(function(){
  var menuButton=document.querySelector('[data-menu-button]');
  var mobileMenu=document.querySelector('[data-mobile-menu]');
  if(menuButton&&mobileMenu){menuButton.addEventListener('click',function(){mobileMenu.classList.toggle('open')})}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('.hero-dots button'));
  var current=0;
  function showSlide(i){
    if(!slides.length)return;
    current=(i+slides.length)%slides.length;
    slides.forEach(function(s,n){s.classList.toggle('active',n===current)});
    dots.forEach(function(d,n){d.classList.toggle('active',n===current)});
  }
  dots.forEach(function(d,n){d.addEventListener('click',function(){showSlide(n)})});
  if(slides.length){showSlide(0);setInterval(function(){showSlide(current+1)},5200)}
  var search=document.querySelector('[data-search]');
  var chips=[].slice.call(document.querySelectorAll('[data-filter]'));
  var cards=[].slice.call(document.querySelectorAll('[data-card]'));
  var active='all';
  function normalize(s){return(String(s||'')).toLowerCase().trim()}
  function applyFilter(){
    var q=normalize(search&&search.value);
    cards.forEach(function(card){
      var text=normalize(card.getAttribute('data-title')+' '+card.getAttribute('data-tags')+' '+card.getAttribute('data-region')+' '+card.getAttribute('data-year')+' '+card.getAttribute('data-category-name'));
      var cat=card.getAttribute('data-category');
      var okText=!q||text.indexOf(q)>-1;
      var okCat=active==='all'||cat===active;
      card.classList.toggle('hidden-card',!(okText&&okCat));
    });
  }
  if(search){search.addEventListener('input',applyFilter)}
  chips.forEach(function(chip){chip.addEventListener('click',function(){chips.forEach(function(c){c.classList.remove('active')});chip.classList.add('active');active=chip.getAttribute('data-filter');applyFilter()})});
})();