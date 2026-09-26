// Each route keeps its original handler and authorization checks. The route
// selector comes from the legacy URL rewrite, never from the request body.
const routes = {
  'notify-telegram': () => import('../server/_route-notify-telegram.js'),
  'telegram-webhook': () => import('../server/_route-telegram-webhook.js'),
}

export default async function handler(req, res) {
  const route = req.query?.route
  if (typeof route !== 'string' || !Object.hasOwn(routes, route)) {
    return res.status(404).json({ error: 'Route not found' })
  }
  const { default: run } = await routes[route]()
  return run(req, res)
}
