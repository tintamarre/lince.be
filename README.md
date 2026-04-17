# Content of Lince.be

## Sources des événements

Les événements peuvent maintenant être répartis entre plusieurs fichiers Markdown :

- `src/data/events.md`
- `src/data/events/**/*.md`

Tous les fichiers sont fusionnés au build.

## Format strict

Chaque événement doit commencer par un titre au format :

```md
## AAAA-MM-JJ | Titre
```

Métadonnées supportées, avant la description :

- `- **Lieu:** ...`
- `- **Horaire:** HH:MM - HH:MM`
- `- **Catégorie:** ...`
- `- **Date fin:** AAAA-MM-JJ`
- `- **Documents:** [Label](URL), [Autre](URL)`

Le build échoue si le format est invalide, si un champ est inconnu ou dupliqué, si une date/heure est invalide, ou si deux événements produisent le même identifiant.
