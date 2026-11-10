import { connectToDB, dbErrorResponse } from "@utils/database"
import Prompt from "@models/prompt"

export const GET = async (request, { params }) => {
    try{
        await connectToDB()
        const { id } = await params

        const prompt = await Prompt.findById(id).populate('creator')

        if(!prompt) new Response("Prompt not found", { status: 404 })

        return new Response(JSON.stringify(prompt), { status: 200 })
    }catch(error){
        return dbErrorResponse(error, "Failed to fetch all prompts")
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tag } =  await request.json()

    try {
        await connectToDB()
        const { id } = await params

        const existingPrompt =  await Prompt.findById(id)

        if(!existingPrompt) {
            return new Response("Prompt not found", { status: 404 })
        }

        existingPrompt.prompt = prompt
        existingPrompt.tag = tag

        await existingPrompt.save()

        return new Response("Successfully updated the Prompts", { status: 200 })
    } catch (error) {
        return dbErrorResponse(error, "Error to update prompt")
    }
}

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB()
        const { id } = await params

        await Prompt.findByIdAndRemove(id)

        return new Response("Prompt deleted successfully", { status: 200 })
    } catch (error) {
        return dbErrorResponse(error, "Failed to delete prompt")
    }
}
