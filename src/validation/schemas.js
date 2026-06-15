import * as Yup from 'yup';

// Règles de validation pour l'écran de connexion
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Adresse email invalide')
    .required("L'email est requis"),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});

// Règles de validation pour l'écran d'inscription
export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .required("Le nom d'utilisateur est requis"),
  city: Yup.string().required('La ville de résidence est requise'),
  email: Yup.string()
    .email('Adresse email invalide')
    .required("L'email est requis"),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});
