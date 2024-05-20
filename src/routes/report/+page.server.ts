import { PrismaClient } from '@prisma/client'; 
import type { PageServerLoad  } from './$types';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
const prisma = new PrismaClient();
export const load: PageServerLoad  = async () => {
    return {
        results: await prisma.testResult.findMany()
    }
}

export const actions: Actions = {
    delete: async () => {
        try {
            await prisma.testResult.deleteMany()
        } catch (err) {
            console.log(err)
            return fail(500, { message: "Cannot delete results." })
        }
        return { status: 200 }
    }
}
