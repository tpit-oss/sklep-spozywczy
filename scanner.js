'use strict';
// USB/Bluetooth HID: cyfry wysyłane jak z klawiatury, zakończone Enterem.
// Bufor wykrywa szybki skan także po kliknięciu przycisku lub pola wyszukiwania.
(()=>{
 let buffer='',last=0,firstTarget=null,originalValue='';
 function reset(){buffer='';last=0;firstTarget=null;originalValue='';}
 document.addEventListener('keydown',event=>{
  if(!['self','cashier'].includes(route)||event.ctrlKey||event.altKey||event.metaKey||event.isComposing)return;
  const now=performance.now();
  if(event.key==='Enter'){
   const scannerSequence=/^\d{8,14}$/.test(buffer)&&now-last<150;
   if(scannerSequence){
    const code=buffer,target=firstTarget,previous=originalValue;
    reset();event.preventDefault();event.stopImmediatePropagation();
    // Cofnij znaki skanera wpisane do innego pola, np. wyszukiwarki / wagi.
    if(target instanceof HTMLInputElement&&target.id!=='barcode'){
     target.value=previous;target.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(modal.open){toast('Najpierw zakończ lub zamknij bieżące okno, potem zeskanuj produkt.');return;}
    try{scanCode(code);}catch(error){toast(error.message);}
   }else reset();
   return;
  }
  if(event.key.length===1&&/^\d$/.test(event.key)){
   if(now-last>150||buffer.length>=14){reset();firstTarget=event.target;originalValue=event.target instanceof HTMLInputElement?event.target.value:'';}
   buffer+=event.key;last=now;
  }else if(!['Shift','Control','Alt','Meta'].includes(event.key))reset();
 },true);
 // Powrót do czytnika po wyborze produktu / zmianie ilości, bez kradzieży fokusu formularzom.
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-manual-code]')){
   const input=document.querySelector('#barcode');
   if(input){input.inputMode='numeric';input.focus();}
   return;
  }
  if(event.target.closest('input,select,textarea,label'))return;
  setTimeout(focusScanner,0);
 });
 const full=document.querySelector('#fullscreen');
 if(full){
  full.addEventListener('click',async()=>{
   try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();}
   catch{toast('Przeglądarka nie włączyła pełnego ekranu. Kasa nadal działa w bieżącym oknie.');}
  });
  document.addEventListener('fullscreenchange',()=>{full.hidden=Boolean(document.fullscreenElement);});
 }
 // Podtrzymanie ekranu na stanowisku, jeżeli przeglądarka udostępnia tę funkcję.
 let wakeLock=null;
 async function keepAwake(){
  if(!kioskMode||!('wakeLock' in navigator)||document.visibilityState!=='visible'||wakeLock)return;
  try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null;});}catch{/* System może odmówić np. przy oszczędzaniu energii. */}
 }
 document.addEventListener('visibilitychange',()=>{reset();keepAwake();});
 window.addEventListener('blur',reset);
 keepAwake();
})();
