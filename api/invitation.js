// Each route keeps its original handler and authorization checks. The route
// selector comes from the legacy URL rewrite, never from the request body.
const routes = {
  'create-invitation': () => import('../server/_route-create-invitation.js'),
  'update-invitation': () => import('../server/_route-update-invitation.js'),
  'delete-invitation': () => import('../server/_route-delete-invitation.js'),
  'verify-key': () => import('../server/_route-verify-key.js'),
}

export default async function handler(req, res) {
  const route = req.query?.route
  if (typeof route !== 'string' || !Object.hasOwn(routes, route)) {
    return res.status(404).json({ error: 'Route not found' })
  }
  const { default: run } = await routes[route]()
  return run(req, res)
}
