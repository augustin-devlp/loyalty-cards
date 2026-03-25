# Comparaison Avant/Après - Code Changes

## Route API: generate-code

### AVANT (Problématique)
```typescript
export async function POST(req: Request) {
  // 1. Vérifier la session admin (anon client, avec RLS)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  // ❌ Pas de try-catch pour req.json() - peut lever exception
  const body = (await req.json()) as { businessId?: string };
  const { businessId } = body;

  if (!businessId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));

  // ❌ Pas de try-catch global - exception non capturée
  const adminDb = createAdminClient();

  const { data: updated, error } = await adminDb
    .from("businesses")
    .update({ activation_code: code })
    .eq("id", businessId)
    .select("id, business_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  }

  return NextResponse.json({ code });
  // ❌ Exception ici n'est pas capturée - écrase la réponse HTTP
}
```

### APRÈS (Corrigé)
```typescript
export async function POST(req: Request) {
  try {  // ✅ Try-catch global ajouté
    // 1. Vérifier la session admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log("[generate-code] user email:", user?.email ?? "non connecté");

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      console.warn("[generate-code] Accès refusé pour:", user?.email);
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // 2. Parser le body
    let body: { businessId?: string };
    try {  // ✅ Try-catch séparé pour req.json()
      body = await req.json();
    } catch {
      console.error("[generate-code] Body JSON invalide");
      return NextResponse.json({ error: "Body invalide" }, { status: 400 });
    }

    const { businessId } = body;
    console.log("[generate-code] businessId reçu:", businessId);

    if (!businessId) {
      console.error("[generate-code] businessId manquant");
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 3. Générer code 4 chiffres
    const code = String(Math.floor(1000 + Math.random() * 9000));
    console.log(`[generate-code] code généré: ${code} pour businessId: ${businessId}`);

    // 4. Update via service role key (bypass RLS)
    const adminDb = createAdminClient();

    const { data: updated, error } = await adminDb
      .from("businesses")
      .update({ activation_code: code })
      .eq("id", businessId)
      .select("id, business_name");

    if (error) {
      console.error("[generate-code] Erreur Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      console.error("[generate-code] Aucune ligne mise à jour");
      return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
    }

    console.log(`[generate-code] ✅ Code ${code} sauvegardé`);
    return NextResponse.json({ code });
  } catch (err) {  // ✅ Catch global pour capturer TOUTES les exceptions
    const msg = err instanceof Error ? err.message : "Erreur interne";
    console.error("[generate-code] Exception non gérée:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

---

## Composant Client: AdminPendingActions

### AVANT (Problématique)
```typescript
const generateCode = async (businessId: string) => {
  setLoadingGen(businessId);
  try {
    const res = await fetch("/api/admin/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    // ❌ Peut lever exception si réponse non-JSON
    const data = await res.json();
    
    // ❌ Pas de fallback si data.error est undefined
    if (!res.ok) throw new Error(data.error);
    
    // ❌ Pas de vérification si data.code existe
    setCodes((prev) => ({ ...prev, [businessId]: data.code }));
    router.refresh();
  } catch (err) {
    // ❌ Message d'erreur générique
    alert(err instanceof Error ? err.message : "Erreur");
  } finally {
    setLoadingGen(null);
  }
};
```

### APRÈS (Corrigé)
```typescript
// ✅ Fonction utilitaire pour parser JSON de manière sécurisée
const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || `HTTP ${res.status}` };
  }
};

const generateCode = async (businessId: string) => {
  setLoadingGen(businessId);
  try {
    const res = await fetch("/api/admin/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    // ✅ Utilise safeJson() pour éviter les exceptions
    const data = await safeJson(res);
    
    // ✅ Fallback sur le status HTTP si pas d'erreur
    if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);
    
    // ✅ Vérification explicite de la présence du code
    if (!data.code) throw new Error("Aucun code retourné par le serveur");
    
    setCodes((prev) => ({ ...prev, [businessId]: data.code }));
    router.refresh();
  } catch (err) {
    // ✅ Message plus descriptif
    alert(err instanceof Error ? err.message : "Erreur inconnue");
  } finally {
    setLoadingGen(null);
  }
};
```

---

## Configuration: .env.local

### AVANT (Manquant)
```env
NEXT_PUBLIC_SUPABASE_URL=https://curduiiydfpwiwbimypu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ❌ SUPABASE_SERVICE_ROLE_KEY manquant!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### APRÈS (Ajouté)
```env
NEXT_PUBLIC_SUPABASE_URL=https://curduiiydfpwiwbimypu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=  # ✅ Ajouté (à remplir avec vraie clé)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Résumé des Améliorations

| Aspect | Avant | Après |
|--------|-------|-------|
| Try-catch global | ❌ Non | ✅ Oui |
| Try-catch req.json() | ❌ Non | ✅ Oui |
| Parsing JSON sécurisé | ❌ Non | ✅ Oui (safeJson) |
| Vérification code | ❌ Non | ✅ Oui |
| Logs de debug | ❌ Minimal | ✅ Complets |
| Gestion erreurs | ❌ Incomplète | ✅ Exhaustive |
| SUPABASE_SERVICE_ROLE_KEY | ❌ Manquant | ✅ Ajouté |

---

## Points Clés des Corrections

1. **Try-catch global** → Toute exception est capturée et retournée en JSON
2. **Try-catch séparé pour req.json()** → Gère les mauvais format de body
3. **safeJson() côté client** → Évite les exceptions lors du parsing
4. **Vérification explicite** → S'assure que les données attendues sont présentes
5. **Logs améliorés** → Facilite le debugging en production
6. **Variable d'environnement ajoutée** → Permet à createAdminClient() de fonctionner

