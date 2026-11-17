#!/usr/bin/env node
/* =====================================================================
   ZPRACOVÁNÍ FOTEK (jednorázově, potřebuje ffmpeg)
   ---------------------------------------------------------------------
   Vezme vybrané fotky z podkladů, zmenší je na max. 1920 px, zkomprimuje
   (JPEG, bez metadat) a udělá náhledy 800 px:
     assets/img/<název>.jpg         – plné rozlišení (lightbox, úvodní pásy)
     assets/img/thumbs/<název>.jpg  – náhledy (galerie, karty)
   Rozměry hotových fotek zapíše do nastroje/fotky.json (pro galerii).

   Podklady (nejsou v gitu):
     DVUR = fotky z krusnohorskydvur.cz a Instagramu (roztříděné)
     LOCAL = podklady/ v tomto projektu (fotky pokojů z podstránek webu)
   Spuštění:  node nastroje/zpracuj-fotky.js
   ===================================================================== */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DVUR = process.env.DVUR || 'C:/Users/fild0/Documents/golf-teplice-redesign/podklady-dvur';
const GOLF_IMG = process.env.GOLF_IMG || 'C:/Users/fild0/Documents/golf-teplice-redesign/assets/img';
const LOCAL = path.join(ROOT, 'podklady');
const IG = DVUR + '/instagram/vse';
const W = DVUR + '/web';
const P = LOCAL + '/pokoje';
const O = LOCAL + '/web-ostatni';

// cílový název → zdroj
const PHOTOS = {
  // budova a okolí hotelu
  'hotel-zima-noc': GOLF_IMG + '/14_img-034-web.jpg',
  'hotel-zapad-slunce': IG + '/127-Bs45ElfAViX.jpg',
  'hotel-zima-letecky': IG + '/188-Be-za45AT25.jpg',
  'hotel-zima-soumrak': IG + '/043-CJQmThYFhv-.jpg',
  'hotel-zima-vecer': IG + '/037-CLZJ57cFG4W.jpg',
  'hotel-zima-slunce': IG + '/148-BrMqQE0FBPV.jpg',
  'hotel-jaro': IG + '/150-BrHmuvsFHq5.jpg',
  'hotel-zima-snih': IG + '/117-BtksU2GFkhk.jpg',
  'hotel-zima-modra': IG + '/137-BsND8FDgOe4.jpg',
  'hotel-vchod-noc': W + '/004-krusnohorsky_dvur_vchod.jpg',
  'terasa-leto': IG + '/058-CAH2j5vF1FE.jpg',
  'terasa-vyhled': IG + '/036-COk2dhUFwxz.jpg',
  'terasa-kola': IG + '/182-BhOmDt7gYtJ.jpg',
  'terasa-zima': O + '/IMG_9840.jpg',
  'hriste-detske': IG + '/055-CAPoSIHlMme.jpg',
  // restaurace
  'restaurace-krb': W + '/056-12_dsc-5086-web.jpg',
  'restaurace-sal': W + '/063-12_hotel-a-restauarace-krusnohorsky-dvur-restaurace.jpg',
  'restaurace-okna': W + '/067-IMG_7405.jpeg',
  'restaurace-bar': W + '/068-IMG_7409.jpeg',
  'restaurace-krb-detail': IG + '/054-CAmxBvZlhWR.jpg',
  'restaurace-krb-vecer': IG + '/162-BpyyQsBgAgO.jpg',
  'restaurace-vyhled': IG + '/035-CPK2ugblJ2V.jpg',
  'restaurace-tabule': IG + '/022-C0gRE79olD0.jpg',
  // jídlo
  'jidlo-talir': W + '/047-IMG_7199.jpeg',
  'jidlo-maso': W + '/048-IMG_7200.jpeg',
  'jidlo-kanapky': W + '/049-IMG_3400.jpeg',
  'jidlo-gril': W + '/052-IMG_5191.jpeg',
  'jidlo-raut': W + '/054-12_147.jpg',
  'jidlo-sunka': W + '/055-12_148.jpg',
  'jidlo-dorty': W + '/057-12_118copy.jpg',
  'jidlo-salaty': W + '/109-img_5362_1.jpg',
  'jidlo-ovoce': W + '/111-img_5367_1.jpg',
  'jidlo-syry': W + '/113-img_5394_1.jpg',
  'jidlo-steak': W + '/115-img_5725_1.jpg',
  'jidlo-kure': O + '/13220823_1563868490578285_4117914480448294301_n.jpg',
  'jidlo-mini-burgery': O + '/IMG_6995.JPG',
  'jidlo-sele': O + '/IMG_5382.jpeg',
  // svatby a akce – v restauraci
  'svatba-sal': W + '/025-IMG_0982.JPG',
  'svatba-stoly': W + '/020-IMG_0981.JPG',
  'svatba-stoly-2': W + '/021-IMG_0980.JPG',
  'svatba-kulaty-stul': W + '/016-IMG_0976.JPG',
  'svatba-kulaty-stul-2': W + '/018-IMG_0977-2.JPG',
  'svatba-tabule': W + '/013-IMG_0973.JPG',
  'svatba-hlavni-stul': W + '/014-IMG_0972.JPG',
  'svatba-dlouhy-stul': W + '/034-IMG_1001.JPG',
  'svatba-vecer': W + '/036-IMG_0999.JPG',
  'svatba-svetla': W + '/041-IMG_0991.JPG',
  'svatba-modra': W + '/045-IMG_1006.JPG',
  'svatba-zelena': W + '/040-IMG_0994.JPG',
  'svatba-detail': W + '/023-IMG_0989.JPG',
  'svatba-kvetiny': W + '/024-IMG_0988.JPG',
  // svatby a akce – venku
  'obrad-louka': W + '/012-IMG_0971.JPG',
  'obrad-oblouk': W + '/022-IMG_0978.JPG',
  'obrad-zidle': W + '/030-IMG_0985.JPG',
  'obrad-ulicka': W + '/031-IMG_0984.JPG',
  'obrad-kruh': W + '/035-IMG_1003.JPG',
  'obrad-sloupy': W + '/027-IMG_0983.JPG',
  'obrad-zlaty-oblouk': W + '/038-IMG_1005.JPG',
  'obrad-bila-brana': W + '/046-IMG_0993.JPG',
  'piknik-louka': W + '/017-IMG_0974.JPG',
  'piknik-kuze': W + '/039-IMG_0996.JPG',
  'piknik-lehatka': W + '/043-IMG_0995.JPG',
  // konferenční sál
  'salonek': W + '/100-konferencka1_1.jpg',
  'salonek-stul': W + '/101-snimek_obrazovky_2016-02-15_14.04.48.png',
  'salonek-raut': W + '/099-konferencka_1.png',
  // sauna
  'sauna': O + '/sauna.jpg',
  'sauna-lavice': W + '/102-sauna2.jpg',
  'sauna-kamna': W + '/103-sauna5.jpg',
  'sauna-zima': W + '/105-sauna6.jpg',
  'sauna-snih': W + '/104-sauna3.jpg',
  // pokoje – standardní
  'pokoj-standard': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_1_.jpg',
  'pokoj-standard-2': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_2_loznice_1.jpg',
  'pokoj-standard-3': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_2.jpg',
  'pokoj-standard-4': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_nadstandartni_pokoj_1.jpg',
  'pokoj-standard-koupelna': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_koupelna_nadstandardni_pokoj_1_1.jpg',
  'pokoj-standard-koupelna-2': P + '/pokoj-36/hotel_a_restaurace_krusnohorsky_dvur_-_koupelna_nadstandartni_pokoj.jpg',
  // pokoje – komfortní
  'pokoj-komfort': P + '/pokoj-37/img_3003_1.jpg',
  'pokoj-komfort-2': P + '/pokoj-37/img_3005_1.jpg',
  'pokoj-komfort-3': P + '/pokoj-37/img_3004_1.jpg',
  'pokoj-komfort-4': P + '/pokoj-37/hotel_a_restaurace_krusnohorsky_dvur_-_komfortni_pokoj_-_loznice.jpg',
  'pokoj-komfort-5': P + '/pokoj-37/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_6.jpg',
  'pokoj-komfort-6': P + '/pokoj-37/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_6_romanticky_balicek_1.jpg',
  'pokoj-komfort-koupelna': P + '/pokoj-37/img_3006_1.jpg',
  'pokoj-komfort-koupelna-2': P + '/pokoj-37/hotel_a_restaurace_krusnohorsky_dvur_-_komfortni_pokoj_-_koupelna_1_1.jpg',
  // pokoje – exklusivní
  'pokoj-exklusiv': P + '/pokoj-56/img_3010_1.jpg',
  'pokoj-exklusiv-2': P + '/pokoj-56/img_3011_1.jpg',
  'pokoj-exklusiv-3': P + '/pokoj-56/img_3012_1.jpg',
  'pokoj-exklusiv-4': P + '/pokoj-56/img_3013_1.jpg',
  'pokoj-exklusiv-vyhled': P + '/pokoj-56/krusnohorsky_dvur_pokoj_vyhled.jpg',
  'pokoj-exklusiv-vyhled-2': P + '/pokoj-56/pokoj_4_exklusiv_vyhled_z_okna.jpg',
  'pokoj-exklusiv-5': P + '/pokoj-56/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_5_exklusiv_1.jpg',
  'pokoj-exklusiv-romanticky': P + '/pokoj-56/hotel_a_restaurace_krusnohorsky_dvur_-_romanticky_balicek.jpg',
  'pokoj-exklusiv-koupelna': P + '/pokoj-56/hotel_a_restaurace_krusnohorsky_dvur_-_pokoj_5_koupelna_1.jpg',
  'pokoj-exklusiv-koupelna-2': P + '/pokoj-56/pokoj_4_exklusiv_koupelna_1.jpg',
  // pokoje – rodinný
  'pokoj-rodinny': P + '/pokoj-57/hotel_a_restaurace_krusnohorsky_dvur_-_rodinny_pokoj_2_1.jpg',
  'pokoj-rodinny-2': P + '/pokoj-57/hotel_a_restaurace_krusnohorsky_dvur_-_rodinny_pokoj__1.jpg',
  'pokoj-rodinny-3': P + '/pokoj-57/krusnohorsky_dvur_rodinny_pokoj.jpg',
  'pokoj-rodinny-koupelna': P + '/pokoj-57/hotel_a_restauarace_krusnohorsky_dvur_-_koupelna_rodinny_pokoj_1.jpg',
  'pokoj-rodinny-koupelna-2': P + '/pokoj-57/hotel_a_restauarace_krusnohorsky_dvur_-_rodinny_pokoj_-_pohled_do_koupelny_1.jpg',
  // okolí – léto
  'golf-letecky': IG + '/210-BVCcYg1Dx8p.jpg',
  'golf-rano': IG + '/095-B33p-LIlTAi.jpg',
  'golf-green': IG + '/069-B9tx6crl3ss.jpg',
  'golf-zavlaha': IG + '/104-ByRySxCoyvk.jpg',
  'golf-zapad': IG + '/031-CWJFUw9ImVO.jpg',
  'leto-milesovka': IG + '/085-B6NzQ0gF9Qk.jpg',
  'leto-kopce': IG + '/094-B4CB84HFDo3.jpg',
  'leto-potok': IG + '/097-B1y5iLhoJKR.jpg',
  'leto-les': IG + '/093-B4XgnMfF9_Q.jpg',
  'leto-rybnik': IG + '/178-Bhq8gD4gu_5.jpg',
  'leto-louka': IG + '/207-BagSh4iAwyP.jpg',
  'leto-cesta': IG + '/257-BDiY5_ZC9So.jpg',
  // okolí – zima
  'bezky-hotel': IG + '/015-DExOc59osOd.jpg',
  'bezky-stopa': IG + '/124-BtGyKcRFufl.jpg',
  'bezky-les': IG + '/122-BtS87YLlM4w.jpg',
  'bezky-planina': IG + '/118-BtfgVItlJk6.jpg',
  'bezky-odpocivadlo': IG + '/142-BrfLs26AglZ.jpg',
  'zima-stromy': IG + '/016-DDjeSWkOWgg.jpg',
  'zima-zapad': IG + '/113-BuMRxdRFF9D.jpg',
  'zima-obzor': IG + '/119-BtfaN24Fi3s.jpg',
  'zima-letecky': IG + '/189-Be8k3eeAtEE.jpg',
  'zima-modra-hodinka': O + '/151472812_2519195541717531_2153977590026230708_n.jpg',
  'zima-cesta': IG + '/192-Be2txVAgZqW.jpg',
  // aktuality
  'lanovy-park': O + '/2.jpg',
};

const OUT = path.join(ROOT, 'assets/img');
const THUMBS = path.join(OUT, 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const run = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
const size = f => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f])
  .toString().trim().split(',').map(Number);
// zmenšit jen větší fotky (nikdy nezvětšovat), sudé rozměry
const fit = max => `scale='if(gt(iw,ih),min(${max},iw),-2)':'if(gt(iw,ih),-2,min(${max},ih))':flags=lanczos,format=yuvj420p`;

const sizes = {};
let n = 0;
for (const [name, src] of Object.entries(PHOTOS)) {
  if (!fs.existsSync(src)) { console.warn('⚠ chybí podklad:', name, src); continue; }
  const full = path.join(OUT, name + '.jpg');
  const thumb = path.join(THUMBS, name + '.jpg');
  run(['-i', src, '-map_metadata', '-1', '-vf', fit(1920), '-q:v', '4', full]);
  run(['-i', src, '-map_metadata', '-1', '-vf', fit(800), '-q:v', '5', thumb]);
  sizes[name] = size(full);
  n++;
}
fs.writeFileSync(path.join(__dirname, 'fotky.json'), JSON.stringify(sizes, null, 0).replace(/\],/g, '],\n') + '\n');
console.log(`Hotovo: ${n} fotek (+ náhledy) v assets/img`);
