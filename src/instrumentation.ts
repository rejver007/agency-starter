/**
 * Next.js instrumentation hook — runs once when the server starts.
 * Automatically applies any pending Payload database migrations before
 * the app handles its first request.
 *
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only run on the Node.js server, not in the Edge runtime or during builds
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')

    const payload = await getPayload({ config })
    await payload.db.migrate()

    payload.logger.info('Database migrations complete.')
  } catch (err: unknown) {
    // Log but don't crash the server — a failed migration is better diagnosed
    // in the logs than a hard crash that hides the real error message
    console.error('[instrumentation] Migration error:', err)
  }
}
