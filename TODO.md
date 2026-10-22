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

## Distribution GitHub et mises à jour
- [x] Publier les premières APK de test via GitHub Releases (v0.1.0 et v0.2.0).
- [x] Fixer une numérotation Android (versionCode 3, versionName 0.4.0, avec versions npm alignées).
- [x] Publier v0.3.0 après compilation locale.
- [ ] Publier v0.4.0 avec vérification des mises à jour après compilation locale.
- [ ] Utiliser une clé de signature de release stable pour la distribution publique (ne jamais la committer).
- [x] Ajouter des tests du comparateur et du filtrage des Releases GitHub, exécutés par GitHub Actions.
- [x] Préparer un script PowerShell de compilation Android fixant automatiquement Java 21.
- [ ] Tester manuellement l'alerte de mise à jour lors de la publication de v0.5.0 et l'installation par-dessus v0.4.0.
- [x] Ajouter un contrôle de nouvelle version via l'API GitHub Releases, y compris les pre-releases pendant les tests.
- [x] Comparer la version intégrée à l'APK à la version publiée ; afficher une invitation discrète, pas d'installation silencieuse.
- [x] Proposer le lien GitHub Release pour télécharger l'APK et laisser l'utilisateur approuver l'installation (test sur téléphone restant à réaliser).
- [x] Prévoir un choix pour désactiver la vérification en ligne ; garder le pilotage IR fonctionnel hors ligne.
