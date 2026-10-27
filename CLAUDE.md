# CLAUDE.md

## Tokens et secrets

Avant chaque commit ou push, masquer tous les tokens présents dans les fichiers, en particulier dans les logs de challenge (`s01eXX-log.md`) : champs `"token"` et URLs `?token=` au format `v1.eyJ…`.

- Remplacer par `v1.REDACTED` : `sed -i '' -E 's/v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/v1.REDACTED/g' <fichier>`
- Vérifier qu'il n'en reste aucun : `git grep -n 'eyJ'` doit être vide.
- Masquer avant le commit, pour que l'historique ne contienne jamais de token, même expiré.
