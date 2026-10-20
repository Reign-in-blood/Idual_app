# TODO

## MVP Android / IR
- [x] Récupérer les 26 commandes iDual RC II éprouvées dans irplus.
- [x] Initialiser structure Vite/TypeScript + Capacitor.
- [x] Préparer interface tactile et données IR.
- [x] Préparer squelette du pont natif Android ConsumerIrManager.
- [ ] Exécuter `npm install` sur une machine avec accès au registre npm.
- [ ] Exécuter `npx cap add android`, installer le pont natif, vérifier AndroidManifest.
- [ ] Compiler l'APK sur Android Studio.
- [ ] Vérifier sur le téléphone l'accès à ConsumerIrManager et la porteuse.
- [ ] Tester ON / OFF; adapter si nécessaire l'ordre de bits NEC et la temporisation.
- [ ] Tester les 26 commandes, appuis longs et répétition luminosité.
- [ ] Comparer chaque position/bouton de l'UI à la télécommande physique.
- [ ] Ajouter icônes PWA propres, splash-screen et mode hors ligne web si utile.
- [ ] Ajouter tests automatisés pour trames IR.

## Plus tard : ESP32 / domotique (hors périmètre MVP)
- [ ] Transmetteur IR multi-LED ESP32 à couverture large.
- [ ] Recevoir commandes via Wi-Fi / interface web.
- [ ] Scénarios et allumage/extinction programmés (horloge/NTP).
- [ ] Gestion de plusieurs pièces et émetteurs IR.
- [ ] Évaluer entrée directe sur récepteur IR de la lampe uniquement après audit sécurité (secteur).
