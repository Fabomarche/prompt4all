import PromptCard from "./PromptCard"

const Profile = ({ name, desc, data, handleEdit, handleDelete, error }) => {
    const posts = Array.isArray(data) ? data : []

    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="blue_gradient">{name} Profile</span>
            </h1>
            <p className="desc text-left">{desc}</p>
            {error ? (
                <p className="mt-4 font-inter text-sm text-red-500">{error}</p>
            ) : null}
            <div className='mt-10 prompt_layout'>
                {posts.map(post => (
                    <PromptCard
                        key={post._id}
                        post={post}
                        handleEdit={() => handleEdit && handleEdit(post)}
                        handleDelete={() => handleDelete && handleDelete(post)}
                    />
                ))}
            </div>

        </section>
    )
}

export default Profile