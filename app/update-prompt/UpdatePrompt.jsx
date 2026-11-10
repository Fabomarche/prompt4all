'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@components/Form'

const UpdatePrompt = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const promptId = searchParams.get('id')


    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    })

    useEffect(() => {
        const getPromptDetails = async () => {
            try {
                const response = await fetch(`/api/prompt/${promptId}`)
                let data = null
                try {
                    data = await response.json()
                } catch {
                    data = null
                }

                if (!response.ok || typeof data?.prompt !== 'string') {
                    setErrorMessage(typeof data?.error === 'string' ? data.error : 'Could not load this prompt')
                    return
                }

                setErrorMessage('')
                setPost({
                    prompt: data.prompt,
                    tag: data.tag
                })
            } catch (error) {
                console.error('Failed to load prompt:', error.message)
                setErrorMessage('Could not load this prompt')
            }
        }
        if (promptId) getPromptDetails()
    }, [promptId])

    const updatePrompt = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrorMessage('')

        if (!promptId) {
            setSubmitting(false)
            setErrorMessage('Prompt ID not found')
            return
        }

        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
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
            console.error('Failed to update prompt:', error.message)
            setErrorMessage('Could not save the prompt')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
            error={errorMessage}
        />
    )
}

export default UpdatePrompt
