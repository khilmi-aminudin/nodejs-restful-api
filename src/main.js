import { web } from "./application/web.js"
import { logger } from "./application/logging.js"

const port = process.env.APP_PORT || 30001
web.listen(port, () => {
    logger.info(`app is running on port ${port}`)
    console.info(`app is running on port ${port}`)
})