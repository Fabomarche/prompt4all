'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Form from '@components/Form'

const CreatePrompt = () => {
    const router = useRouter()
    const { data: session } = useSession()

    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    })

    const createPrompt = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrorMessage('')

        try {
            const response = await fetch('/api/prompt/new', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: post.prompt,
                    userId: session?.user.id,
                    tag: post.tag
                })
            })
            if (response.ok) {
                router.push('/')
                return
            }

            let data = null
            try {
                data = await response.json()
            } catch {
                data = null
            }
            setErrorMessage(typeof data?.error === 'string' ? data.error : 'Could not save the prompt')
        } catch (error) {
            console.error('Failed to create prompt:', error.message)
            setErrorMessage('Could not save the prompt')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form
            type="Create"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={createPrompt}
            error={errorMessage}
        />
    )
}

export default CreatePrompt