// Testy logiki aplikacji bez przeglądarki: node tests.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
class Element{
 constructor(){this.innerHTML='';this.value='';this.style={};this.dataset={};this.open=false;this.listeners={};this.children=[];this.classList={add(){},remove(){},toggle(){}};}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
 appendChild(el){this.children.push(el);return el;}
 replaceChildren(){this.children=[];this.innerHTML='';}
 setAttribute(){} removeAttribute(){} focus(){} close(){this.open=false;} showModal(){this.open=true;}
 querySelector(){return new Element();}
 getContext(){return {clearRect(){},fillRect(){},strokeRect(){}};}
 dispatchEvent(){}
}
function boot(kiosk,protocol='https:'){
 const nodes=new Map(),events={},storage=new Map();let tick=0;
 const document={body:{dataset:{mode:kiosk?'kiosk':''}},documentElement:{tagName:'HTML'},visibilityState:'visible',
 querySelector(selector){if(!nodes.has(selector))nodes.set(selector,new Element());return nodes.get(selector);},querySelectorAll(){return [];},createElement(){return new Element();},addEventListener(type,fn){(events[type]??=[]).push(fn);}};
 const context=vm.createContext({console,URL,Intl,Date,Math,JSON,Number,String,Set,Array,Error,structuredClone,crypto:{randomUUID:require('node:crypto').randomUUID},document,
 location:{protocol,href:protocol==='file:'?'file:///C:/demo/index.html':'https://example.github.io/sklep/index.html',hash:'#self'},
 navigator:{userAgent:'Test',locks:{request:(_,fn)=>fn()}},performance:{now:()=>tick+=10},HTMLInputElement:Element,CanvasRenderingContext2D:function(){},
 localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){},Event:class{},
 window:{addEventListener(){},print(){}},FormData:class{}});
 for(const file of ['qrcode.min.js','kiosk-ui.js','app.js','scanner.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),context,{filename:file});
 return {context,nodes,events,run:code=>vm.runInContext(code,context)};
}
const admin=boot(false);
assert.match(admin.nodes.get('#app').innerHTML,/Otwórz emulator/);
assert.match(admin.nodes.get('#app').innerHTML,/Przejdź do pulpitu administracyjnego/);
assert.equal(admin.nodes.get('#station-qr').title,'https://example.github.io/sklep/kasa.html');
assert.ok(admin.nodes.get('#station-qr').children.length>0,'Prawdziwa biblioteka QR wygenerowała płótno');
assert.equal(admin.run("drawStationQR('javascript:alert(1)')"),null);
const local=boot(false,'file:');assert.match(local.nodes.get('#qr-status').textContent,/plik lokalny/);
const kiosk=boot(true),run=kiosk.run;
assert.match(kiosk.nodes.get('#app').innerHTML,/checkout-terminal/);
assert.doesNotMatch(kiosk.nodes.get('#app').innerHTML,/station-launch/);
run("location.hash='#inventory';navigate()");assert.equal(run('route'),'self');
run("scanCode('5901234000004')");assert.equal(run('cartTotal()'),699);assert.match(kiosk.nodes.get('#app').innerHTML,/Chleb wiejski/);
run("scanCode('5901234000004')");assert.equal(run('cart()[0].quantity'),2);assert.equal(run('lastScanned.quantity'),1);
assert.throws(()=>run("scanCode('99999999')"),/Nieznany kod/);assert.equal(run('cartTotal()'),1398);
run("addProduct('p1',0.5)");assert.equal(run('cartTotal()'),1848);
assert.throws(()=>run("addProduct('p5',10000)"),/magazynie/);
run("purchase('Karta',0)");assert.equal(run('db.sales.length'),1);assert.equal(run('db.sales[0].total'),1848);
assert.equal(run("db.products.find(p=>p.id==='p5').stock"),10);assert.equal(run("db.products.find(p=>p.id==='p1').stock"),23.5);assert.equal(run('cart().length'),0);
run("modal.close();db.products.find(p=>p.id==='p5').barcode='00123456'");
function burst(code){for(const key of [...code,'Enter']){const event={key,target:kiosk.nodes.get('#barcode'),preventDefault(){this.prevented=true;},stopImmediatePropagation(){}};for(const fn of kiosk.events.keydown)fn(event);if(key==='Enter')assert.equal(event.prevented,true);}}
burst('00123456');burst('00123456');assert.equal(run('cart()[0].quantity'),2);
run('modal.showModal()');burst('00123456');assert.equal(run('cart()[0].quantity'),2,'Skan w oknie płatności nie zmienia koszyka');
console.log('PASS: panel startowy, prawdziwe generowanie QR, adresy, blokada tras, skanowanie, produkty na wagę, kwoty, magazyn, sprzedaż i czytnik HID.');
