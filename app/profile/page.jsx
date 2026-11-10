'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile'

const MyProfile = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const [posts, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDetele = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")
        if (hasConfirmed) {
            try {
                const response = await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'DELETE'
                })

                if (!response.ok) {
                    let data = null
                    try {
                        data = await response.json()
                    } catch {
                        data = null
                    }
                    setErrorMessage(typeof data?.error === 'string' ? data.error : 'Could not delete the prompt')
                    return
                }

                const filterPosts = posts.filter(p => p._id !== post._id)

                setErrorMessage('')
                setPosts(filterPosts)
            } catch (error) {
                console.error('Failed to delete prompt:', error.message)
                setErrorMessage('Could not delete the prompt')
            }
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/users/${session?.user.id}/posts`)
                let data = null
                try {
                    data = await response.json()
                } catch {
                    data = null
                }

                if (!response.ok || !Array.isArray(data)) {
                    setPosts([])
                    setErrorMessage(typeof data?.error === 'string' ? data.error : 'Could not load prompts')
                    return
                }

                setErrorMessage('')
                setPosts(data)
            } catch (error) {
                console.error('Failed to load profile prompts:', error.message)
                setPosts([])
                setErrorMessage('Could not load prompts')
            }
        }
        if (session?.user.id) fetchPosts()
    }, [session?.user.id])

    return (
        <Profile
            name="My"
            desc="Welcome to your personalized profile page"
            data={posts}
            error={errorMessage}
            handleEdit={handleEdit}
            handleDelete={handleDetele}
        />
    )
}

export default MyProfile