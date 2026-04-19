export type Language = "fr" | "en";

// Dictionnaire centralisé de toutes les traductions de l'app
export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "Dashboard": "Dashboard",
    "Candidats": "Candidats",
    "Déconnexion": "Déconnexion",
    "Mode sombre": "Mode sombre",
    "Mode clair": "Mode clair",
    "Déconnexion réussie": "Déconnexion réussie",

    // Dashboard
    "Élection Miss & Mister": "Élection Miss & Mister",
    "Événement :": "Événement :",
    "Journée culturelle": "Journée culturelle",
    "Lieu :": "Lieu :",
    "Suivi en temps réel des votes et des performances des candidats 👑": "Suivi en temps réel des votes et des performances des candidats 👑",
    "Candidats inscrits": "Candidats inscrits",
    "Votes exprimés": "Votes exprimés",
    "👑 Top Miss": "👑 Top Miss",
    "👑 Top Mister": "👑 Top Mister",
    "votes": "votes",

    // Candidates list
    "Candidats 👑": "Candidats 👑",
    "+ Ajouter": "+ Ajouter",
    "Photo": "Photo",
    "Nom": "Nom",
    "Catégorie": "Catégorie",
    "Classe": "Classe",
    "Votes": "Votes",
    "Actions": "Actions",
    "Modifier": "Modifier",
    "Supprimer": "Supprimer",
    "Aucun candidat enregistré.": "Aucun candidat enregistré.",
    "⚠️ Supprimer ce candidat ?": "⚠️ Delete this candidate?",

    // Create candidate
    "✨ Ajouter un candidat": "✨ Ajouter un candidat",
    "Nom du candidat": "Nom du candidat",
    "Choisir catégorie": "Choisir catégorie",
    "Choisir classe": "Choisir classe",
    "Ajouter le candidat": "Ajouter le candidat",
    "Remplis tous les champs": "Remplis tous les champs",
    "Ce candidat existe déjà": "Ce candidat existe déjà",
    "Candidat ajouté 🎉": "Candidat ajouté 🎉",

    // Edit candidate
    "✏️ Modifier candidat": "✏️ Modifier candidat",
    "Enregistrer les modifications": "Enregistrer les modifications",
    "Candidat mis à jour ✨": "Candidat mis à jour ✨",
    "Chargement...": "Chargement...",

    // Login
    "SUP'PTIC ADMIN": "SUP'PTIC ADMIN",
    "Élection Miss & Master 👑": "Élection Miss & Master 👑",
    "Email": "Email",
    "Mot de passe": "Mot de passe",
    "Connexion...": "Connexion...",
    "Se connecter": "Se connecter",
    "Accès réservé à l'administration": "Accès réservé à l'administration",
    "Connexion réussie 👑": "Connexion réussie 👑",

    // Protected route / layout
    "Vérification de la session...": "Vérification de la session...",
    "⏱ Session expirée par inactivité. Veuillez vous reconnecter.": "⏱ Session expirée par inactivité. Veuillez vous reconnecter.",
    "⏱ Session expirée. Veuillez vous reconnecter.": "⏱ Session expirée. Veuillez vous reconnecter.",
  },

  en: {
    // Navigation
    "Dashboard": "Dashboard",
    "Candidats": "Candidates",
    "Déconnexion": "Log out",
    "Mode sombre": "Dark mode",
    "Mode clair": "Light mode",
    "Déconnexion réussie": "Logged out successfully",

    // Dashboard
    "Élection Miss & Mister": "Miss & Mister Election",
    "Événement :": "Event:",
    "Journée culturelle": "Cultural Day",
    "Lieu :": "Venue:",
    "Suivi en temps réel des votes et des performances des candidats 👑": "Real-time tracking of votes and candidate performance 👑",
    "Candidats inscrits": "Registered candidates",
    "Votes exprimés": "Votes cast",
    "👑 Top Miss": "👑 Top Miss",
    "👑 Top Mister": "👑 Top Mister",
    "votes": "votes",

    // Candidates list
    "Candidats 👑": "Candidates 👑",
    "+ Ajouter": "+ Add",
    "Photo": "Photo",
    "Nom": "Name",
    "Catégorie": "Category",
    "Classe": "Class",
    "Votes": "Votes",
    "Actions": "Actions",
    "Modifier": "Edit",
    "Supprimer": "Delete",
    "Aucun candidat enregistré.": "No candidates registered.",
    "⚠️ Supprimer ce candidat ?": "⚠️ Delete this candidate?",

    // Create candidate
    "✨ Ajouter un candidat": "✨ Add a candidate",
    "Nom du candidat": "Candidate name",
    "Choisir catégorie": "Choose category",
    "Choisir classe": "Choose class",
    "Ajouter le candidat": "Add candidate",
    "Remplis tous les champs": "Please fill in all fields",
    "Ce candidat existe déjà": "This candidate already exists",
    "Candidat ajouté 🎉": "Candidate added 🎉",

    // Edit candidate
    "✏️ Modifier candidat": "✏️ Edit candidate",
    "Enregistrer les modifications": "Save changes",
    "Candidat mis à jour ✨": "Candidate updated ✨",
    "Chargement...": "Loading...",

    // Login
    "SUP'PTIC ADMIN": "SUP'PTIC ADMIN",
    "Élection Miss & Master 👑": "Miss & Master Election 👑",
    "Email": "Email",
    "Mot de passe": "Password",
    "Connexion...": "Signing in...",
    "Se connecter": "Sign in",
    "Accès réservé à l'administration": "Restricted to administrators",
    "Connexion réussie 👑": "Successfully signed in 👑",

    // Protected route / layout
    "Vérification de la session...": "Checking session...",
    "⏱ Session expirée par inactivité. Veuillez vous reconnecter.": "⏱ Session expired due to inactivity. Please sign in again.",
    "⏱ Session expirée. Veuillez vous reconnecter.": "⏱ Session expired. Please sign in again.",
  },
};