# Limites et sécurité

- Application sans transmission réseau requise : aucune collecte de données prévue.
- Les commandes IR sont unidirectionnelles : on ne peut pas détecter à distance l'état réel des lampes.
- PWA/navigateur : aperçu UI seulement, aucune émission IR via le navigateur Android.
- L'APK nécessite un téléphone avec émetteur IR exposé à `ConsumerIrManager`.
- Différentes références iDual peuvent employer d'autres codes. Le profil conservé a été testé par le propriétaire dans irplus.
- Préserver la source `docs/ir/idual-rc-ii.irplus.xml` comme référence lors de corrections natives.
- Une lampe secteur démontée peut contenir des tensions mortelles : pas de modification du récepteur interne dans la phase actuelle.
