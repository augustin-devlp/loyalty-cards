# Configuration Requise - Admin Buttons

## IMPORTANT: Clé Manquante ⚠️

Pour que les boutons "Générer un code" et "Activer manuellement" fonctionnent, vous DEVEZ ajouter la clé de service Supabase.

---

## Comment obtenir SUPABASE_SERVICE_ROLE_KEY

### Étape 1: Accéder au dashboard Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez le projet `curduiiydfpwiwbimypu` (visible dans `.env.local`)

### Étape 2: Récupérer la clé
1. Cliquez sur **Settings** (icône de rouage)
2. Allez dans **API** dans le menu de gauche
3. Vous verrez plusieurs clés:
   - `Project URL` (déjà dans `.env.local`)
   - `anon (public)` key (déjà dans `.env.local`)
   - `service_role` secret ← **C'EST CELLE-CI**
4. Copiez la clé entière (elle commence par `eyJhbGciOiJIUzI1NiI...`)

### Étape 3: Ajouter au fichier .env.local
Ouvrez `.env.local` et remplacez:
```
SUPABASE_SERVICE_ROLE_KEY=
```

Par:
```
SUPABASE_SERVICE_ROLE_KEY=<la_clé_que_vous_avez_copiée>
```

**Exemple (fictif):**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cmR1aWl5ZGZwd2l3YmlteXB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU5NjU4NSwiZXhwIjoyMDg5MTcyNTg1fQ.xxx...
```

---

## Configuration pour Vercel (Production)

Si vous déployez sur Vercel, vous DEVEZ aussi ajouter la clé là-bas:

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet `loyalty-cards`
3. Cliquez sur **Settings** → **Environment Variables**
4. Créez une nouvelle variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** La même clé que ci-dessus
5. Sélectionnez **Production** comme environnement
6. Cliquez sur **Save**
7. Redéployez votre application (ou attendez que le prochain déploiement automatique se fasse)

---

## Test Local

Après avoir ajouté la clé:

1. Arrêtez le serveur de développement (`Ctrl+C`)
2. Redémarrez-le (`npm run dev`)
3. Allez sur `http://localhost:3000/admin`
4. Essayez les boutons:
   - **"🔑 Générer code"** → Doit afficher un code 4 chiffres
   - **"✅ Activer manuellement"** → Doit mettre à jour le statut du commerçant

---

## Structure de Sécurité

Cette clé permet aux routes API d':
- Bypassez les règles RLS (Row Level Security) de Supabase
- Modifier les données `businesses` directement
- Être utilisée UNIQUEMENT côté serveur (Next.js API routes)

**⚠️ IMPORTANT:**
- Ne partagez JAMAIS cette clé publiquement
- Ne la mettez JAMAIS dans le code source ou Git
- Elle est prévue pour les **environment variables seulement**

---

## Routes API Concernées

Deux routes API utilisent cette clé:

### 1. POST `/api/admin/generate-code`
**But:** Générer un code d'activation pour un commerçant

**Request:**
```json
{
  "businessId": "uuid-du-commerce"
}
```

**Response (success):**
```json
{
  "code": "1234"
}
```

**Response (error):**
```json
{
  "error": "Description de l'erreur"
}
```

### 2. POST `/api/admin/activate`
**But:** Activer manuellement un commerçant

**Request:**
```json
{
  "businessId": "uuid-du-commerce"
}
```

**Response (success):**
```json
{
  "ok": true
}
```

**Response (error):**
```json
{
  "error": "Description de l'erreur"
}
```

---

## Dépannage

### Erreur: "SUPABASE_SERVICE_ROLE_KEY manquant"
→ La clé n'est pas définie dans `.env.local`
→ Solution: Suivez les étapes ci-dessus

### Erreur: "Non autorisé" (403)
→ Votre email n'est pas dans `ADMIN_EMAILS`
→ Les admins actuels sont:
  - `augustin-domenget@stampify.ch`
  - `augustindomenget@gmail.com`
→ Solution: Connectez-vous avec un de ces emails

### Erreur: "Commerce introuvable" (404)
→ Le `businessId` n'existe pas
→ Solution: Vérifiez l'ID du commerce

### Erreur: "Body invalide" (400)
→ La requête JSON est mal formée
→ Solution: Vérifiez que `businessId` est défini

---

## Vérification Post-Configuration

Pour vérifier que tout fonctionne:

```bash
# 1. Vérifier que la clé est chargée
cd /sessions/elegant-funny-newton/mnt/augus--loyalty-cards
echo "SUPABASE_SERVICE_ROLE_KEY est défini: $([ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && echo 'NON' || echo 'OUI')"

# 2. Compiler TypeScript
npx tsc --noEmit

# 3. Lancer le serveur
npm run dev

# 4. Ouvrir le navigateur
# http://localhost:3000/admin
```

---

## Résumé

✅ **Code:** Tous les bugs ont été corrigés
❌ **Configuration:** La clé manquante doit être ajoutée manuellement
🚀 **Prêt:** Une fois la clé ajoutée, tout est fonctionnel
