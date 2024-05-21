import { PrismaClient } from '@prisma/client'; 
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
const prisma = new PrismaClient();
export const actions: Actions = {
    create: async ({ request }) => {
        try {
            let formData = await request.formData();
            let reactionTime = Number(formData.get('reactionTime'))
            const isBlack = formData.get('isBlack') === 'true';
            const isArmed = formData.get('isArmed') === 'true';
            const isCorrect = formData.get('isCorrect') === 'true';
            const isSlow = formData.get('isSlow') === 'true';
            let result = await prisma.testResult.create({
                data: {
                    reactionTime,
                    isBlack,
                    isArmed,
                    isCorrect,
                    isSlow
                }
            })
        } catch (err) {
            console.log(err)
            return fail(500, { message: "Cannot submit test result" })
        }
        return { status: 201 }
    }
}
