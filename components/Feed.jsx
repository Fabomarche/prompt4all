'use client'

import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data.map(post => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [allPosts, setAllPosts] = useState([])
    const [searchText, setSearchText] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [searchedResults, setSearchedResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')



    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/prompt')
            let data = null
            try {
                data = await response.json()
            } catch {
                data = null
            }

            if (!response.ok || !Array.isArray(data)) {
                setAllPosts([])
                setErrorMessage(typeof data?.error === 'string' ? data.error : 'Could not load prompts')
                return
            }

            setErrorMessage('')
            setAllPosts(data)
        } catch (error) {
            console.error('Failed to load prompts:', error.message)
            setAllPosts([])
            setErrorMessage('Could not load prompts')
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])


    const filterPrompts = (searchtext) => {
        const regex = new RegExp(searchtext, "i");
        return allPosts.filter(
            (item) =>
                regex.test(item.creator.username) ||
                regex.test(item.tag) ||
                regex.test(item.prompt)
        );
    }

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);


        setSearchTimeout(
            setTimeout(() => {
                const searchResult = filterPrompts(e.target.value);
                setSearchedResults(searchResult);
            }, 500)
        );
    }


    const handleTagClick = (tagName) => {
        setSearchText(tagName);

        const searchResult = filterPrompts(tagName);
        setSearchedResults(searchResult);
    }


    return (
        <section className='feed'>
            <form className='relative w-full flex-center'>
                <input
                    type="text"
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>

            {errorMessage ? (
                <p className="mt-10 text-center font-inter text-sm text-red-500">{errorMessage}</p>
            ) : searchText ? (
                <PromptCardList
                    data={searchedResults}
                    handleTagClick={handleTagClick}
                />
            ) : (
                <PromptCardList
                    data={allPosts}
                    handleTagClick={handleTagClick}
                />
            )

            }
        </section>
    )
}

export default Feed