import { Suspense } from 'react'

import UpdatePrompt from './UpdatePrompt'

const Page = () => {
    return (
        <Suspense fallback={null}>
            <UpdatePrompt />
        </Suspense>
    )
}

export default Page
