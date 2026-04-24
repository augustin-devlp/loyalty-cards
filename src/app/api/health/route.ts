import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Endpoint trivial pour vérifier la version déployée.
 * Retourne le SHA du build courant si Vercel l'expose, sinon "unknown".
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    deploy_sha: process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown',
    deploy_ref: process.env.VERCEL_GIT_COMMIT_REF ?? 'unknown',
    upsell_phase: 12,
    rfm_phase: 11,
  });
}
