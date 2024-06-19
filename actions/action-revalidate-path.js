"use server";
const { revalidatePath } = require("next/cache")
export const actionRevalidatePath=async(path)=>{
    revalidatePath(path); 
}
