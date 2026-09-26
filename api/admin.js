// Each route keeps its original handler and authorization checks. The route
// selector comes from the legacy URL rewrite, never from the request body.
const routes = {
  'admin-login': () => import('../server/_route-admin-login.js'),
  'admin-settings': () => import('../server/_route-admin-settings.js'),
  'admin-invitations': () => import('../server/_route-admin-invitations.js'),
}

export default async function handler(req, res) {
  const route = req.query?.route
  if (typeof route !== 'string' || !Object.hasOwn(routes, route)) {
    return res.status(404).json({ error: 'Route not found' })
  }
  const { default: run } = await routes[route]()
  return run(req, res)
}
