import mongoose from 'mongoose'

const CONNECTION_TIMEOUT_MS = 5000

let connectionPromise = null

const failConnection = (detail) => {
    console.error('MongoDB connection failed:', detail)
    const error = new Error('Database connection failed')
    error.code = 'DB_CONNECTION_FAILED'
    return error
}

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)
    // Fail queries immediately when there is no open connection, instead of
    // buffering them until the serverless function times out.
    mongoose.set('bufferCommands', false)

    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is already connected')
        return
    }

    if (!process.env.MONGODB_URI) {
        throw failConnection('MONGODB_URI is not set')
    }

    if (!connectionPromise) {
        connectionPromise = (async () => {
            const connectAttempt = mongoose.connect(process.env.MONGODB_URI, {
                dbName: 'share_prompt',
                serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS,
                connectTimeoutMS: CONNECTION_TIMEOUT_MS,
            })
            let timer

            try {
                await new Promise((resolve, reject) => {
                    timer = setTimeout(() => {
                        reject(failConnection(`timed out after ${CONNECTION_TIMEOUT_MS}ms`))
                    }, CONNECTION_TIMEOUT_MS)
                    connectAttempt.then(resolve, reject)
                })
                console.log('MongoDB connected')
            } catch (error) {
                connectionPromise = null
                connectAttempt.catch(() => {})
                mongoose.disconnect().catch(() => {})
                if (error?.code === 'DB_CONNECTION_FAILED') {
                    throw error
                }
                throw failConnection(error?.message || 'Unknown connection error')
            } finally {
                clearTimeout(timer)
            }
        })()
    }

    return connectionPromise
}

export const dbErrorResponse = (error, fallbackMessage) => {
    console.error(fallbackMessage, error?.message || error)
    const message = error?.code === 'DB_CONNECTION_FAILED'
        ? 'Database connection failed'
        : fallbackMessage

    return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    })
}
