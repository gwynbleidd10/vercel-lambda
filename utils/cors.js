import Cors from 'cors'

const cors = initMiddleware(
  Cors({
    "origin": "*",
  })
)

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

module.exports = {
  cors
}